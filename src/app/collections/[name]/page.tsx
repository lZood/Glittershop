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
  
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isFilterBarVisible, setIsFilterBarVisible] = useState(true);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [openAccordion, setOpenAccordion] = useState('');


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
        if(entry.isIntersecting) {
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


  const socialImages = [
    PlaceHolderImages.find(p => p.id === 'social-1'),
    PlaceHolderImages.find(p => p.id === 'social-2'),
  ].filter(Boolean) as (typeof PlaceHolderImages[0])[];

  const collectionProducts = products.slice(0, 6);

  if (!collection) {
    return <div className="container mx-auto py-8 text-center">Colección no encontrada.</div>;
  }

  const FilterAndSortButtons = () => (
    <div className="border-t border-b">
        <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion}>
            <AccordionItem value="sort" className="border-b-0">
                <AccordionTrigger className="py-3 px-4 font-medium text-sm hover:no-underline justify-between w-full">
                    <div className="flex items-center gap-2">
                        <span>CLASIFICAR POR</span>
                    </div>
                     {openAccordion === 'sort' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                    <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                        <div className="flex items-center justify-between py-2">
                           <Label htmlFor="recomendado" className="font-normal">Recomendado</Label>
                           <DropdownMenuRadioItem value="recomendado" id="recomendado" className="p-0"/>
                        </div>
                        <div className="flex items-center justify-between py-2">
                           <Label htmlFor="reciente" className="font-normal">Más reciente</Label>
                           <DropdownMenuRadioItem value="reciente" id="reciente" className="p-0"/>
                        </div>
                        <div className="flex items-center justify-between py-2">
                           <Label htmlFor="precio-bajo" className="font-normal">El precio más bajo</Label>
                           <DropdownMenuRadioItem value="precio-bajo" id="precio-bajo" className="p-0"/>
                        </div>
                         <div className="flex items-center justify-between py-2">
                           <Label htmlFor="precio-alto" className="font-normal">El precio más alto</Label>
                           <DropdownMenuRadioItem value="precio-alto" id="precio-alto" className="p-0"/>
                        </div>
                    </DropdownMenuRadioGroup>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex items-center justify-between w-full py-3 px-4 text-sm font-medium border-t cursor-pointer">
                 <span>FILTRO</span>
                <ListFilter className="w-4 h-4" />
            </div>
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
            <FilterAndSortButtons />
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
