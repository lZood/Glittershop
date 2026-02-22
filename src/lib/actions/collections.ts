'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = ['jramirezlopez03@gmail.com', 'admin@glittershop.com', 'antigravity@glittershop.com'];

async function checkAdmin(userId: string) {
    const supabase = await createClient();

    // 1. Check against hardcoded allowed emails
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

export async function checkSlugAvailability(slug: string) {
    const supabase = await createClient();
    const { count, error } = await supabase
        .from('collections')
        .select('*', { count: 'exact', head: true })
        .eq('slug', slug);

    if (error) {
        console.error("Error checking slug:", error);
        return false;
    }

    return count === 0;
}

const collectionSchema = {
    name: (val: string) => val && val.length >= 3,
    slug: (val: string) => val && val.length >= 3,
};

export async function createCollection(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { message: "No autorizado" };
    }

    const isAdmin = await checkAdmin(user.id);
    if (!isAdmin) {
        return { message: "Acceso denegado: Se requieren permisos de administrador" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("image_url") as string;
    const isActive = formData.get("is_active") === "true";
    const productIdsStr = formData.get("product_ids") as string; // "1,2,3"

    // Simple validation
    if (!collectionSchema.name(name) || !collectionSchema.slug(slug)) {
        return { errors: "Datos inválidos: Nombre y slug son requeridos (min 3 caracteres)" };
    }

    const adminSupabase = createAdminClient();

    try {
        // 1. Create Collection
        const { data: collection, error: insertError } = await adminSupabase
            .from('collections')
            .insert({
                name,
                slug,
                description,
                image_url: imageUrl,
                is_active: isActive,
            })
            .select('id')
            .single();

        if (insertError) {
            console.error("Error creating collection:", insertError);
            return { message: `Error al crear la colección: ${insertError.message}` };
        }

        // 2. Link Products
        if (productIdsStr && productIdsStr.length > 0) {
            const productIds = productIdsStr.split(',').filter(Boolean);

            if (productIds.length > 0) {
                const links = productIds.map(pid => ({
                    collection_id: collection.id,
                    product_id: pid
                }));

                const { error: linkError } = await adminSupabase
                    .from('collection_products')
                    .insert(links);

                if (linkError) {
                    console.error("Error linking products:", linkError);
                }
            }
        }

        revalidatePath('/admin/collections');
        revalidatePath('/collections');
        revalidatePath(`/collections/${slug}`);

        return { message: null }; // Success

    } catch (error: any) {
        console.error("Unexpected error:", error);
        return { message: error.message || "Error inesperado" };
    }
}

export async function updateCollection(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, message: "No autorizado" };
    }

    const isAdmin = await checkAdmin(user.id);
    if (!isAdmin) {
        return { success: false, message: "Acceso denegado" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("image_url") as string;
    const isActive = formData.get("is_active") === "true";
    const productIdsStr = formData.get("product_ids") as string;

    const adminSupabase = createAdminClient();

    try {
        // 1. Update Collection
        const { error: updateError } = await adminSupabase
            .from('collections')
            .update({
                name,
                slug,
                description,
                image_url: imageUrl,
                is_active: isActive,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (updateError) {
            console.error("Error updating collection:", updateError);
            return { success: false, message: updateError.message };
        }

        // 2. Update Products (Delete all, then insert new)
        // Note: Ideally use a diff, but this is safer for now.
        const { error: deleteError } = await adminSupabase
            .from('collection_products')
            .delete()
            .eq('collection_id', id);

        if (deleteError) {
            console.error("Error clearing collection products:", deleteError);
            // Continue? Yes, try to insert new ones.
        }

        if (productIdsStr && productIdsStr.length > 0) {
            const productIds = productIdsStr.split(',').filter(Boolean);
            if (productIds.length > 0) {
                const links = productIds.map(pid => ({
                    collection_id: id,
                    product_id: pid
                }));

                const { error: linkError } = await adminSupabase
                    .from('collection_products')
                    .insert(links);

                if (linkError) {
                    console.error("Error linking products:", linkError);
                    return { success: false, message: "Error al actualizar productos" };
                }
            }
        }

        revalidatePath('/admin/collections');
        revalidatePath(`/admin/collections/${id}`);
        revalidatePath('/collections');
        revalidatePath(`/collections/${slug}`);

        return { success: true, message: "Colección actualizada" };

    } catch (error: any) {
        console.error("Unexpected error:", error);
        return { success: false, message: error.message };
    }
}

export async function deleteCollection(id: string) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, message: "No autorizado" };
    }

    const isAdmin = await checkAdmin(user.id);
    if (!isAdmin) {
        return { success: false, message: "Acceso denegado" };
    }

    const adminSupabase = createAdminClient();

    try {
        // First delete relationships in collection_products (though they might have on delete cascade, it's safer)
        await adminSupabase
            .from('collection_products')
            .delete()
            .eq('collection_id', id);

        const { error } = await adminSupabase
            .from('collections')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting collection:", error);
            return { success: false, message: error.message };
        }

        revalidatePath('/admin/collections');
        revalidatePath('/collections');

        return { success: true, message: "Colección eliminada" };
    } catch (error: any) {
        console.error("Unexpected error in deleteCollection:", error);
        return { success: false, message: error.message || "Error inesperado" };
    }
}

export async function getCollection(id: string) {
    const supabase = await createClient();

    // Fetch collection with linked products
    const { data: collection, error } = await supabase
        .from('collections')
        .select(`
            *,
            collection_products (
                product_id,
                products (
                    id, 
                    name, 
                    price, 
                    product_images (image_url)
                )
            )
        `)
        .eq('id', id)
        .single();

    if (error || !collection) {
        console.error("Error fetching collection:", error);
        return null;
    }

    // Transform structure to match expected format
    const products = collection.collection_products
        ?.map((cp: any) => cp.products)
        .filter(Boolean) || []; // Filter out any nulls if join failed

    return {
        ...collection,
        products
    };
}

export async function searchProducts(query: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select(`
            id, 
            name, 
            slug, 
            price,
            original_price,
            product_images(image_url),
            product_variants(sku, stock)
        `)
        .ilike('name', `%${query}%`)
        .limit(20);

    if (error) {
        console.error("Search error:", error);
        return [];
    }
    return data;
}
