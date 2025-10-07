import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold !text-white drop-shadow-lg">
            Timeless Elegance
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl !text-white/90 drop-shadow-md">
            Discover exquisite jewelry that transcends trends. Modern heirlooms crafted for a lifetime of memories.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/gift-guide">Find the Perfect Gift</Link>
          </Button>
        </div>
      </section>

      <section id="products" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-10">
            Our Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full">
              No products found for &quot;{searchQuery}&quot;.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
