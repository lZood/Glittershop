'use client';

import { Instagram, Globe, ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function Footer() {
  const year = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.footer
      id="main-footer"
      className="bg-zinc-950 text-zinc-200 pt-16 pb-8 overflow-hidden relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Large Watermark Text */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.03]">
        <h1 className="text-[15vw] font-bold text-center leading-none tracking-tighter text-white whitespace-nowrap">
          GlittersShop
        </h1>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section: Newsletter & Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 border-b border-zinc-800 pb-12">
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Únete al Club Glitters
            </h2>
            <p className="text-zinc-400 max-w-md text-lg">
              Recibe acceso exclusivo a nuevas colecciones, ofertas privadas y un 10% de descuento en tu primera compra.
            </p>
            <div className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 h-12 rounded-lg"
                />
              </div>
              <Button size="icon" className="h-12 w-12 rounded-lg bg-white text-black hover:bg-zinc-200 shrink-0">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-12">
            <div className="space-y-4">
              <h3 className="font-bold text-white tracking-wide text-sm uppercase">Comprar</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><Link href="/shop" className="hover:text-white transition-colors">Novedades</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Más Vendidos</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Colecciones</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Tarjetas de Regalo</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-white tracking-wide text-sm uppercase">Ayuda</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-white transition-colors">Envíos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Devoluciones</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Guía de Tallas</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-white tracking-wide text-sm uppercase">Legal</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacidad</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Términos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-sm text-zinc-500">
              &copy; {year} GlittersShop. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <Link
                href="https://instagram.com"
                target="_blank"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              {/* TikTok */}
              <Link
                href="https://tiktok.com"
                target="_blank"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </Link>
              {/* WhatsApp */}
              <Link
                href="https://whatsapp.com"
                target="_blank"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white gap-2">
              <Globe className="w-4 h-4" />
              MX (MXN)
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
