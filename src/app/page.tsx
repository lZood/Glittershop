import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { SearchX, ChevronDown, ArrowRight, Truck, Percent, ShieldCheck, Undo2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q;
  const supabase = await createClient();

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

  // Fetch New Arrivals (Active Products, limit 8)
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*), categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8);

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

  // Calculate dynamic category counts
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

  const categories = categoryData.map(c => ({
    ...c,
    count: categoryCounts[c.name] || 0
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Hero Section with Video Background */}
      <section className="relative w-full h-[95vh] flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Video Background - Forced Cover Technique */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover z-0"
          style={{ objectFit: 'cover' }}
        >
          {/* Your local jewelry video background */}
          <source src="/videos/Video_Profesional_De_Joyería_Elegante.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-[1]" />

        <div className="relative z-10 px-4 max-w-4xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-16 md:mt-20">
          <span className="text-white/90 tracking-[0.3em] uppercase text-xs md:text-sm mb-6 font-medium">Joyería de Lujo</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 drop-shadow-lg font-light leading-tight">
            Elegancia Atemporal <br /> <span className="italic">Para Cada Momento</span>
          </h1>
          <p className="text-sm md:text-base text-white/90 mb-10 tracking-widest font-light max-w-xl mx-auto">
            Descubre obras maestras diseñadas para contar tu historia. Desde el brillo de todos los días hasta grandes celebraciones.
          </p>
          <Button asChild size="lg" className="bg-white hover:bg-white/90 text-black px-12 h-14 text-sm tracking-widest uppercase font-semibold rounded-none transition-all transform shadow-2xl">
            <Link href="/shop">Explorar Colección</Link>
          </Button>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce z-20">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="py-24 container mx-auto px-4 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-2 block">Selecciones Curadas</span>
            <h2 className="text-2xl md:text-3xl font-medium tracking-[0.1em] uppercase text-foreground">Compra por Categoría</h2>
          </div>
          <Link href="/shop" className="group flex items-center text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:text-primary transition-colors">
            Ver Todo
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link href={cat.link} key={cat.name} className="group relative aspect-[4/5] overflow-hidden bg-slate-100 block rounded-2xl">
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                <h3 className="text-white text-lg md:text-xl font-medium tracking-[0.1em] uppercase mb-1 relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">{cat.name}</h3>
                <span className="text-white/80 text-[10px] md:text-xs tracking-[0.2em] uppercase absolute bottom-4 md:bottom-6 left-5 md:left-6 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-white font-medium">
                  Explora {cat.count} estilos
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Horizontal Slider */}
      <section className="py-24 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-2 block">Lo Más Nuevo</span>
              <h2 className="text-2xl md:text-3xl font-medium tracking-[0.1em] uppercase text-foreground">Recién Llegados</h2>
            </div>
            <Link href="/shop?sort=newest" className="group flex items-center text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:text-primary transition-colors">
              Ver Todo
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-4 md:gap-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {bestSellers.map((product: any) => (
              <div key={product.id} className="w-[75vw] sm:w-[50vw] md:w-[320px] lg:w-[350px] flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}

            {/* View More Card */}
            <div className="w-[75vw] sm:w-[50vw] md:w-[320px] lg:w-[350px] flex-none snap-start flex items-center justify-center bg-background border border-border/50 rounded-lg p-6 group">
              <Link href="/shop?sort=newest" className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors text-center gap-4 w-full h-full min-h-[300px]">
                <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-8 h-8" />
                </div>
                <span className="font-serif text-xl tracking-wide uppercase">Cargar Más</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="py-24 container mx-auto px-4 lg:px-10 border-t border-border/50 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start group">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-foreground text-sm leading-relaxed font-medium">Envío gratis en compras desde $3,300 - Disponible en todo el país</p>
          </div>
          <div className="flex flex-col items-center md:items-start group">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
              <Percent className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-foreground text-sm leading-relaxed font-medium">Regístrate y obtén 10% de descuento en tu primera compra</p>
          </div>
          <div className="flex flex-col items-center md:items-start group">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-foreground text-sm leading-relaxed font-medium">Garantía por 1 año</p>
          </div>
          <div className="flex flex-col items-center md:items-start group">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
              <Undo2 className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-foreground text-sm leading-relaxed font-medium">Devoluciones sin costo</p>
          </div>
        </div>
      </section>
    </div>
  );
}
