'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Truck, Percent, ShieldCheck, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger);

type HomeCategory = {
  name: string;
  image: string;
  link: string;
  count: number;
};

type HomeEnhancedContentProps = {
  categories: HomeCategory[];
  bestSellers: Product[];
};

export function HomeEnhancedContent({ categories, bestSellers }: HomeEnhancedContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'top 56%',
              scrub: 0.25
            }
          }
        );
      });

      const categoryTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-categories-grid]',
          start: 'top 75%',
          end: 'bottom 55%',
          scrub: 0.4
        }
      });

      categoryTimeline
        .fromTo('[data-category-main]', { x: -56, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0)
        .fromTo('[data-category-side="1"]', { x: 48, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0.08)
        .fromTo('[data-category-side="2"]', { x: 48, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0.12)
        .fromTo('[data-category-side="3"]', { y: 32, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0.14);
    }, root);

    return () => ctx.revert();
  }, []);

  const editorialImages = [
    bestSellers[0]?.image?.imageUrl || '/images/CatAnillo.png',
    bestSellers[1]?.image?.imageUrl || '/images/CatCollar.png',
    bestSellers[2]?.image?.imageUrl || '/images/CatPulseras.png'
  ];

  const spotlightProduct = bestSellers[0];

  return (
    <div ref={rootRef}>
      <section className="py-20 md:py-24 container mx-auto px-4 lg:px-10" data-reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <span className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-2 block">Selecciones Curadas</span>
            <h2 className="text-2xl md:text-3xl font-medium tracking-[0.1em] uppercase text-foreground">Compra por Categoria</h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl">Inspirado en appMejora: composicion editorial con foco en imagen y ritmo visual.</p>
          </div>
          <Link href="/shop" className="group flex items-center text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:text-primary transition-colors w-fit">
            Ver Todo
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6" data-categories-grid>
          <Link
            href={categories[0]?.link || '/shop'}
            className="group relative lg:col-span-6 min-h-[380px] md:min-h-[560px] overflow-hidden rounded-3xl bg-secondary/20"
            data-category-main
          >
            <Image src={categories[0]?.image || '/images/CatAnillo.png'} alt={categories[0]?.name || 'Categoria'} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-white/70 text-[10px] tracking-[0.25em] uppercase mb-2">Categoria Principal</p>
              <h3 className="text-white text-2xl md:text-3xl font-medium tracking-[0.1em] uppercase">{categories[0]?.name}</h3>
              <p className="text-white/85 text-xs md:text-sm mt-2">Explora {categories[0]?.count || 0} estilos</p>
            </div>
          </Link>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {categories.slice(1).map((cat, index) => (
              <Link
                href={cat.link}
                key={cat.name}
                className="group relative min-h-[220px] md:min-h-[268px] overflow-hidden rounded-2xl bg-secondary/20"
                data-category-side={String(index + 1)}
              >
                <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h4 className="text-white text-lg font-medium tracking-[0.08em] uppercase">{cat.name}</h4>
                  <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase">{cat.count} disponibles</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-secondary/30" data-reveal>
        <div className="container mx-auto px-4 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-3 block">Nuestra Esencia</span>
              <h2 className="text-3xl md:text-4xl font-medium tracking-[0.06em] uppercase text-foreground leading-tight">Joyeria para usar todos los dias</h2>
              <p className="text-muted-foreground mt-5 leading-relaxed max-w-md">Minimalismo, brillo y versatilidad. Misma identidad visual, con bloques de contenido tipo appMejora.</p>
              <Button asChild className="mt-7 rounded-none tracking-[0.15em] uppercase text-xs px-8">
                <Link href="/shop">Explorar Coleccion</Link>
              </Button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4 md:gap-6">
              <div className="relative col-span-1 row-span-2 min-h-[360px] md:min-h-[460px] overflow-hidden rounded-2xl">
                <Image src={editorialImages[0]} alt="Estilo editorial" fill className="object-cover" />
              </div>
              <div className="relative min-h-[170px] md:min-h-[220px] overflow-hidden rounded-2xl">
                <Image src={editorialImages[1]} alt="Detalle de joyeria" fill className="object-cover" />
              </div>
              <div className="relative min-h-[170px] md:min-h-[220px] overflow-hidden rounded-2xl">
                <Image src={editorialImages[2]} alt="Pieza destacada" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 overflow-hidden" data-reveal>
        <div className="container mx-auto px-4 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4">
            <div>
              <span className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-2 block">Lo Mas Nuevo</span>
              <h2 className="text-2xl md:text-3xl font-medium tracking-[0.1em] uppercase text-foreground">Recien Llegados</h2>
            </div>
            <Link href="/shop?sort=newest" className="group flex items-center text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:text-primary transition-colors w-fit">
              Ver Todo
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-8 gap-8 md:gap-10 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {bestSellers.map((product) => (
              <div key={product.id} className="w-[72vw] sm:w-[52vw] md:w-[290px] lg:w-[310px] flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}
            <div className="w-[60vw] sm:w-[40vw] md:w-[260px] lg:w-[280px] flex-none snap-start flex items-center justify-center bg-background border border-border/50 rounded-lg p-6 group">
              <Link href="/shop?sort=newest" className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors text-center gap-4 w-full h-full min-h-[200px]">
                <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-8 h-8" />
                </div>
                <span className="font-serif text-xl tracking-wide uppercase">Cargar Mas</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-secondary/20" data-reveal>
        <div className="container mx-auto px-4 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            <div className="lg:col-span-7 relative min-h-[320px] md:min-h-[520px] overflow-hidden rounded-3xl">
              <Image src={spotlightProduct?.image?.imageUrl || '/images/CatAretes.png'} alt={spotlightProduct?.name || 'Producto destacado'} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/25" />
            </div>
            <div className="lg:col-span-5 bg-background rounded-3xl p-8 md:p-10 border border-border/50 flex flex-col justify-center">
              <span className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-3 block">Detalle Destacado</span>
              <h3 className="text-2xl md:text-3xl font-medium tracking-[0.06em] uppercase text-foreground leading-tight">{spotlightProduct?.name || 'Calidad que se nota'}</h3>
              <p className="text-muted-foreground mt-4 leading-relaxed">Diseno elegante, acabados de calidad y piezas que elevan cualquier outfit.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="rounded-none tracking-[0.15em] uppercase text-xs px-7">
                  <Link href={spotlightProduct ? `/products/${spotlightProduct.slug}` : '/shop'}>Ver Pieza</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none tracking-[0.15em] uppercase text-xs px-7">
                  <Link href="/shop">Ver Catalogo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4 lg:px-10 border-t border-border/50 mb-10" data-reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start group">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-foreground text-sm leading-relaxed font-medium">Envio gratis en compras desde $3,300 - Disponible en todo el pais</p>
          </div>
          <div className="flex flex-col items-center md:items-start group">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
              <Percent className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-foreground text-sm leading-relaxed font-medium">Registrate y obten 10% de descuento en tu primera compra</p>
          </div>
          <div className="flex flex-col items-center md:items-start group">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-foreground text-sm leading-relaxed font-medium">Garantia por 1 ano</p>
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
