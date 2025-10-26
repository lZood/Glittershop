'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, Heart, Instagram, Share2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import SearchBar from '../search-bar';
import { useSession } from '@/lib/supabase/session-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-10 mx-auto w-full md:w-[80%]">

        {/* Logo */}
        <div className="flex items-center flex-1 md:flex-none md:justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl" style={{ color: '#B87333' }}>Glittershop</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-6">
            <Link href="/shop" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Tienda
            </Link>
            <Link href="/collections" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Colecciones
            </Link>
        </nav>

        {/* Right-side Icons and Mobile Menu*/}
        <div className="flex items-center justify-end md:gap-x-1">
          <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Search">
                    <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                 <SheetHeader>
                    <SheetTitle>Buscar productos</SheetTitle>
                 </SheetHeader>
                 <div className="p-4">
                    <SearchBar />
                 </div>
              </SheetContent>
            </Sheet>
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
                <ShoppingCart className="h-5 w-5" />
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center justify-between">
                  <span>Menu</span>
                  <SheetClose>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </SheetTitle>
              </SheetHeader>
              <div className="p-6 space-y-6 text-sm overflow-y-auto h-full">
                  <div className="space-y-2">
                      <h3 className="font-bold text-base">Tienda</h3>
                      <nav className="flex flex-col space-y-3">
                      {tiendaLinks.map((link) => (
                          <SheetClose asChild key={link.label}>
                              <Link
                                  href={link.href}
                                  className="text-muted-foreground hover:text-foreground"
                              >
                                  {link.label}
                              </Link>
                          </SheetClose>
                      ))}
                      </nav>
                  </div>

                  <div className="space-y-2">
                      <h3 className="font-bold text-base">Colecciones</h3>
                      <nav className="flex flex-col space-y-3">
                      {coleccionesLinks.map((link) => (
                          <SheetClose asChild key={link.label}>
                              <Link
                                  href={link.href}
                                  className="text-muted-foreground hover:text-foreground"
                              >
                                  {link.label}
                              </Link>
                          </SheetClose>
                      ))}
                      </nav>
                  </div>

                  <nav className="flex flex-col space-y-3 border-t pt-6">
                      {mainLinks.map((link) => (
                          <SheetClose asChild key={link.label}>
                              <Link href={link.href} className="font-bold text-base">
                              {link.label}
                              </Link>
                          </SheetClose>
                      ))}
                  </nav>

                  <SheetClose asChild>
                      <Link href="/wishlist" className="flex items-center gap-2 font-bold text-base border-t pt-6">
                          <Heart className="w-5 h-5" />
                          <span>Lista de Deseos</span>
                      </Link>
                  </SheetClose>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
                  <h3 className="font-bold text-center mb-4">Comunidad</h3>
                  <div className="flex justify-center gap-4">
                      <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                          <Instagram className="h-6 w-6" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                          <Share2 className="h-6 w-6" />
                      </Button>
                  </div>
              </div>

            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
