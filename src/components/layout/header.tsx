'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, User, Menu, X, Star, Instagram, ChevronRight } from 'lucide-react';
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
import { useSession } from '@/lib/supabase/session-provider';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, Variants } from 'framer-motion';
import { useState, Suspense, useRef } from 'react';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';

// Static Data for Mega Menu
const menuData = [
  {
    id: 'novedades',
    label: 'Novedades',
    columns: [
      {
        title: 'Lo Nuevo',
        items: [
          { label: 'Recién Llegados', href: '/shop?sort=newest' },
          { label: 'Edición Limitada', href: '/shop?tag=limited' },
          { label: 'Más Vendidos', href: '/shop?sort=bestsellers' },
        ],
      },
      {
        title: 'Tendencias',
        items: [
          { label: 'Minimalista', href: '/shop?style=minimalist' },
          { label: 'Statement Pieces', href: '/shop?style=statement' },
          { label: 'Layering', href: '/shop?style=layering' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
      alt: 'Novedades',
      caption: 'Descubre lo último',
    },
  },
  {
    id: 'colecciones',
    label: 'Colecciones',
    columns: [
      {
        title: 'Destacadas',
        items: [
          { label: 'Luz de Luna', href: '/collections/luz-de-luna' },
          { label: 'Verano Mediterráneo', href: '/collections/verano-mediterraneo' },
          { label: 'Elegancia Eterna', href: '/collections/eternal' },
        ],
      },
      {
        title: 'Colaboraciones',
        items: [
          { label: 'Glitter x Artist', href: '/collections/collabs' },
          { label: 'Disney x Glitter', href: '/collections/disney' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
      alt: 'Colecciones',
      caption: 'Historias que brillan',
    },
  },
  {
    id: 'bracelets',
    label: 'Brazaletes',
    columns: [
      {
        title: 'Estilo',
        items: [
          { label: 'Todos los brazaletes', href: '/shop?category=bracelets' },
          { label: 'Cadena de serpiente', href: '/shop?style=snake-chain' },
          { label: 'Rígidos', href: '/shop?style=bangle' },
          { label: 'Cuero', href: '/shop?style=leather' },
          { label: 'Eslabones', href: '/shop?style=link' },
        ],
      },
      {
        title: 'Colección',
        items: [
          { label: 'Glitter Moments', href: '/collections/moments' },
          { label: 'Glitter ME', href: '/collections/me' },
          { label: 'Glitter Reflexions', href: '/collections/reflexions' },
        ],
      },
      {
        title: 'Metal',
        items: [
          { label: 'Plata', href: '/shop?metal=silver' },
          { label: 'Oro', href: '/shop?metal=gold' },
          { label: 'Oro Rosa', href: '/shop?metal=rose-gold' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
      alt: 'Brazaletes',
      caption: 'Descubre tu estilo',
    },
  },
  {
    id: 'rings',
    label: 'Anillos',
    columns: [
      {
        title: 'Categoría',
        items: [
          { label: 'Todos los anillos', href: '/shop?category=rings' },
          { label: 'De compromiso', href: '/shop?category=engagement' },
          { label: 'Apilables', href: '/shop?category=stackable' },
          { label: 'Con piedras', href: '/shop?category=stones' },
        ],
      },
      {
        title: 'Precio',
        items: [
          { label: 'Menos de $1000', href: '/shop?maxPrice=1000' },
          { label: '$1000 - $2000', href: '/shop?minPrice=1000&maxPrice=2000' },
          { label: 'Más de $2000', href: '/shop?minPrice=2000' },
        ],
      },
      {
        title: 'Metal',
        items: [
          { label: 'Plata', href: '/shop?metal=silver' },
          { label: 'Oro', href: '/shop?metal=gold' },
          { label: 'Oro Rosa', href: '/shop?metal=rose-gold' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
      alt: 'Anillos Elegantes',
      caption: 'Promesas eternas',
    },
  },
  {
    id: 'earrings',
    label: 'Aretes',
    columns: [
      {
        title: 'Estilo',
        items: [
          { label: 'Todos los aretes', href: '/shop?category=earrings' },
          { label: 'Broqueles', href: '/shop?style=studs' },
          { label: 'Aros', href: '/shop?style=hoops' },
          { label: 'Colgantes', href: '/shop?style=drops' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
      alt: 'Aretes',
      caption: 'Brilla con luz propia',
    },
  },
  {
    id: 'necklaces',
    label: 'Collares',
    columns: [
      {
        title: 'Categoría',
        items: [
          { label: 'Todos los collares', href: '/shop?category=necklaces' },
          { label: 'Con dije', href: '/shop?style=pendant' },
          { label: 'Cadenas', href: '/shop?style=chain' },
        ],
      },
      {
        title: 'Precio',
        items: [
          { label: 'Menos de $1000', href: '/shop?maxPrice=1000' },
          { label: '$1000 - $2000', href: '/shop?minPrice=1000&maxPrice=2000' },
          { label: 'Más de $2000', href: '/shop?minPrice=2000' },
        ],
      },
      {
        title: 'Metal',
        items: [
          { label: 'Plata', href: '/shop?metal=silver' },
          { label: 'Oro', href: '/shop?metal=gold' },
          { label: 'Oro Rosa', href: '/shop?metal=rose-gold' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1599643478524-19cb9f3237f3?auto=format&fit=crop&q=80&w=600',
      alt: 'Collares Exclusivos',
      caption: 'Elegancia atemporal',
    },
  },
];

const mobileTiendaLinks = [
  { href: '/shop', label: 'Ver Todo' },
  { href: '/shop?category=rings', label: 'Anillos' },
  { href: '/shop?category=necklaces', label: 'Collares' },
  { href: '/shop?category=bracelets', label: 'Pulseras' },
  { href: '/shop?category=earrings', label: 'Aretes' },
];

const coleccionesLinks = [
  { href: '/collections/luz-de-luna', label: 'Colección: Luz de Luna' },
  { href: '/collections/verano-mediterraneo', label: 'Colección: Verano Mediterráneo' },
  { href: '/collections', label: 'Todas las Colecciones' },
];

// Framer Motion Variants
const containerVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: 'easeInOut' as const },
      opacity: { duration: 0.2 },
    },
  },
};

const childVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function Header() {
  const { session, profile } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { scrollY } = useScroll();

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll logic for dynamic header
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Solid background threshold
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide header if scrolling down after 150px
    if (latest > 150 && latest > previous) {
      setIsVisible(false);
      setActiveMenu(null); // Close menu when hiding header
    } else {
      setIsVisible(true);
    }
  });

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // Logic for transparent vs solid
  const isHome = pathname === '/';
  // It should be solid if we are not on home, OR scrolled > 50px, OR mega menu is open, OR hovering the header, OR search is open
  const isSolid = !isHome || isScrolled || activeMenu !== null || isHovering || isSearchOpen;

  // Adaptive Colors
  const textColor = isSolid ? 'text-foreground' : 'text-white';
  const iconColorWrapper = isSolid ? 'hover:bg-black/5 text-foreground' : 'hover:bg-white/10 text-white';

  const activeData = menuData.find(item => item.id === activeMenu);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : '-100%' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 z-50 w-full transition-colors duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dynamic Background Layer */}
      <div
        className={cn(
          "absolute inset-0 z-[-1] transition-opacity duration-300",
          isSolid ? "opacity-100 bg-background" : "opacity-0"
        )}
      />

      {/* Main Header Row */}
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-10 mx-auto w-full md:w-[80%] relative z-10 border-b border-transparent">

        {/* Border overlay for solid state */}
        <div className={cn("absolute bottom-0 left-0 w-full h-[1px] transition-opacity duration-300", isSolid ? "opacity-100 bg-border" : "opacity-0")} />

        {/* Logo */}
        <div className="flex items-center flex-1 md:flex-none md:justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <span className={cn(
              "font-medium tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase whitespace-nowrap transition-colors duration-300",
              textColor,
              "text-sm sm:text-base md:text-xl"
            )}>
              Glitters Shop
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center flex-1 px-4" onMouseLeave={handleMouseLeave}>
          <ul className="flex items-center justify-center gap-8 h-full">
            {menuData.map((item) => (
              <li
                key={item.id}
                className="relative h-16 flex items-center"
                onMouseEnter={() => handleMouseEnter(item.id)}
              >
                <Link
                  href={`/shop?category=${item.id}`}
                  className={cn(
                    "text-sm tracking-widest uppercase transition-all duration-300 py-1 relative",
                    activeMenu === item.id ? "font-bold" : "font-medium hover:font-bold",
                    textColor
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-[2px] origin-left bg-current transition-transform duration-300 ease-out",
                      activeMenu === item.id ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right-side Icons */}
        <div className="flex items-center justify-end md:gap-x-1">
          <Suspense fallback={<Button variant="ghost" size="icon" className={iconColorWrapper}><Search className="h-5 w-5" /></Button>}>
            <div className={iconColorWrapper}>
              <SearchOverlay onOpenChange={setIsSearchOpen} />
            </div>
          </Suspense>

          <Button variant="ghost" size="icon" aria-label="User Profile" asChild className={cn("transition-colors duration-300", iconColorWrapper)}>
            <Link href={session ? "/profile" : "/login"}>
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" aria-label="Wishlist" asChild className={cn("transition-colors duration-300", iconColorWrapper)}>
            <Link href="/wishlist">
              <Star className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" aria-label="Shopping Cart" asChild className={cn("transition-colors duration-300", iconColorWrapper)}>
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
              <Button variant="ghost" size="icon" className={cn("md:hidden transition-colors duration-300", iconColorWrapper)}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/80 backdrop-blur-xl border-l border-border/50 p-0 flex flex-col h-full z-50">
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
                    {mobileTiendaLinks.map((link) => (
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

                <SheetClose asChild>
                  <Link href="/wishlist" className="flex items-center gap-3 py-2 text-lg font-medium transition-all hover:text-primary">
                    <Star className="w-5 h-5" />
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
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>

      {/* Animated Mega Menu Dropdown */}
      <AnimatePresence>
        {activeMenu && activeData && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="absolute left-0 top-16 w-full overflow-hidden bg-background border-b shadow-lg"
            onMouseEnter={() => handleMouseEnter(activeMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="container mx-auto px-8 py-10 w-full md:w-[80%]">
              <div className="grid grid-cols-12 gap-10">
                {/* Title and Direct Link */}
                <motion.div variants={childVariants} className="col-span-3 border-r border-border/50 pr-8">
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-foreground">{activeData.label}</h2>
                  <Link
                    href={`/shop?category=${activeData.id}`}
                    className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
                  >
                    Ver colección completa
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                {/* Sub-categories Columns */}
                <div className="col-span-6 grid grid-cols-3 gap-8">
                  {activeData.columns.map((col, idx) => (
                    <motion.div key={idx} variants={childVariants} className="space-y-5">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{col.title}</h3>
                      <ul className="space-y-3">
                        {col.items.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link
                              href={link.href}
                              className="group flex items-center text-sm text-foreground/80 hover:text-primary transition-colors font-medium"
                            >
                              <span className="relative">
                                {link.label}
                                <span className="absolute -bottom-0.5 left-0 w-full h-[1px] origin-left bg-primary scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 ml-1 text-primary" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                {/* Hero Image */}
                <motion.div variants={childVariants} className="col-span-3 pl-4 border-l border-border/50">
                  <Link href={`/shop?category=${activeData.id}`} className="block relative aspect-[4/5] w-full overflow-hidden rounded-md group">
                    <Image
                      src={activeData.image.src}
                      alt={activeData.image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                      <p className="text-white font-bold text-lg leading-tight uppercase tracking-wider">{activeData.image.caption}</p>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  );
}
