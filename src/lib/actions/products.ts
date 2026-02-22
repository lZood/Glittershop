'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

// Define the input type explicitly or import it if shared
// Using a simplified version of the Zod schema for the action input
type ProductActionInput = {
    title: string;
    slug: string;
    description?: string;
    base_price: number;
    sale_price?: number;
    cost_price?: number;
    is_active: boolean;
    category: string; // Name of the category
    tags?: string[];
    size_guide_type?: string;
    care_instructions?: string;
    video?: string;
    variants: {
        sku: string;
        material?: string; // Mapped to color/size usually, or stored in metadata? Schema has color/size columns
        color?: string;
        size?: string;
        stock: number;
        price_adjustment: number;
        color_metadata?: Record<string, any>;
    }[];
    // Image URLs grouped by color (passed from client after upload)
    imageUrls: {
        url: string;
        color?: string; // 'default' or specific color
        isPrimary: boolean;
        storagePath?: string;
    }[];
};

export async function createProduct(data: ProductActionInput) {
    const supabase = await createClient();
    console.log('🚀 [CREATE] Iniciando creación de producto:', data.title);

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('❌ [CREATE] No autorizado (no se encontró usuario)');
        return { success: false, error: 'Unauthorized' };
    }
    console.log('👤 [CREATE] Usuario identificado:', user.email);

    const isAdmin = await checkAdmin(supabase, user.id);
    if (!isAdmin) {
        console.error('❌ [CREATE] USER IS NOT ADMIN', user.id);
        return { success: false, error: 'Forbidden: Admin access required' };
    }

    // Use admin client for DB writes (bypasses RLS)
    const adminSupabase = createAdminClient();

    try {
        // 2. Resolve Category ID
        let categoryId: number | null = null;

        // Use .maybeSingle() to avoid error if not found
        const { data: existingCategory, error: catFetchError } = await adminSupabase
            .from('categories')
            .select('id')
            .ilike('name', data.category)
            .maybeSingle();

        if (catFetchError) {
            console.error('Error fetching category:', catFetchError);
            return { success: false, error: `Error al buscar categoría: ${catFetchError.message}` };
        }

        if (existingCategory) {
            categoryId = existingCategory.id;
        } else {
            // Create new category if it doesn't exist
            const { data: newCategory, error: createCatError } = await adminSupabase
                .from('categories')
                .insert({ name: data.category })
                .select('id')
                .single();

            if (createCatError || !newCategory) {
                console.error('Error creating category:', createCatError);
                return {
                    success: false,
                    error: `Error al crear categoría "${data.category}": ${createCatError?.message || 'No se recibió el ID de la nueva categoría'}`
                };
            }
            categoryId = newCategory.id;
        }

        // 3. Insert Product
        const { data: product, error: productError } = await adminSupabase
            .from('products')
            .insert({
                name: data.title,
                slug: data.slug,
                description: data.description,
                price: data.sale_price && data.sale_price > 0 ? data.sale_price : data.base_price,
                original_price: data.sale_price && data.sale_price > 0 ? data.base_price : null,
                cost_price: data.cost_price,
                stock: data.variants.reduce((acc, v) => acc + v.stock, 0),
                category_id: categoryId,
                is_active: data.is_active,
                tags: data.tags,
                size_guide_type: data.size_guide_type,
                care_instructions: data.care_instructions,
                video: data.video
            })
            .select('id')
            .single();

        if (productError || !product) {
            console.error('Error inserting product:', productError);
            if (productError?.code === '23505') {
                return { success: false, error: `El slug "${data.slug}" ya está en uso. Por favor elige otro URL.` };
            }
            return { success: false, error: `Failed to create product: ${productError.message}` };
        }

        const productId = product.id;

        // 4. Insert Variants
        if (data.variants && data.variants.length > 0) {
            const variantsData = data.variants.map(v => ({
                product_id: productId,
                sku: v.sku,
                color: v.color,
                size: v.size,
                stock: v.stock,
                price_adjustment: v.price_adjustment,
                color_metadata: v.color_metadata
            }));

            const { error: variantsError } = await adminSupabase
                .from('product_variants')
                .insert(variantsData);

            if (variantsError) {
                console.error('Error inserting variants:', variantsError);
                return { success: false, error: `Failed to create variants: ${variantsError.message}` };
            }
        }

        // 5. Insert Images
        if (data.imageUrls && data.imageUrls.length > 0) {
            const imagesData = data.imageUrls.map(img => ({
                product_id: productId,
                image_url: img.url,
                is_primary: img.isPrimary,
                color: img.color === 'default' ? null : img.color,
                storage_path: img.storagePath
            }));

            const { error: imagesError } = await adminSupabase
                .from('product_images')
                .insert(imagesData);

            if (imagesError) {
                console.error('Error inserting images:', imagesError);
                return { success: false, error: `Failed to save images: ${imagesError.message}` };
            }
        }

        // 6. Stripe Sync — Create Product + Price
        try {
            const primaryImage = data.imageUrls?.find(img => img.isPrimary)?.url
                || data.imageUrls?.[0]?.url;

            const stripeProduct = await stripe.products.create({
                name: data.title,
                description: data.description || undefined,
                active: data.is_active,
                images: primaryImage ? [primaryImage] : [],
                metadata: {
                    supabase_product_id: String(productId),
                    slug: data.slug,
                },
            });

            // Price in centavos (MXN × 100)
            const basePrice = data.sale_price && data.sale_price > 0
                ? data.sale_price
                : data.base_price;

            const stripePrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: Math.round(basePrice * 100),
                currency: 'mxn',
            });

            // Save Stripe IDs back to Supabase
            await adminSupabase
                .from('products')
                .update({
                    stripe_product_id: stripeProduct.id,
                    stripe_price_id: stripePrice.id,
                })
                .eq('id', productId);

            console.log('✅ Stripe sync: Product', stripeProduct.id, 'Price', stripePrice.id);
        } catch (stripeError: any) {
            // Log but don't fail the product creation — it's already saved in DB
            console.error('⚠️ Stripe sync failed (product saved to DB):', stripeError.message);
        }

        revalidatePath('/admin/inventory');
        revalidatePath('/shop');
        return { success: true, productId };

    } catch (err: any) {
        console.error('Unexpected error:', err);
        return { success: false, error: err.message || 'An unexpected error occurred' };
    }
}

