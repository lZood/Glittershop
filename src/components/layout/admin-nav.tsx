'use client';
import Link from 'next/link';
import {
  Home,
  Package,
  BookCopy,
  Tag,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mainLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/collections', label: 'Colecciones', icon: BookCopy },
  { href: '/admin/categories', label: 'Categorías', icon: Tag },
];

export default function AdminNav({ isMobile = false }) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid items-start px-2 text-sm font-medium lg:px-4", isMobile ? "gap-2" : "gap-1")}>
      {mainLinks.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            pathname === href && 'bg-muted text-primary'
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
