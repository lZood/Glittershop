import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AsymmetricGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightTopRef = useRef<HTMLDivElement>(null);
  const rightBottomRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0%-30%)
      scrollTl.fromTo(
        leftImageRef.current,
        { x: isMobile ? 0 : '-60vw', y: isMobile ? 40 : 0, opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out' },
        0
      );
      
      scrollTl.fromTo(
        rightTopRef.current,
        { x: isMobile ? 0 : '50vw', y: isMobile ? -30 : 0, opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out' },
        0.03
      );
      
      scrollTl.fromTo(
        rightBottomRef.current,
        { x: isMobile ? 0 : '50vw', y: isMobile ? 30 : '20vh', opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out' },
        0.06
      );
      
      scrollTl.fromTo(
        captionRef.current,
        { y: isMobile ? 20 : '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      // EXIT (70%-100%)
      scrollTl.fromTo(
        leftImageRef.current,
        { x: 0, opacity: 1 },
        { x: isMobile ? 0 : '-12vw', y: isMobile ? -20 : 0, opacity: 0, ease: 'power2.in' },
        0.7
      );
      
      scrollTl.fromTo(
        [rightTopRef.current, rightBottomRef.current],
        { x: 0, opacity: 1 },
        { x: isMobile ? 0 : '12vw', y: isMobile ? 20 : 0, opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.7
      );
      
      scrollTl.fromTo(
        captionRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.8
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative w-full h-screen bg-background overflow-hidden z-50"
    >
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full px-4 py-20 gap-3">
        {/* Imagen principal arriba */}
        <div
          ref={leftImageRef}
          className="h-[45vh] will-change-transform"
        >
          <img
            src="/images/gallery_layering_left.jpg"
            alt="Joyeria en capas"
            className="w-full h-full object-cover rounded-sm"
          />
        </div>

        {/* Grid inferior */}
        <div className="flex-1 flex gap-3">
          <div
            ref={rightTopRef}
            className="w-1/2 h-full will-change-transform"
          >
            <img
              src="/images/gallery_ring_topright.jpg"
              alt="Anillo dorado protagonista"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <div
            ref={rightBottomRef}
            className="w-1/2 h-full will-change-transform"
          >
            <img
              src="/images/gallery_bracelet_bottomright.jpg"
              alt="Pulsera delicada"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
        </div>

        {/* Caption */}
        <a
          ref={captionRef}
          href="#collections"
          className="text-sm font-medium text-foreground underline underline-offset-4 text-center py-2 will-change-transform"
        >
          Sets para layering - compra la seleccion
        </a>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Left Hero Image */}
        <div
          ref={leftImageRef}
          className="absolute left-[6vw] top-[10vh] w-[52vw] h-[80vh] will-change-transform"
        >
          <img
            src="/images/gallery_layering_left.jpg"
            alt="Joyeria en capas"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Top Image */}
        <div
          ref={rightTopRef}
          className="absolute left-[62vw] top-[10vh] w-[32vw] h-[38vh] will-change-transform"
        >
          <img
            src="/images/gallery_ring_topright.jpg"
            alt="Anillo dorado protagonista"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Bottom Image */}
        <div
          ref={rightBottomRef}
          className="absolute left-[62vw] top-[52vh] w-[32vw] h-[38vh] will-change-transform"
        >
          <img
            src="/images/gallery_bracelet_bottomright.jpg"
            alt="Pulsera delicada"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Caption */}
        <a
          ref={captionRef}
          href="#collections"
          className="absolute left-[10vw] top-[78vh] text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors will-change-transform"
        >
          Sets para layering - compra la seleccion
        </a>
      </div>
    </section>
  );
}

