import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EditorialCollage() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageARef = useRef<HTMLDivElement>(null);
  const imageBRef = useRef<HTMLDivElement>(null);
  const imageCRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);

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
        imageARef.current,
        { x: isMobile ? -100 : '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );
      
      scrollTl.fromTo(
        imageBRef.current,
        { x: isMobile ? 100 : '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.05
      );
      
      scrollTl.fromTo(
        imageCRef.current,
        { y: isMobile ? 80 : '80vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.02
      );
      
      scrollTl.fromTo(
        textBlockRef.current,
        { y: isMobile ? 50 : 0, x: isMobile ? 0 : '40vw', opacity: 0 },
        { y: 0, x: 0, opacity: 1, ease: 'power2.out' },
        0.04
      );

      // EXIT (70%-100%)
      scrollTl.fromTo(
        [imageARef.current, imageBRef.current],
        { x: 0, opacity: 1 },
        { x: isMobile ? 0 : '-18vw', y: isMobile ? -30 : 0, opacity: 0, ease: 'power2.in' },
        0.7
      );
      
      scrollTl.fromTo(
        imageCRef.current,
        { y: 0, opacity: 1 },
        { y: isMobile ? 50 : '-18vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
      
      scrollTl.fromTo(
        textBlockRef.current,
        { x: 0, opacity: 1 },
        { x: isMobile ? 0 : '18vw', y: isMobile ? 30 : 0, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-background overflow-hidden z-30"
    >
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full px-4 py-20 gap-4">
        {/* Text Block - Arriba en móvil */}
        <div
          ref={textBlockRef}
          className="will-change-transform text-center py-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Construye tu propia historia.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Mezcla metales, texturas y form?s. Cada pieza cuenta un cap?tulo.
          </p>
          <a href="#collections" className="link-underline text-sm">
            Explora la colecci?n
          </a>
        </div>

        {/* Imágenes en grid */}
        <div className="flex gap-3 flex-1">
          {/* Image A */}
          <div
            ref={imageARef}
            className="w-1/2 h-full will-change-transform"
          >
            <img
              src="/images/collage_hands_detail.jpg"
              alt="Ma?os con joyeria delicada"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>

          {/* Columna derecha */}
          <div className="w-1/2 flex flex-col gap-3">
            {/* Image B */}
            <div
              ref={imageBRef}
              className="h-1/2 will-change-transform"
            >
              <img
                src="/images/collage_earring_profile.jpg"
                alt="Perfil con arete protagonista"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>

            {/* Image C */}
            <div
              ref={imageCRef}
              className="h-1/2 will-change-transform"
            >
              <img
                src="/images/collage_necklace_tall.jpg"
                alt="Collares en capas"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Image A - Top Left */}
        <div
          ref={imageARef}
          className="absolute left-[6vw] top-[10vh] w-[28vw] h-[34vh] will-change-transform"
        >
          <img
            src="/images/collage_hands_detail.jpg"
            alt="Ma?os con joyeria delicada"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image B - Bottom Left */}
        <div
          ref={imageBRef}
          className="absolute left-[6vw] top-[52vh] w-[28vw] h-[38vh] will-change-transform"
        >
          <img
            src="/images/collage_earring_profile.jpg"
            alt="Perfil con arete protagonista"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image C - Center Tall */}
        <div
          ref={imageCRef}
          className="absolute left-[38vw] top-[10vh] w-[26vw] h-[80vh] will-change-transform"
        >
          <img
            src="/images/collage_necklace_tall.jpg"
            alt="Collares en capas"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Block - Right */}
        <div
          ref={textBlockRef}
          className="absolute left-[68vw] top-[18vh] w-[28vw] will-change-transform"
        >
          <h2 className="text-h2 text-foreground mb-6">
            Construye tu propia historia.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Mezcla metales, texturas y form?s. Cada pieza cuenta un cap?tulo.
          </p>
          <a href="#collections" className="link-underline">
            Explora la colecci?n
          </a>
        </div>
      </div>
    </section>
  );
}

