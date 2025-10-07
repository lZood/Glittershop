'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ListFilter } from 'lucide-react';
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

export default function ShopPage() {
  const summerCollectionImage = PlaceHolderImages.find(
    (p) => p.id === 'collection-summer-hero'
  );
  const customerImages = [
    PlaceHolderImages.find((p) => p.id === 'customer-1'),
    PlaceHolderImages.find((p) => p.id === 'customer-2'),
  ].filter(Boolean) as (typeof PlaceHolderImages[0])[];

  const shopProducts = products.slice(0, 6);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] text-white rounded-lg overflow-hidden md:mx-auto md:w-[80%] md:mt-4">
        {summerCollectionImage && (
          <Image
            src={summerCollectionImage.imageUrl}
            alt={summerCollectionImage.description}
            data-ai-hint={summerCollectionImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-white drop-shadow-lg">
            Colección de Verano
          </h1>
          <p className="mt-2 text-lg md:text-xl max-w-lg !text-white/90 drop-shadow-md">
            Descubre piezas que capturan la esencia del sol.
          </p>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-10">
          <h2 className="text-2xl font-bold text-left mb-6">Así lo llevas tú</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {customerImages.map((img, index) => (
              <div key={img.id} className="text-center">
                <div className="relative aspect-square w-full h-auto rounded-lg overflow-hidden mb-2">
                  <Image
                    src={img.imageUrl}
                    alt={img.description}
                    data-ai-hint={img.imageHint}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-medium">
                  {['@fashionista', '@jewelrylover'][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 md:px-10 pb-16">
        <h2 className="text-2xl font-bold text-left mb-6">Productos</h2>

        {/* Filter and Sort Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-center gap-2 bg-accent hover:bg-border">
                    <ListFilter className="w-4 h-4" />
                    Filtrar
                </Button>
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

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="default" className="w-full justify-center gap-2" style={{ backgroundColor: '#FDB813', color: '#000000' }}>
                    Ordenar
                    <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>Novedades</DropdownMenuItem>
                    <DropdownMenuItem>Precio: de menor a mayor</DropdownMenuItem>
                    <DropdownMenuItem>Precio: de mayor a menor</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
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
