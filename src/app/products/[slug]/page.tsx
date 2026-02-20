import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import { Product } from "@/lib/types";
import { ReviewsSection } from "@/components/reviews/reviews-section";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let query = supabase
        .from('products')
        .select(`
            *,
            categories (name),
            product_variants (*),
            product_images (*)
        `)
        .eq('is_active', true);

    if (isUUID) {
        query = query.eq('id', slug);
    } else {
        query = query.eq('slug', slug);
    }

    const { data: product, error } = await query.single();

    if (error || !product) {
        notFound();
    }

    // Determine main image
    const sortedImages = product.product_images?.sort((a: any, b: any) => (a.is_primary === b.is_primary) ? 0 : a.is_primary ? -1 : 1) || [];
    const imageUrls = sortedImages.map((img: any) => img.image_url);
    if (imageUrls.length === 0) imageUrls.push('/placeholder.png'); // Fallback

    const mainImage = sortedImages[0];

    // Map variants
    const mappedVariants = product.product_variants?.map((v: any) => ({
        id: v.id,
        sku: v.sku,
        color: v.color,
        color_metadata: v.color_metadata,
        size: v.size,
        stock: v.stock,
        // Calculate price per variant: current selling price + variant adjustment
        price: product.price + (v.price_adjustment || 0)
    })) || [];

    // Map to frontend Product type
    // Determine sale status from DB columns
    const isOnSale = product.original_price && product.original_price > product.price;

    const mappedProduct: Product = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: isOnSale ? product.original_price : undefined,
        description: product.description || '',
        image: {
            id: mainImage?.id?.toString() || 'placeholder',
            imageUrl: mainImage?.image_url || '/placeholder.png',
            description: product.name,
            imageHint: product.name
        },
        images: imageUrls,
        images_metadata: product.product_images?.map((img: any) => ({
            url: img.image_url,
            color: img.color,
            is_primary: img.is_primary || false
        })) || [],
        category: product.categories?.name || 'General',
        rating: 5,
        reviews: 0,
        tags: product.tags || [],
        care_instructions: product.care_instructions,
        video: product.video,
        variants: mappedVariants
    };

    // Price mapping is already handled above via isOnSale check

    // Fetch Related Products (Same category, exclude current)
    const { data: relatedDbProducts } = await supabase
        .from('products')
        .select(`
            *,
            categories (name),
            product_images (image_url, is_primary),
            product_variants (color)
        `)
        .eq('category_id', product.category_id)
        .eq('is_active', true)
        .neq('id', product.id)
        .limit(8);

    const relatedProducts: Product[] = (relatedDbProducts || []).map((p: any) => {
        // Re-use simplified mapping logic for card display
        const mainImageObj = p.product_images?.find((img: any) => img.is_primary) || p.product_images?.[0];
        const mainImageUrl = mainImageObj?.image_url || '/placeholder.png';
        const price = p.price || 0;
        const originalPrice = p.original_price && p.original_price > p.price ? p.original_price : undefined;

        return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            price: price,
            originalPrice: originalPrice,
            description: p.description || "",
            image: {
                imageUrl: mainImageUrl,
                imageHint: p.description
            },
            images: p.product_images?.map((img: any) => img.image_url) || [],
            category: p.categories?.name || "General",
            colors: Array.from(new Set(p.product_variants?.map((v: any) => v.color).filter(Boolean))) as string[],
            variants: [],
            tags: p.tags || []
        } as any;
    });

    return (
        <ProductDetailClient product={mappedProduct} relatedProducts={relatedProducts}>
            <ReviewsSection
                productId={product.id}
                productVariants={mappedVariants.map((v: any) => ({ color: v.color || '', size: v.size || '' }))}
            />
        </ProductDetailClient>
    );
}
