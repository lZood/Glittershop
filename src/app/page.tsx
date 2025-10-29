'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Camera, ListFilter, ArrowUpDown, SearchX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
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
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const socialImages = [
    PlaceHolderImages.find(p => p.id === 'social-1'),
    PlaceHolderImages.find(p => p.id === 'social-2'),
    PlaceHolderImages.find(p => p.id === 'social-3'),
  ].filter(Boolean) as (typeof PlaceHolderImages[0])[];

  const collections = [
      { name: 'Collar Diamante', imageId: 'collection-diamond' },
      { name: 'Anillo Esmeralda', imageId: 'collection-emerald' },
      { name: 'Pulsera Zafiro', imageId: 'collection-sapphire' },
      { name: 'Pendientes Rubi', imageId: 'collection-ruby' },
  ];

  const recommendations = products.slice(0, 3);
  const recentlyViewed = products.slice(3, 6);
  const bestSellers = products.slice(0, 3);

  if (searchQuery) {
    if (filteredProducts.length > 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground mb-4">
            Mostrando {filteredProducts.length} resultados para '{searchQuery}'
          </p>
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
                      <Button variant="outline" className="w-full justify-center gap-2 bg-accent hover:bg-border">
                      <ArrowUpDown className="w-4 h-4" />
                      Ordenar
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                      <DropdownMenuItem>Novedades</DropdownMenuItem>
                      <DropdownMenuItem>Precio: de menor a mayor</DropdownMenuItem>
                      <DropdownMenuItem>Precio: de mayor a menor</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-8">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex justify-center items-center">
            <div className="bg-yellow-100/50 rounded-full p-4 inline-block mb-4">
              <SearchX className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">No encontramos lo que buscas</h2>
          <p className="text-muted-foreground mb-6">
            Intenta con otras palabras clave o explora nuestras categorías más populares.
          </p>
          <h3 className="text-xl font-bold mb-3">Sugerencias</h3>
          <div className="flex justify-center gap-2 mb-12">
            <Button variant="outline" asChild className="rounded-full bg-accent hover:bg-border">
              <Link href="#">Anillos</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full bg-accent hover:bg-border">
              <Link href="#">Collares</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full bg-accent hover:bg-border">
              <Link href="#">Pulseras</Link>
            </Button>
          </div>
          <h3 className="text-2xl font-bold text-left mb-6">Nuestros más vendidos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-8 text-left">
            {bestSellers.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col bg-background">
      <section className="relative w-full h-[60vh] bg-gray-300 flex flex-col items-center justify-center text-center p-4">
        <div className="text-white">
          <h1 className="text-5xl md:text-6xl font-bold !text-white drop-shadow-md">
            Arte que se lleva puesto.
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl !text-white/90 drop-shadow-sm">
            Descubre la nueva colección Luz de Luna.
          </p>
          <Button asChild className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold" size="lg">
            <Link href="/#products">Descubre la Colección</Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Brilla con #Glittershop
          </h2>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {socialImages.map((img, index) => (
              <div key={img.id} className="relative aspect-square">
                 <Image
                    src={img.imageUrl}
                    alt={img.description}
                    data-ai-hint={img.imageHint}
                    fill
                    className="object-cover rounded-lg"
                 />
                 <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                 <p className="absolute bottom-2 left-2 text-white text-sm font-medium">@{['luna_joyas', 'brillo_eterno', 'estilo_unico'][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Colecciones Destacadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collections.map(collection => {
              const image = PlaceHolderImages.find(p => p.id === collection.imageId);
              return (
                <Link href="#" key={collection.name}>
                  <div className="relative aspect-square group">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={collection.name}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover rounded-lg"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors rounded-lg flex items-end p-4">
                      <h3 className="text-white font-bold text-lg">{collection.name}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="rounded-full bg-accent hover:bg-border text-foreground font-semibold px-6 py-3">
              <Camera className="mr-2 h-5 w-5" />
              Pruébatelo en AR
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Especialmente para Ti
          </h2>

          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary rounded-full">
              <TabsTrigger value="recommendations" className="rounded-full">Recomendaciones para Ti</TabsTrigger>
              <TabsTrigger value="recently-viewed" className="rounded-full">Vistos Recientemente</TabsTrigger>
            </TabsList>
            <TabsContent value="recommendations" className="mt-8">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-8">
                {recommendations.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="recently-viewed" className="mt-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-8">
                    {recentlyViewed.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
