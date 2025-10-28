'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { Star } from 'lucide-react';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import ProductCard from '@/components/product-card';

const wishlistItems = [
  products.find(p => p.id === '1'),
  products.find(p => p.id === '2'),
  products.find(p => p.id === '4'),
].filter(Boolean) as Product[];

export default function WishlistPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter mb-1 uppercase">Favoritos</h1>
          {wishlistItems.length > 0 && (
            <p className="text-muted-foreground uppercase text-sm font-medium tracking-wide">
              {wishlistItems.length} artículos
            </p>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
            {wishlistItems.map((item) => (
              <div key={item.id}>
                <ProductCard product={item} />
                <Button variant="outline" className="w-full mt-3 rounded-none border-black hover:bg-black hover:text-white uppercase tracking-wider text-xs h-9">
                  Agregar
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Aún no has guardado ninguna joya</h2>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
              ¡Explora nuestras colecciones y encuentra tus próximas favoritas!
            </p>
            <Button asChild size="lg" className="font-bold bg-primary text-primary-foreground">
              <Link href="/shop">Descubrir Joyas</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
