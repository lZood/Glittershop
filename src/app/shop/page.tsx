import { createClient } from '@/lib/supabase/server';
import { ShopClient } from '@/components/shop/shop-client';
import type { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const supabase = await createClient();

  const { data: dbProducts, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      product_images (image_url, is_primary),
      product_variants (id, stock, price_adjustment, color)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching shop products:", error);
  }

  // Map DB products to Frontend Product type
  const colorMap: Record<string, string> = {
    'oro': '#FFD700',
    'gold': '#FFD700',
    'plata': '#E3E4E5',
    'silver': '#E3E4E5',
    'plateado': '#E3E4E5',
    'oro rosa': '#E0BFB8',
    'rose gold': '#E0BFB8',
    'negro': '#000000',
    'blanco': '#FFFFFF',
    'rojo': '#EF4444',
    'azul': '#3B82F6',
    'verde': '#22C55E',
  };

  const products: Product[] = (dbProducts || []).map((p: any) => {
    // Determine price using actual DB columns: price and original_price
    const price = p.price || 0;
    const originalPrice = p.original_price && p.original_price > p.price ? p.original_price : undefined;

    // Resolve Main Image
    const mainImageObj = p.product_images?.find((img: any) => img.is_primary) || p.product_images?.[0];
    const mainImageUrl = mainImageObj?.image_url || '/placeholder.png'; // Fallback

    // Resolve Colors from variants
    const rawColors = Array.from(new Set(p.product_variants?.map((v: any) => v.color).filter(Boolean))) as string[];
    const colors = rawColors.map(c => colorMap[c.toLowerCase()] || c);

    // Resolve Image Array
    const images = p.product_images?.map((img: any) => img.image_url) || [];

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: price,
      originalPrice: originalPrice,
      description: p.description || "",
      // Map to shape expected by ProductCard
      image: {
        imageUrl: mainImageUrl,
        imageHint: p.description
      },
      images: images,
      category: p.categories?.name || "General",
      colors: colors,
      tags: p.tags || [],
      variants: p.product_variants || []
    } as any;
  });

  return (
    <ShopClient initialProducts={products} />
  );
}
