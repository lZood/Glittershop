import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { y: '8vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        bodyRef.current,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 45%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        contactRef.current,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 40%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        newsletterRef.current,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            end: 'top 35%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        socialRef.current,
        { y: '4vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'top 30%',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSuscribirme = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Gracias por suscribirte con: ${email}`);
    setEmail('');
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-[100vh] lg:min-h-[120vh] bg-foreground text-background z-[90]"
    >
      <div className="px-6 sm:px-8 lg:px-[8vw] py-[10vh] lg:py-[14vh]">
        <h2
          ref={headlineRef}
          className="text-2xl sm:text-3xl lg:text-h2 text-background max-w-full lg:max-w-[52vw] mb-6 lg:mb-12 will-change-transform"
        >
          Creemos algo que brille contigo.
        </h2>

        <p
          ref={bodyRef}
          className="text-base lg:text-lg text-background/65 max-w-full lg:max-w-[34vw] mb-10 lg:mb-16 will-change-transform"
        >
          Cuéntanos lo que buscas y te ayudamos a elegir la pieza perfecta.
        </p>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-24">
          <div ref={contactRef} className="will-change-transform">
            <div className="space-y-3 lg:space-y-4 text-background/80">
              <p className="text-sm lg:text-base">
                <a href="mailto:hello@glittersshop.com" className="hover:text-primary transition-colors">
                  hello@glittersshop.com
                </a>
              </p>
              <p className="text-sm lg:text-base">
                <a href="tel:+12125550138" className="hover:text-primary transition-colors">
                  +1 (212) 555-0138
                </a>
              </p>
              <p className="text-sm lg:text-base text-background/65">88 Prince St, Nuevo York, NY</p>
            </div>
          </div>

          <div ref={newsletterRef} className="flex-1 max-w-full lg:max-w-[40vw] will-change-transform">
            <p className="text-micro text-background/65 mb-4 text-xs">Unete a la lista</p>
            <form onSubmit={handleSuscribirme} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="flex-1 bg-transparent border-b border-background/30 py-3 text-background placeholder:text-background/40 focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                Suscribirme
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div ref={socialRef} className="mt-12 lg:mt-20 flex flex-wrap gap-6 lg:gap-8 will-change-transform">
          <a href="#" className="flex items-center gap-2 text-background/80 hover:text-primary transition-colors">
            <Instagram className="w-5 h-5" />
            <span className="text-sm">Instagram</span>
          </a>
          <a href="#" className="text-sm text-background/80 hover:text-primary transition-colors">Pinterest</a>
          <a href="#" className="text-sm text-background/80 hover:text-primary transition-colors">TikTok</a>
        </div>
      </div>
    </section>
  );
}