export async function updateProduct(productId: string, data: ProductActionInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const isAdmin = await checkAdmin(supabase, user.id);
    if (!isAdmin) {
        console.error("❌ [DEBUG ACTION] USER IS NOT ADMIN", user.id);
        return { success: false, error: 'Forbidden: Admin access required' };
    }

    const adminSupabase = createAdminClient();
    console.log("🔍 [DEBUG ACTION] STARTING UPDATE for Product ID:", productId);
    console.log("📦 [DEBUG ACTION] PAYLOAD:", JSON.stringify(data, null, 2));

    try {
        // 1. Resolve Category (Match by name)
        let categoryId: number | null = null;
        console.log("🔍 [DEBUG ACTION] RESOLVING CATEGORY:", data.category);
        const { data: existingCategory } = await adminSupabase
            .from('categories')
            .select('id')
            .ilike('name', data.category)
            .maybeSingle();

        if (existingCategory) {
            categoryId = existingCategory.id;
        } else {
            const { data: newCategory, error: createCatError } = await adminSupabase
                .from('categories')
                .insert({ name: data.category })
                .select('id')
                .single();
            if (createCatError || !newCategory) {
                console.error("❌ [DEBUG ACTION] ERROR CREATING CATEGORY:", createCatError);
                throw new Error(`Error creating category: ${createCatError?.message}`);
            }
            categoryId = newCategory.id;
        }
        console.log("✅ [DEBUG ACTION] CATEGORY RESOLVED ID:", categoryId);

        // 2. Update Product Fields
        console.log("🔍 [DEBUG ACTION] UPDATING PRODUCT TABLE...");
        const { error: productError } = await adminSupabase
            .from('products')
            .update({
                name: data.title,
                slug: data.slug,
                description: data.description,
                price: data.sale_price && data.sale_price > 0 ? data.sale_price : data.base_price,
                original_price: data.sale_price && data.sale_price > 0 ? data.base_price : null,
                cost_price: data.cost_price,
                stock: data.variants.reduce((acc, v) => acc + v.stock, 0),
                category_id: categoryId,
                is_active: data.is_active,
                tags: data.tags,
                size_guide_type: data.size_guide_type,
                care_instructions: data.care_instructions,
                video: data.video,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId);

        if (productError) {
            console.error("❌ [DEBUG ACTION] PRODUCT UPDATE FAILED:", productError);
            throw new Error(`Failed to update product: ${productError.message}`);
        }
        console.log("✅ [DEBUG ACTION] PRODUCT TABLE UPDATED");

        // 3. Handle Variants (Sync)
        console.log("🔍 [DEBUG ACTION] SYNCING VARIANTS...");
        // Fetch existing
        const { data: existingVariants, error: fetchVarError } = await adminSupabase
            .from('product_variants')
            .select('id, sku')
            .eq('product_id', productId);

        if (fetchVarError) throw fetchVarError;

        const incomingSkus = data.variants.map(v => v.sku);
        const variantsToDelete = existingVariants?.filter(v => !incomingSkus.includes(v.sku)).map(v => v.id) || [];

        // Delete removed
        if (variantsToDelete.length > 0) {
            console.log("🗑️ [DEBUG ACTION] DELETING VARIANTS:", variantsToDelete);
            await adminSupabase.from('product_variants').delete().in('id', variantsToDelete);
        }

        // Upsert (Update or Insert)
        console.log("🔍 [DEBUG ACTION] UPSERTING VARIANTS COUNT:", data.variants.length);
        for (const v of data.variants) {
            const variantData = {
                product_id: productId,
                sku: v.sku,
                color: v.color,
                size: v.size,
                stock: v.stock,
                price_adjustment: v.price_adjustment,
                color_metadata: v.color_metadata,
                updated_at: new Date().toISOString()
            };

            const existing = existingVariants?.find(ex => ex.sku === v.sku);
            if (existing) {
                // console.log("   🔄 Updating Variant:", v.sku);
                await adminSupabase.from('product_variants').update(variantData).eq('id', existing.id);
            } else {
                // console.log("   ✨ Inserting Variant:", v.sku);
                await adminSupabase.from('product_variants').insert(variantData);
            }
        }
        console.log("✅ [DEBUG ACTION] VARIANTS SYNCED");

        // 4. Handle Images (Sync: Replace Strategy)
        console.log("🔍 [DEBUG ACTION] SYNCING IMAGES...");
        // Delete current mapping
        const { error: delImgError } = await adminSupabase.from('product_images').delete().eq('product_id', productId);
        if (delImgError) console.error("⚠️ [DEBUG ACTION] ERROR DELETE IMAGES:", delImgError);

        // Insert new mapping
        if (data.imageUrls && data.imageUrls.length > 0) {
            console.log("   📸 Inserting Images Count:", data.imageUrls.length);
            const imagesData = data.imageUrls.map(img => ({
                product_id: productId,
                image_url: img.url,
                is_primary: img.isPrimary,
                color: img.color === 'default' ? null : img.color,
                storage_path: img.storagePath
            }));
            const { error: insImgError } = await adminSupabase.from('product_images').insert(imagesData);
            if (insImgError) {
                console.error("❌ [DEBUG ACTION] ERROR INSERT IMAGES:", insImgError);
                throw insImgError;
            }
        }
        console.log("✅ [DEBUG ACTION] IMAGES SYNCED");

        // 5. Stripe Sync — Update Product + Price
        try {
            // Fetch existing Stripe IDs
            const { data: currentProduct } = await adminSupabase
                .from('products')
                .select('stripe_product_id, stripe_price_id, price')
                .eq('id', productId)
                .single();

            const primaryImage = data.imageUrls?.find(img => img.isPrimary)?.url
                || data.imageUrls?.[0]?.url;

            const newPrice = data.sale_price && data.sale_price > 0
                ? data.sale_price
                : data.base_price;

            if (currentProduct?.stripe_product_id) {
                // Update existing Stripe product
                await stripe.products.update(currentProduct.stripe_product_id, {
                    name: data.title,
                    description: data.description || '',
                    active: data.is_active,
                    images: primaryImage ? [primaryImage] : [],
                    metadata: {
                        supabase_product_id: String(productId),
                        slug: data.slug,
                    },
                });

                // Check if price changed — Stripe prices are immutable, create new one
                const oldPriceAmount = currentProduct.price ? Math.round(Number(currentProduct.price) * 100) : 0;
                const newPriceAmount = Math.round(newPrice * 100);

                if (oldPriceAmount !== newPriceAmount) {
                    // Create new price
                    const stripePrice = await stripe.prices.create({
                        product: currentProduct.stripe_product_id,
                        unit_amount: newPriceAmount,
                        currency: 'mxn',
                    });

                    // Deactivate old price
                    if (currentProduct.stripe_price_id) {
                        await stripe.prices.update(currentProduct.stripe_price_id, { active: false });
                    }

                    // Update DB with new price ID
                    await adminSupabase
                        .from('products')
                        .update({ stripe_price_id: stripePrice.id })
                        .eq('id', productId);

                    console.log('✅ Stripe sync: New price', stripePrice.id);
                }

                console.log('✅ Stripe sync: Product updated', currentProduct.stripe_product_id);
            } else {
                // Product exists in DB but not in Stripe — create it
                const stripeProduct = await stripe.products.create({
                    name: data.title,
                    description: data.description || undefined,
                    active: data.is_active,
                    images: primaryImage ? [primaryImage] : [],
                    metadata: {
                        supabase_product_id: String(productId),
                        slug: data.slug,
                    },
                });

                const stripePrice = await stripe.prices.create({
                    product: stripeProduct.id,
                    unit_amount: Math.round(newPrice * 100),
                    currency: 'mxn',
                });

                await adminSupabase
                    .from('products')
                    .update({
                        stripe_product_id: stripeProduct.id,
                        stripe_price_id: stripePrice.id,
                    })
                    .eq('id', productId);

                console.log('✅ Stripe sync: Created product', stripeProduct.id, 'price', stripePrice.id);
            }
        } catch (stripeError: any) {
            console.error('⚠️ Stripe sync failed during update:', stripeError.message);
        }

        revalidatePath('/admin/inventory');
        revalidatePath(`/admin/inventory/${productId}`);
        revalidatePath('/shop');
        revalidatePath(`/products/${data.slug}`);

        return { success: true, productId };

    } catch (err: any) {
        console.error('🚨 [DEBUG ACTION] CRITICAL UPDATE ERROR:', err);
        return { success: false, error: err.message || 'Error updating product' };
    }
}



const ADMIN_EMAILS = ['jramirezlopez03@gmail.com', 'admin@glittershop.com', 'antigravity@glittershop.com']; // Add your admin emails here

async function checkAdmin(supabase: any, userId: string) {
    // 1. Check against hardcoded allowed emails (Quickest fix)
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email && ADMIN_EMAILS.includes(user.email)) {
        return true;
    }

    // 2. Check Role in DB
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    return profile?.role === 'admin';
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const isAdmin = await checkAdmin(supabase, user.id);
    if (!isAdmin) return { success: false, error: 'Forbidden: Admin access required' };

    const adminSupabase = createAdminClient();

    // Archive in Stripe before deleting from DB
    try {
        const { data: product } = await adminSupabase
            .from('products')
            .select('stripe_product_id, stripe_price_id')
            .eq('id', productId)
            .single();

        if (product?.stripe_product_id) {
            // Deactivate the price first
            if (product.stripe_price_id) {
                await stripe.prices.update(product.stripe_price_id, { active: false });
            }
            // Archive the product (Stripe doesn't allow hard delete)
            await stripe.products.update(product.stripe_product_id, { active: false });
            console.log('✅ Stripe sync: Archived product', product.stripe_product_id);
        }
    } catch (stripeError: any) {
        console.error('⚠️ Stripe archive failed during delete:', stripeError.message);
    }

    const { error } = await adminSupabase.from('products').delete().eq('id', productId);

    if (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/inventory');
    return { success: true };
}

export async function updateVariantStock(variantId: number, newStock: number) {
    const supabase = await createClient(); // Standard client for checking WHO is asking
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const isAdmin = await checkAdmin(supabase, user.id);
    if (!isAdmin) return { success: false, error: 'Forbidden: Admin access required' };

    // Use Admin Client only AFTER verifying the user is an admin
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
        .from('product_variants')
        .update({ stock: newStock })
        .eq('id', variantId);

    if (error) return { success: false, error: error.message };

    // Trigger revalidation
    revalidatePath('/admin/inventory');
    revalidatePath('/shop'); // Update shop listing if stock affects visibility
    return { success: true };
}

export async function toggleProductStatus(productId: string, isActive: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const isAdmin = await checkAdmin(supabase, user.id);
    if (!isAdmin) return { success: false, error: 'Forbidden: Admin access required' };

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', productId);

    if (error) return { success: false, error: error.message };

    // Sync active state to Stripe
    try {
        const { data: product } = await adminSupabase
            .from('products')
            .select('stripe_product_id')
            .eq('id', productId)
            .single();

        if (product?.stripe_product_id) {
            await stripe.products.update(product.stripe_product_id, { active: isActive });
            console.log('✅ Stripe sync: toggled active =', isActive);
        }
    } catch (stripeError: any) {
        console.error('⚠️ Stripe toggle sync failed:', stripeError.message);
    }

    revalidatePath('/admin/inventory');
    revalidatePath(`/admin/inventory/${productId}`);
    revalidatePath('/shop');
    return { success: true };
}

export async function updateProductStock(productId: string, newStock: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/inventory');
    return { success: true };
}

/**
 * Uploads a product image from the server to bypass client-side connectivity/auth issues.
 * @param formData FormData containing 'file' (Blob) and 'fileName' (string)
 */
export async function uploadProductImage(formData: FormData) {
    const fileName = formData.get('fileName') as string;
    const file = formData.get('file') as Blob;

    console.log(`📤 [SERVER UPLOAD] Iniciando subida de: ${fileName} (${(file?.size / 1024).toFixed(0)}KB)`);

    try {
        const supabase = await createClient();

        // 1. Auth Check
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
            console.error('❌ [SERVER UPLOAD] No autorizado:', authError);
            return { success: false, error: 'Unauthorized' };
        }

        const isAdmin = await checkAdmin(supabase, authData.user.id);
        if (!isAdmin) {
            console.error('❌ [SERVER UPLOAD] El usuario no es administrador:', authData.user.email);
            return { success: false, error: 'Forbidden: Admin access required' };
        }

        const adminSupabase = createAdminClient();

        // 2. Convert Blob to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Upload to 'products' bucket
        const { data, error } = await adminSupabase.storage
            .from('products')
            .upload(fileName, buffer, {
                contentType: file.type || 'image/jpeg',
                upsert: true
            });

        if (error) {
            console.error('❌ [SERVER UPLOAD] Error de Supabase:', error);
            return { success: false, error: error.message };
        }

        // 4. Get Public URL
        const { data: { publicUrl } } = adminSupabase.storage
            .from('products')
            .getPublicUrl(fileName);

        console.log(`✅ [SERVER UPLOAD] Éxito: ${publicUrl}`);
        return {
            success: true,
            url: publicUrl,
            storagePath: data.path
        };
    } catch (err: any) {
        console.error('🚨 [SERVER UPLOAD] Error crítico:', err);
        return { success: false, error: err.message || 'Error interno del servidor al subir' };
    }
}
