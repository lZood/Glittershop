import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { createClient } from '@/lib/supabase/server';
import { SearchX } from 'lucide-react';
import { HeroSection } from '@/components/home/hero-section';
import { HomeAppMejoraContent } from '@/components/home/home-appmejora-content';

export const dynamic = 'force-dynamic';

export default async function Home(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q;
  const supabase = await createClient();

  if (query) {
    const { data: searchResults } = await supabase
      .from('products')
      .select('*, product_images(*), product_variants(*), categories(*)')
      .eq('is_active', true)
      .ilike('name', `%${query}%`);

    const mappedResults = (searchResults || []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price || 0,
      originalPrice: p.original_price && p.original_price > p.price ? p.original_price : undefined,
      image: { imageUrl: p.product_images?.find((i: any) => i.is_primary)?.image_url || '/placeholder.png', imageHint: p.name },
      images: p.product_images?.map((i: any) => i.image_url) || [],
      category: p.categories?.name,
      tags: p.tags || [],
      variants: p.product_variants || []
    }));

    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-6">Resultados para "{query}"</h1>
        {mappedResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mappedResults.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchX className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-lg text-slate-500">No encontramos productos que coincidan.</p>
            <Button asChild variant="link" className="mt-4">
              <Link href="/shop">Ver todo el catálogo</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  const { data: allActiveProductCategories } = await supabase
    .from('products')
    .select('categories(name)')
    .eq('is_active', true);

  const categoryCounts: Record<string, number> = {};
  if (allActiveProductCategories) {
    allActiveProductCategories.forEach((p: any) => {
      const catName = p.categories?.name;
      if (catName) {
        categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
      }
    });
  }

  const categoryData = [
    { name: 'Anillos', image: '/images/CatAnillo.png', link: '/shop?category=rings' },
    { name: 'Collares', image: '/images/CatCollar.png', link: '/shop?category=necklaces' },
    { name: 'Pulseras', image: '/images/CatPulseras.png', link: '/shop?category=bracelets' },
    { name: 'Aretes', image: '/images/CatAretes.png', link: '/shop?category=earrings' }
  ];

  const categories = categoryData.map((c) => ({
    ...c,
    count: categoryCounts[c.name] || 0
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeroSection />
      <HomeAppMejoraContent categories={categories} />
    </div>
  );
}
