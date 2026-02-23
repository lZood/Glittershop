import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Triptych() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

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
        leftRef.current,
        { x: isMobile ? -80 : '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );
      
      scrollTl.fromTo(
        centerRef.current,
        { y: isMobile ? 60 : '80vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.02
      );
      
      scrollTl.fromTo(
        rightRef.current,
        { x: isMobile ? 80 : '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.04
      );
      
      scrollTl.fromTo(
        headlineRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, ease: 'power2.out' },
        0.1
      );

      // EXIT (70%-100%)
      scrollTl.fromTo(
        [leftRef.current, centerRef.current, rightRef.current],
        { scale: 1, opacity: 1 },
        { scale: isMobile ? 1.02 : 1.03, opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.7
      );
      
      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: isMobile ? -20 : '-10vh', opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collections"
      className="relative w-full h-screen bg-background overflow-hidden z-[70]"
    >
      {/* Mobile Layout - Carrusel vertical */}
      <div className="lg:hidden flex flex-col h-full px-4 py-20 gap-3">
        {/* Fila superior con 2 imágenes */}
        <div className="flex gap-3 h-[40vh]">
          <div
            ref={leftRef}
            className="w-1/2 h-full will-change-transform"
          >
            <img
              src="/images/triptych_left.jpg"
              alt="Retrato de joyeria minimal"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <div
            ref={rightRef}
            className="w-1/2 h-full will-change-transform"
          >
            <img
              src="/images/triptych_right.jpg"
              alt="Anillos and bracelets"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
        </div>

        {/* Imagen central con texto */}
        <div
          ref={centerRef}
          className="flex-1 relative will-change-transform"
        >
          <img
            src="/images/triptych_center.jpg"
            alt="Aretes y collar"
            className="w-full h-full object-cover rounded-sm"
          />
          
          {/* Headline Overlay */}
          <h2
            ref={headlineRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl font-bold text-white text-center whitespace-nowrap drop-shadow-lg will-change-transform"
          >
            Encuentra tu acabado.
          </h2>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Left Panel */}
        <div
          ref={leftRef}
          className="absolute left-[6vw] top-[10vh] w-[26vw] h-[80vh] will-change-transform"
        >
          <img
            src="/images/triptych_left.jpg"
            alt="Retrato de joyeria minimal"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Center Panel */}
        <div
          ref={centerRef}
          className="absolute left-[37vw] top-[10vh] w-[26vw] h-[80vh] will-change-transform"
        >
          <img
            src="/images/triptych_center.jpg"
            alt="Aretes y collar"
            className="w-full h-full object-cover"
          />
          
          {/* Center Headline Overlay */}
          <h2
            ref={headlineRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-h2 text-white text-center whitespace-nowrap drop-shadow-lg will-change-transform"
          >
            Encuentra tu acabado.
          </h2>
        </div>

        {/* Right Panel */}
        <div
          ref={rightRef}
          className="absolute left-[68vw] top-[10vh] w-[26vw] h-[80vh] will-change-transform"
        >
          <img
            src="/images/triptych_right.jpg"
            alt="Anillos and bracelets"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

