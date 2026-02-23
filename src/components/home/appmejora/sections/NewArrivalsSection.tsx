import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCarousel from '../components/ProductCarousel';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    name: 'Collar Cadena Eterna',
    price: '$189',
    image: '/images/product_necklace_1.jpg',
    category: 'Collares',
  },
  {
    id: 2,
    name: 'Aretes Aro Twist',
    price: '$129',
    image: '/images/product_earrings_1.jpg',
    category: 'Aretes',
  },
  {
    id: 3,
    name: 'Anillo Sello Leon',
    price: '$249',
    image: '/images/product_ring_1.jpg',
    category: 'Anillos',
  },
  {
    id: 4,
    name: 'Pulsera Charm Perla',
    price: '$159',
    image: '/images/product_bracelet_1.jpg',
    category: 'Pulseras',
  },
  {
    id: 5,
    name: 'Aretes Gota Perla',
    price: '$179',
    image: '/images/product_earrings_2.jpg',
    category: 'Aretes',
  },
  {
    id: 6,
    name: 'Collar Trio en Capas',
    price: '$299',
    image: '/images/product_necklace_2.jpg',
    category: 'Collares',
  },
];

export default function NewArrivalsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Carousel animation
      gsap.fromTo(
        carouselRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-background z-[15]"
    >
      <div className="px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-14 will-change-transform">
          <span className="text-micro text-muted-foreground mb-3 block">
            RECIÉN LLEGADOS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nueva Colección
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Descubre las piezas más nuevas, creadas para elevar tu estilo todos los días.
          </p>
        </div>

        {/* Carousel */}
        <div ref={carouselRef} className="will-change-transform">
          <ProductCarousel 
            products={products} 
            autoPlaySpeed={3500}
            resumeDelay={6000}
          />
        </div>

        {/* View All Button */}
        <div className="text-center mt-10 sm:mt-14">
          <a 
            href="#collections" 
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 border border-foreground text-foreground text-sm font-medium hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            Ver todos los productos
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

