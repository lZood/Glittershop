import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import { Product } from "@/lib/types";
import { ReviewsSection } from "@/components/reviews/reviews-section";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (name),
            product_variants (*),
            product_images (*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

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
        // Calculate price per variant if needed, or just allow access to base + adjustment
        price: (product.sale_price || product.base_price) + (v.price_adjustment || 0)
    })) || [];

    // Map to frontend Product type
    const mappedProduct: Product = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price, // Default/Display price
        originalPrice: undefined,
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

    // Correct price mapping logic
    if (product.sale_price && product.sale_price > 0 && product.sale_price < product.price) {
        mappedProduct.price = product.sale_price;
        mappedProduct.originalPrice = product.price;
    } else {
        mappedProduct.price = product.price;
        mappedProduct.originalPrice = undefined;
    }

    return (
        <ProductDetailClient product={mappedProduct}>
            <ReviewsSection
                productId={product.id}
                productVariants={mappedVariants.map((v: any) => ({ color: v.color || '', size: v.size || '' }))}
            />
        </ProductDetailClient>
    );
}
