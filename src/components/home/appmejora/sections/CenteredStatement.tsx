import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CenteredStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { y: '10vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 45%',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[80vh] lg:min-h-[110vh] bg-background flex items-center justify-center z-[60] px-6"
    >
      <div
        ref={contentRef}
        className="text-center max-w-[90vw] lg:max-w-[64vw] will-change-transform"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-h2 text-foreground mb-4 sm:mb-8">
          Joyeria que se siente como tu.
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-10">
          Sin reglas. Solo piezas que querras usar una y otra vez.
        </p>
        <button className="btn-primary text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8">
          Comprar más vendidos
        </button>
      </div>
    </section>
  );
}

