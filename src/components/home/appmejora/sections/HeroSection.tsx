import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const microLabelRef = useRef<HTMLSpanElement>(null);

  // Detectar si es móvil
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Auto entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial states
      gsap.set(imageRef.current, { y: isMobile ? 30 : 0, x: isMobile ? 0 : '-60vw', opacity: 0 });
      gsap.set(headlineRef.current, { y: 40, opacity: 0 });
      gsap.set(subheadlineRef.current, { y: 30, opacity: 0 });
      gsap.set(ctaRef.current, { y: 20, opacity: 0 });
      gsap.set(microLabelRef.current, { y: -20, opacity: 0 });

      // Entrance sequence
      tl.to(imageRef.current, { y: 0, x: 0, opacity: 1, duration: 0.9 })
        .to(headlineRef.current, { y: 0, opacity: 1, duration: 0.7 }, '-=0.6')
        .to(subheadlineRef.current, { y: 0, opacity: 1, duration: 0.5 }, '-=0.4')
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
        .to(microLabelRef.current, { y: 0, opacity: 1, duration: 0.5 }, '-=0.5');
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.to([imageRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current, microLabelRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.3,
            });
          },
        },
      });

      // EXIT (70%-100%)
      const exitX = window.innerWidth < 1024 ? '0' : '18vw';
      const exitImageX = window.innerWidth < 1024 ? '0' : '-18vw';
      
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: exitX, y: window.innerWidth < 1024 ? -30 : 0, opacity: 0, ease: 'power2.in' },
        0.7
      );
      
      scrollTl.fromTo(
        subheadlineRef.current,
        { x: 0, opacity: 1 },
        { x: window.innerWidth < 1024 ? 0 : '14vw', opacity: 0, ease: 'power2.in' },
        0.72
      );
      
      scrollTl.fromTo(
        ctaRef.current,
        { x: 0, opacity: 1 },
        { x: window.innerWidth < 1024 ? 0 : '10vw', opacity: 0, ease: 'power2.in' },
        0.74
      );
      
      scrollTl.fromTo(
        imageRef.current,
        { x: 0, scale: 1, opacity: 1 },
        { x: exitImageX, y: window.innerWidth < 1024 ? 30 : 0, scale: 1.04, opacity: 0, ease: 'power2.in' },
        0.7
      );
      
      scrollTl.fromTo(
        microLabelRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-background overflow-hidden z-10"
    >
      {/* Mobile: Stack layout / Desktop: Split layout */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Panel */}
        <div
          ref={imageRef}
          className="w-full lg:w-1/2 h-[50vh] lg:h-full will-change-transform"
        >
          <img
            src="/images/hero_model_closeup.jpg"
            alt="Elegant jewelry model"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Content Panel */}
        <div
          ref={contentRef}
          className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-0"
        >
          {/* Micro Label */}
          <span
            ref={microLabelRef}
            className="text-micro text-muted-foreground mb-4 lg:mb-8 will-change-transform"
          >
            NEW DROP - SPRING 2026
          </span>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-h1 text-foreground max-w-full lg:max-w-[34vw] mb-4 lg:mb-8 will-change-transform text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            Modern jewelry, made to be worn every day.
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-base sm:text-lg text-muted-foreground max-w-full lg:max-w-[30vw] mb-6 lg:mb-10 will-change-transform"
          >
            Minimal designs, maximum impact. Crafted for real life.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-start gap-4 will-change-transform">
            <button className="btn-primary w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4">
              Shop the Collection
            </button>
            <a href="#gallery" className="link-underline mt-0 sm:mt-2 text-sm sm:text-base">
              View lookbook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

