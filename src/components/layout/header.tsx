'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, Heart, Instagram, Share2, AlertCircle, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import SearchOverlay from '../search-overlay';
import MegaMenu from './mega-menu';
import { useSession } from '@/lib/supabase/session-provider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState, Suspense } from 'react';
import { useCart } from '@/lib/cart-context';

const tiendaLinks = [
  { href: '/shop', label: 'Ver Todo' },
  { href: '#', label: 'Anillos' },
  { href: '#', label: 'Collares' },
  { href: '#', label: 'Pulseras' },
  { href: '#', label: 'Aretes' },
];

const coleccionesLinks = [
  { href: '/collections/luz-de-luna', label: 'Colección: Luz de Luna' },
  { href: '/collections/verano-mediterraneo', label: 'Colección: Verano Mediterráneo' },
  { href: '/collections', label: 'Todas las Colecciones' },
];

const mainLinks: { href: string, label: string }[] = [
];

export default function Header() {
  const { session, profile } = useSession();
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const footer = document.getElementById('main-footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide header when footer is intersecting (visible)
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.05 } // Trigger as soon as 5% of footer is visible
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : '-100%' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Custom bezier for smooth "apple-like" motion
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-10 mx-auto w-full md:w-[80%]">

        {/* Logo */}
        <div className="flex items-center flex-1 md:flex-none md:justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-medium text-sm sm:text-base md:text-xl tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] text-foreground uppercase whitespace-nowrap">Glitters Shop</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <MegaMenu />

        {/* Right-side Icons and Mobile Menu*/}
        <div className="flex items-center justify-end md:gap-x-1">
          <Suspense fallback={<Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>}>
            <SearchOverlay />
          </Suspense>

          <Button variant="ghost" size="icon" aria-label="User Profile" asChild>
            <Link href={session ? "/profile" : "/login"}>
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" aria-label="Wishlist" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Shopping Cart" asChild>
            <Link href="/cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </Button>

          {/* Mobile Nav Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/80 backdrop-blur-xl border-l border-border/50 p-0 flex flex-col h-full">
              <SheetHeader className="p-6 border-b border-border/10">
                <SheetTitle className="flex items-center justify-between">
                  <span className="text-xl font-bold tracking-tight">Menú</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8">
                {/* Tienda Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tienda</h3>
                  <nav className="flex flex-col space-y-1">
                    {tiendaLinks.map((link) => (
                      <SheetClose asChild key={link.label}>
                        <Link
                          href={link.href}
                          className="group flex items-center justify-between py-2 text-lg font-medium transition-all hover:pl-2 hover:text-primary"
                        >
                          {link.label}
                          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>

                {/* Colecciones Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Colecciones</h3>
                  <nav className="flex flex-col space-y-1">
                    {coleccionesLinks.map((link) => (
                      <SheetClose asChild key={link.label}>
                        <Link
                          href={link.href}
                          className="group flex items-center justify-between py-2 text-lg font-medium transition-all hover:pl-2 hover:text-primary"
                        >
                          {link.label}
                          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>

                {/* Main Links Section */}
                {mainLinks.length > 0 && (
                  <nav className="flex flex-col space-y-1 pt-2">
                    {mainLinks.map((link) => (
                      <SheetClose asChild key={link.label}>
                        <Link href={link.href} className="group flex items-center justify-between py-2 text-lg font-bold transition-all hover:pl-2 hover:text-primary">
                          {link.label}
                          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                )}

                <SheetClose asChild>
                  <Link href="/wishlist" className="flex items-center gap-3 py-2 text-lg font-medium transition-all hover:text-primary">
                    <Heart className="w-5 h-5" />
                    <span>Lista de Deseos</span>
                  </Link>
                </SheetClose>
              </div>

              <div className="p-8 border-t border-border/10 bg-background/40 backdrop-blur-sm">
                <h3 className="font-semibold text-center mb-6 text-sm uppercase tracking-widest text-muted-foreground">Síguenos</h3>
                <div className="flex justify-center gap-6">
                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-2 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-300" asChild>
                    <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </Link>
                  </Button>

                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-2 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-300" asChild>
                    <Link href="https://tiktok.com" target="_blank" aria-label="TikTok">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                      </svg>
                    </Link>
                  </Button>

                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-2 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-300" asChild>
                    <Link href="https://whatsapp.com" target="_blank" aria-label="WhatsApp">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </div>

            </SheetContent>
          </Sheet>
        </div>

      </div>
    </motion.header>
  );
}
