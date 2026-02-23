import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TwoPanelFeatureReversed() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

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
        imageRef.current,
        { x: isMobile ? 0 : '70vw', y: isMobile ? 50 : 0, opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out' },
        0
      );
      
      scrollTl.fromTo(
        headlineRef.current,
        { x: isMobile ? 0 : '-50vw', y: isMobile ? 30 : 0, opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out' },
        0.02
      );
      
      scrollTl.fromTo(
        bodyRef.current,
        { x: isMobile ? 0 : '-35vw', y: isMobile ? 20 : 0, opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: 'power2.out' },
        0.06
      );
      
      scrollTl.fromTo(
        ctaRef.current,
        { y: isMobile ? 20 : '20vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      // EXIT (70%-100%)
      scrollTl.fromTo(
        imageRef.current,
        { x: 0, opacity: 1 },
        { x: isMobile ? 0 : '14vw', y: isMobile ? -20 : 0, opacity: 0, ease: 'power2.in' },
        0.7
      );
      
      scrollTl.fromTo(
        [headlineRef.current, bodyRef.current, ctaRef.current],
        { x: 0, opacity: 1 },
        { x: isMobile ? 0 : '-14vw', y: isMobile ? -15 : 0, opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-background overflow-hidden z-[80]"
    >
      {/* Mobile: Stack layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Content - Top */}
        <div className="w-full flex-1 flex flex-col justify-center px-6 py-8">
          <h2
            ref={headlineRef}
            className="text-2xl sm:text-3xl font-bold text-foreground mb-4 will-change-transform"
          >
            Perfecto para regalar, siempre.
          </h2>
          
          <p
            ref={bodyRef}
            className="text-base text-muted-foreground mb-6 will-change-transform"
          >
            Empaque hermoso y notas personales, listo para regalar.
          </p>
          
          <button
            ref={ctaRef}
            className="btn-primary w-fit will-change-transform text-sm py-3 px-6"
          >
            Comprar regalos
          </button>
        </div>

        {/* Image - Bottom */}
        <div
          ref={imageRef}
          className="w-full h-[50vh] will-change-transform"
        >
          <img
            src="/images/feature_gifts_right.jpg"
            alt="Caja de regalo de joyeria"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Desktop: Split layout */}
      <div className="hidden lg:block">
        {/* Left Copy Area */}
        <div className="absolute left-0 top-0 w-[45vw] h-full flex flex-col justify-center px-12 lg:px-16">
          <h2
            ref={headlineRef}
            className="text-h2 text-foreground max-w-[34vw] mb-8 will-change-transform"
          >
            Perfecto para regalar, siempre.
          </h2>
          
          <p
            ref={bodyRef}
            className="text-lg text-muted-foreground max-w-[32vw] mb-10 will-change-transform"
          >
            Empaque hermoso y notas personales, listo para regalar.
          </p>
          
          <button
            ref={ctaRef}
            className="btn-primary w-fit will-change-transform"
          >
            Comprar regalos
          </button>
        </div>

        {/* Right Image */}
        <div
          ref={imageRef}
          className="absolute right-0 top-0 w-[55vw] h-full will-change-transform"
        >
          <img
            src="/images/feature_gifts_right.jpg"
            alt="Caja de regalo de joyeria"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

