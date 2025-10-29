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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ListFilter, Plus, Minus } from 'lucide-react';
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

type FilterButtonsProps = {
  sortOption: string;
  setSortOption: (value: string) => void;
  isSortMenuOpen: boolean;
  setIsSortMenuOpen: (isOpen: boolean) => void;
};

const FilterButtons = ({ sortOption, setSortOption, isSortMenuOpen, setIsSortMenuOpen }: FilterButtonsProps) => (
  <div className="border-t border-b grid grid-cols-2 divide-x bg-transparent">
    <DropdownMenu open={isSortMenuOpen} onOpenChange={setIsSortMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center gap-2 py-3 px-4 font-medium text-sm focus:outline-none w-full">
          <span>CLASIFICAR POR</span>
          {isSortMenuOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          className="p-2"
          value={sortOption}
          onValueChange={setSortOption}>
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
                <Checkbox id="cat-anillos-page" />
                <Label htmlFor="cat-anillos-page">Anillos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cat-collares-page" />
                <Label htmlFor="cat-collares-page">Collares</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cat-pulseras-page" />
                <Label htmlFor="cat-pulseras-page">Pulseras</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cat-aretes-page" />
                <Label htmlFor="cat-aretes-page">Aretes</Label>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Precio</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="price-1-page" />
                <Label htmlFor="price-1-page">Menos de $1000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="price-2-page" />
                <Label htmlFor="price-2-page">$1000 - $2000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="price-3-page" />
                <Label htmlFor="price-3-page">Más de $2000</Label>
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


export default function ShopPage() {
  const [activeTag, setActiveTag] = useState('Ver Todo');
  const [sortOption, setSortOption] = useState('recomendado');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  
  const [isSticky, setIsSticky] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
  const stickyRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const PRODUCTS_PER_PAGE = 32;
  const [visibleProductsCount, setVisibleProductsCount] = useState(PRODUCTS_PER_PAGE);

  const shopProducts = products;
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const stickyElement = stickyRef.current;
  
      if (!stickyElement) return;
  
      const stickyOffsetTop = stickyElement.offsetTop;
      
      // Toggle sticky state based on scroll position relative to the filter bar's original position
      if (currentScrollY > stickyOffsetTop - 64) { // 64 is the header height
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      
      // Toggle visibility based on scroll direction only when it's sticky
      if (isSticky) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setIsHeaderVisible(false);
        } else {
          // Scrolling up
          setIsHeaderVisible(true);
        }
      } else {
        setIsHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
  
    window.addEventListener('scroll', handleScroll, { passive: true });
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSticky]); // Re-run effect when isSticky changes to apply the correct logic

  const tags = ['Ver Todo', 'Los Más Vendidos', 'Anillos', 'Collares', 'Pulseras'];
  const visibleProducts = shopProducts.slice(0, visibleProductsCount);

  return (
    <div className="bg-background">
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

        <div ref={stickyRef} className={cn('mb-8', isSticky ? 'h-[53px]' : '')}>
          <div
            className={cn(
              'w-full z-30',
              isSticky ? 'fixed top-16 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : 'relative bg-background',
              !isHeaderVisible && 'hidden'
            )}
          >
              <FilterButtons 
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  isSortMenuOpen={isSortMenuOpen}
                  setIsSortMenuOpen={setIsSortMenuOpen}
              />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-8">
          {visibleProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Load More Section */}
        {shopProducts.length > visibleProductsCount && (
            <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                    Mostrando {visibleProductsCount} de {shopProducts.length} productos
                </p>
                <Button 
                    variant="outline" 
                    className="rounded-none border-black hover:bg-black hover:text-white uppercase tracking-wider h-11 px-8"
                    onClick={() => setVisibleProductsCount(prev => prev + PRODUCTS_PER_PAGE)}
                >
                    Cargar más
                </Button>
            </div>
        )}

      </section>
    </div>
  );
}
