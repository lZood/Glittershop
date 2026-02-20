import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { SearchX, ChevronDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q;
  const supabase = await createClient();

  // Fetch Featured Collections for Hero
  const { data: dbCollections } = await supabase
    .from('collections')
    .select('*')
    .limit(3);

  const featuredCollections = (dbCollections && dbCollections.length > 0) ? dbCollections : [
    { id: 1, title: 'Luz de Luna', slug: 'luz-de-luna', image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, title: 'Golden Hour', slug: 'golden-hour', image_url: 'https://images.unsplash.com/photo-1605100804763-ebea4666d813?auto=format&fit=crop&q=80&w=1000' },
    { id: 3, title: 'Elegancia', slug: 'elegancia', image_url: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=1000' },
  ];

  // Search Logic
  if (query) {
    const { data: searchResults } = await supabase
      .from('products')
      .select('*, product_images(*), product_variants(*), categories(*)')
      .eq('is_active', true)
      .ilike('name', `%${query}%`);

    // Mapper (Simplified)
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
            <Button asChild variant="link" className="mt-4"><Link href="/shop">Ver todo el catálogo</Link></Button>
          </div>
        )}
      </div>
    );
  }

  // Fetch Best Sellers (Active Products, limit 4)
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*), categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false }) // Just newest for now as "Best Sellers" proxy
    .limit(4);

  const bestSellers = (dbProducts || []).map((p: any) => {
    // Determine price
    const price = p.price || 0;
    const originalPrice = p.original_price && p.original_price > p.price ? p.original_price : undefined;
    const mainImg = p.product_images?.find((img: any) => img.is_primary)?.image_url
      || p.product_images?.[0]?.image_url
      || 'https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?auto=format&fit=crop&q=80&w=1000';

    const colorMap: Record<string, string> = {
      'oro': '#FFD700', 'gold': '#FFD700', 'plata': '#E3E4E5', 'silver': '#E3E4E5', 'plateado': '#E3E4E5',
      'oro rosa': '#E0BFB8', 'rose gold': '#E0BFB8', 'negro': '#000000', 'blanco': '#FFFFFF',
      'rojo': '#EF4444', 'azul': '#3B82F6', 'verde': '#22C55E'
    };

    const colors = Array.from(new Set(p.product_variants?.map((v: any) => v.color).filter(Boolean))) as string[];
    const mappedColors = colors.map(c => colorMap[c.toLowerCase()] || c);

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price,
      originalPrice,
      description: p.description,
      image: { imageUrl: mainImg, imageHint: p.name },
      images: p.product_images?.map((i: any) => i.image_url) || [],
      category: p.categories?.name || "General",
      colors: mappedColors,
      tags: p.tags || [],
      variants: p.product_variants || []
    };
  });

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  const categories = [
    { name: 'Anillos', image: 'https://images.unsplash.com/photo-1605100804763-ebea4666d813?auto=format&fit=crop&q=80&w=600', link: '/shop?activeTag=Anillos' },
    { name: 'Collares', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=600', link: '/shop?activeTag=Collares' },
    { name: 'Pulseras', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', link: '/shop?activeTag=Pulseras' },
    { name: 'Aretes', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', link: '/shop?activeTag=Aretes' }
  ];

  const socialImages = [
    PlaceHolderImages.find(p => p.id === 'social-1'),
    PlaceHolderImages.find(p => p.id === 'social-2'),
    PlaceHolderImages.find(p => p.id === 'social-3'),
  ].filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      {/* 1. Hero Section */}
      <section className="relative w-full h-[90vh] flex flex-col justify-end items-center text-center overflow-hidden pb-24 md:pb-32">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Hero Collection"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

        <div className="relative z-10 px-4 max-w-4xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-xl font-medium leading-tight">
            Lujo en cada <br /> <span className="italic font-light">Detalle</span>
          </h1>
          <p className="text-xs md:text-sm text-white/90 mb-10 tracking-[0.25em] font-light max-w-lg mx-auto uppercase">
            Colecciones exclusivas para <br className="hidden md:block" /> momentos inolvidables
          </p>
          <Button asChild size="lg" className="bg-[#B87333] hover:bg-[#a0632a] text-white px-12 h-14 text-sm tracking-widest uppercase font-semibold rounded-md transition-all transform hover:scale-105 shadow-2xl border border-white/10">
            <Link href="/shop">Explorar Colección</Link>
          </Button>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce z-20">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* 2. Categories (Nuestras Favoritas) */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 uppercase tracking-widest text-[#B87333]">Nuestras Favoritas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((cat) => (
            <Link href={cat.link} key={cat.name} className="group relative aspect-[3/4] overflow-hidden bg-slate-100">
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-10 left-0 right-0 text-center">
                <span className="text-white text-xl md:text-2xl font-serif italic tracking-wider">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Best Sellers (Lo Más Vendido) */}
      <section className="py-24 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 md:px-10">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 uppercase tracking-widest text-[#B87333]">Lo Más Vendido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {bestSellers.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Button asChild variant="outline" className="rounded-none border-[#B87333] text-[#B87333] hover:bg-[#B87333] hover:text-white uppercase tracking-widest px-10 h-12 transition-all">
              <Link href="/shop">Ver Todo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Essence (Nuestra Esencia) */}
      <section className="py-32 bg-[#B87333] text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <span className="text-white/80 uppercase tracking-[0.2em] text-sm mb-8 block">Sobre Nosotros</span>
          <h2 className="text-4xl md:text-6xl font-serif mb-10 leading-tight">Nuestra Esencia</h2>
          <p className="text-lg md:text-2xl font-light leading-relaxed opacity-90 mb-12 italic">
            "En Glitters Shop, creemos que cada joya es un susurro de elegancia. Diseñamos para la mujer moderna que no teme brillar."
          </p>
          <div className="w-24 h-1 bg-white/30 mx-auto"></div>
        </div>
      </section>

      {/* 5. Social (#glittersshop) */}
      <section className="py-24 container mx-auto px-4 md:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-widest mb-3 text-[#B87333]">#Glittersshop</h2>
          <p className="text-muted-foreground tracking-wide">Síguenos en Instagram @glitters.shop</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socialImages.map((img: any, i: number) => {
            const titles = ["Estilo Diario", "Noches de Gala", "Detalles que Enamoran"];
            return (
              <div key={i} className="relative aspect-square group overflow-hidden bg-slate-100">
                {img && <Image src={img.imageUrl} alt="Social" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6">
                  <span className="text-white font-serif text-2xl mb-2 italic transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{titles[i]}</span>
                  <span className="text-white/80 text-sm uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">Ver Post</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  );
}
