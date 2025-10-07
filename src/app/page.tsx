'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Camera, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home({
  searchParams,
}: {
  searchParams?: {
    q?: string;
  };
}) {
  const searchQuery = searchParams?.q || '';
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                {recommendations.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="recently-viewed" className="mt-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
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
