'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NewArrivalsSection from './appmejora/sections/NewArrivalsSection';
import LavenderStatement from './appmejora/sections/LavenderStatement';
import EditorialCollage from './appmejora/sections/EditorialCollage';
import TwoPanelFeature from './appmejora/sections/TwoPanelFeature';
import AsymmetricGallery from './appmejora/sections/AsymmetricGallery';
import CenteredStatement from './appmejora/sections/CenteredStatement';
import Triptych from './appmejora/sections/Triptych';
import TwoPanelFeatureReversed from './appmejora/sections/TwoPanelFeatureReversed';

gsap.registerPlugin(ScrollTrigger);

type HomeCategory = {
  name: string;
  image: string;
  link: string;
  count: number;
};

type HomeAppMejoraContentProps = {
  categories: HomeCategory[];
};

export function HomeAppMejoraContent({ categories }: HomeAppMejoraContentProps) {
  const mainRef = useRef<HTMLElement>(null);
  const snapTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    const timeout = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      snapTriggerRef.current = ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            const inPinned = pinnedRanges.some((r) => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) => (Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest),
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: {
            min: isTouchDevice ? 0.1 : 0.15,
            max: isTouchDevice ? 0.25 : 0.35,
          },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, isTouchDevice ? 800 : 500);

    return () => {
      clearTimeout(timeout);
      if (snapTriggerRef.current) {
        snapTriggerRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-category-card]',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '[data-categories-section]',
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.3,
          },
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <div className="grain-overlay" />
      <main ref={mainRef} className="relative">
        <NewArrivalsSection />
        <LavenderStatement />
        <EditorialCollage />
        <TwoPanelFeature />
        <AsymmetricGallery />
        <CenteredStatement />
        <Triptych />
        <TwoPanelFeatureReversed />
        <section className="relative w-full min-h-screen bg-background overflow-hidden z-[95]">
          <div className="container mx-auto px-4 lg:px-10 py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div className="lg:col-span-4 flex flex-col justify-center">
                <span className="text-micro text-muted-foreground mb-4">COMPRA POR CATEGORIA</span>
                <h2 className="text-h2 text-foreground mb-6">Encuentra tu estilo</h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-8">
                  Seleccion editorial con las categorias principales de tu tienda.
                </p>
                <Link href="/shop" className="link-underline w-fit">
                  Ver catálogo completo
                </Link>
              </div>

              <div className="lg:col-span-8 grid grid-cols-2 gap-4 md:gap-6" data-categories-section>
                {categories.map((cat, index) => (
                  <Link
                    href={cat.link}
                    key={cat.name}
                    className="group relative min-h-[220px] md:min-h-[280px] overflow-hidden rounded-xl"
                    data-category-card={index}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <h3 className="text-background text-lg md:text-xl font-semibold">{cat.name}</h3>
                      <p className="text-background/80 text-xs uppercase tracking-[0.2em] mt-1">
                        {cat.count} estilos
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
