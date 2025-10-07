'use client';

import Link from 'next/link';
import { Gift, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import SearchBar from '../search-bar';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gift-guide', label: 'Gift Guide' },
  { href: '/interactive-gift-guide', label: 'Interactive Guide' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg font-headline">Glittershop</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Link href="/" className="mr-6 flex items-center space-x-2">
             <span className="font-bold text-lg font-headline">Glittershop</span>
          </Link>
        </div>


        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchBar />
          </div>
          <nav className="flex items-center">
            <Button variant="ghost" size="icon" aria-label="User Profile" asChild>
                <Link href="/login">
                    <User className="h-5 w-5" />
                </Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
