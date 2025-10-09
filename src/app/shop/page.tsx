'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ListFilter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const [activeTag, setActiveTag] = useState('Ver Todo');
  const [sortOption, setSortOption] = useState('recomendado');
  const shopProducts = products;

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isFilterBarVisible, setIsFilterBarVisible] = useState(true);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsHeaderVisible(false);
      } else {
        // Scrolling up
        if (!isFilterBarVisible) {
          setIsHeaderVisible(true);
        }
      }
      lastScrollY.current = currentScrollY;

      if (currentScrollY === 0) {
        setIsHeaderVisible(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFilterBarVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsHeaderVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (filterBarRef.current) {
      observer.observe(filterBarRef.current);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (filterBarRef.current) {
        observer.unobserve(filterBarRef.current);
      }
    };
  }, [isFilterBarVisible]);

  const tags = ['Ver Todo', 'Los Más Vendidos', 'Anillos', 'Collares', 'Pulseras'];

  const FilterAndSortButtons = () => (
    <div className="border-t border-b grid grid-cols-2 divide-x">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center gap-2 py-3 px-4 font-medium text-sm focus:outline-none">
            <span>CLASIFICAR POR</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>CLASIFICAR POR</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
            <DropdownMenuRadioItem value="recomendado">Recomendado</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="reciente">Más reciente</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="precio-bajo">El precio más bajo</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="precio-alto">El precio más alto</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet>
        <SheetTrigger asChild>
          <button className="flex items-center justify-center gap-2 py-3 px-4 font-medium text-sm focus:outline-none">
            <span>FILTRO</span>
            <ListFilter className="w-4 h-4" />
          </button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filtrar Productos</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Categoría</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="cat-anillos" />
                  <Label htmlFor="cat-anillos">Anillos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cat-collares" />
                  <Label htmlFor="cat-collares">Collares</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cat-pulseras" />
                  <Label htmlFor="cat-pulseras">Pulseras</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cat-aretes" />
                  <Label htmlFor="cat-aretes">Aretes</Label>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Precio</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-1" />
                  <Label htmlFor="price-1">Menos de $1000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-2" />
                  <Label htmlFor="price-2">$1000 - $2000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-3" />
                  <Label htmlFor="price-3">Más de $2000</Label>
                </div>
              </div>
            </div>
          </div>
          <SheetClose asChild>
            <Button className="w-full">Aplicar Filtros</Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="bg-background">
       <div 
        className={cn(
            "sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-transform duration-300",
            isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-4">
            <FilterAndSortButtons />
        </div>
      </div>
      <section className="container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-4xl font-bold text-left mb-6 uppercase">Ver Todo</h1>
        
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 -mx-4 px-4">
          {tags.map(tag => (
            <Button
              key={tag}
              variant={activeTag === tag ? 'default' : 'outline'}
              className={`rounded-none flex-shrink-0 ${activeTag === tag ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>

        <div ref={filterBarRef} className="mb-8">
          <FilterAndSortButtons />
        </div>


        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
          {shopProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
