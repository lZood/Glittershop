import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LavenderStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const microLabelRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

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
        },
      });

      // ENTRANCE (0%-30%)
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.12, opacity: 0.8 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );
      
      scrollTl.fromTo(
        headlineRef.current,
        { y: window.innerWidth < 1024 ? '40vh' : '60vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0
      );
      
      scrollTl.fromTo(
        sublineRef.current,
        { y: window.innerWidth < 1024 ? '25vh' : '40vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.08
      );
      
      scrollTl.fromTo(
        microLabelRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.05
      );

      // EXIT (70%-100%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: window.innerWidth < 1024 ? '-20vh' : '-35vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
      
      scrollTl.fromTo(
        sublineRef.current,
        { y: 0, opacity: 1 },
        { y: window.innerWidth < 1024 ? '-15vh' : '-22vh', opacity: 0, ease: 'power2.in' },
        0.72
      );
      
      scrollTl.fromTo(
        microLabelRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );
      
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.06, opacity: 0.9, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative w-full h-screen overflow-hidden z-20"
    >
      {/* Lavender Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-primary will-change-transform"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 sm:px-8">
        {/* Micro Label */}
        <span
          ref={microLabelRef}
          className="absolute left-6 sm:left-[6vw] top-[8vh] sm:top-[10vh] text-micro text-foreground/70 will-change-transform text-xs sm:text-sm"
        >
          NUESTRA ESENCIA
        </span>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="text-h2 text-foreground text-center max-w-[90vw] sm:max-w-[80vw] lg:max-w-[72vw] mb-6 sm:mb-8 will-change-transform text-2xl sm:text-3xl lg:text-4xl xl:text-5xl"
        >
          Diseñada para moverse contigo.
        </h2>

        {/* Subline */}
        <p
          ref={sublineRef}
          className="text-base sm:text-lg text-foreground/80 text-center max-w-[85vw] sm:max-w-[60vw] lg:max-w-[52vw] will-change-transform px-4"
        >
          Ligera, combinable y hecha para la vida real.
        </p>
      </div>
    </section>
  );
}

