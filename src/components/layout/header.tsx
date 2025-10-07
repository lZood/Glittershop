'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#products', label: 'Colecciones' },
  { href: '/gift-guide', label: 'Gift Guide' },
  { href: '/interactive-gift-guide', label: 'Interactive Guide' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Glittershop</span>
          </Link>
        </div>

        <div className="flex items-center justify-end space-x-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="User Profile" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Shopping Cart">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
