'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ListFilter, Plus, Minus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const collectionDetails = {
    'verano-mediterraneo': {
        name: 'Colección de Verano',
        description: 'Descubre piezas que capturan la esencia del sol.',
        heroImage: PlaceHolderImages.find(p => p.id === 'collection-summer-hero'),
    },
    'luz-de-luna': {
        name: 'Colección Luz de Luna',
        description: 'Capturando la magia del cielo nocturno.',
        heroImage: PlaceHolderImages.find(p => p.id === 'collection-moonlight'),
    },
    'geometria-urbana': {
        name: 'Colección Geometría Urbana',
        description: 'Líneas limpias y diseños audaces para la ciudad.',
        heroImage: PlaceHolderImages.find(p => p.id === 'collection-urban'),
    },
};

export default function CollectionDetailPage({ params }: { params: { name: string } }) {
  const collectionKey = params.name as keyof typeof collectionDetails;
  const collection = collectionDetails[collectionKey];
  const [sortOption, setSortOption] = useState('recomendado');
  const [headerSortOption, setHeaderSortOption] = useState('recomendado');
  
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isFilterBarVisible, setIsFilterBarVisible] = useState(true);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isHeaderSortMenuOpen, setIsHeaderSortMenuOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide sticky header based on scroll direction and position
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsHeaderVisible(false);
      } else {
        // Scrolling up
        if (!isFilterBarVisible) {
          setIsHeaderVisible(true);
        } else {
          setIsHeaderVisible(false);
        }
      }
      lastScrollY.current = currentScrollY;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFilterBarVisible(entry.isIntersecting);
        if(entry.isIntersecting) {
            setIsHeaderVisible(false);
        }
      },
      { threshold: 0 } // Trigger as soon as the element is out of view
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


  const socialImages = [
    PlaceHolderImages.find(p => p.id === 'social-1'),
    PlaceHolderImages.find(p => p.id === 'social-2'),
  ].filter(Boolean) as (typeof PlaceHolderImages[0])[];

  const collectionProducts = products.slice(0, 6);

  if (!collection) {
    return <div className="container mx-auto py-8 text-center">Colección no encontrada.</div>;
  }

  const HeaderFilterButtons = () => (
    <div className="border-t border-b grid grid-cols-2 divide-x">
      <DropdownMenu open={isHeaderSortMenuOpen} onOpenChange={setIsHeaderSortMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center gap-2 py-3 px-4 font-medium text-sm focus:outline-none w-full">
            <span>CLASIFICAR POR</span>
            {isHeaderSortMenuOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>CLASIFICAR POR</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={headerSortOption} onValueChange={(value) => { setSortOption(value); setHeaderSortOption(value); }}>
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

  const PageFilterButtons = () => (
    <div className="border-t border-b grid grid-cols-2 divide-x">
      <DropdownMenu open={isSortMenuOpen} onOpenChange={setIsSortMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center gap-2 py-3 px-4 font-medium text-sm focus:outline-none w-full">
            <span>CLASIFICAR POR</span>
            {isSortMenuOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>CLASIFICAR POR</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => { setSortOption(value); setHeaderSortOption(value); }}>
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
        ref={headerRef} 
        className={cn(
            "sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
            isHeaderVisible ? "block" : "hidden"
        )}
      >
        <div className="container mx-auto px-4">
            <HeaderFilterButtons />
        </div>
      </div>
      <section className="relative w-full h-[40vh] bg-gray-300 flex flex-col items-center justify-center text-center p-4">
        {collection.heroImage && (
          <Image
            src={collection.heroImage.imageUrl}
            alt={collection.heroImage.description}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-white">
          <h1 className="text-4xl md:text-5xl font-bold !text-white drop-shadow-md">
            {collection.name}
          </h1>
          <p className="mt-2 text-md md:text-lg max-w-2xl !text-white/90 drop-shadow-sm">
            {collection.description}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Así lo llevas tú
          </h2>
          <div className="grid grid-cols-2 gap-4 md:gap-8 justify-center">
            {socialImages.map((img, index) => (
              <div key={img.id} className="relative aspect-[4/5] max-w-sm mx-auto">
                 <Image
                    src={img.imageUrl}
                    alt={img.description}
                    data-ai-hint={img.imageHint}
                    fill
                    className="object-cover rounded-lg"
                 />
                 <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                 <p className="absolute bottom-2 left-0 right-0 text-center text-white text-sm font-medium">@{['fashionista', 'jewelrylover'][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">Productos</h2>
        <div ref={filterBarRef} className="mb-8">
            <PageFilterButtons />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
          {collectionProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
