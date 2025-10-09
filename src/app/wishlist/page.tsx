'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';

const wishlistItems = [
  products.find(p => p.id === '1'),
  products.find(p => p.id === '5'),
  products.find(p => p.id === '3'),
  products.find(p => p.id === '4'),
].filter(Boolean) as Product[];

const recommendedItems = products.slice(4, 7);

export default function WishlistPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-center mb-2">Mi Lista de Deseos</h1>
          {wishlistItems.length > 0 && (
            <p className="text-muted-foreground">
              Tienes {wishlistItems.length} joyas guardadas.
            </p>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {wishlistItems.map((item) => (
                <div key={item.id} className="relative group">
                  <ProductCard product={item} />
                  <div className="flex justify-center mt-3 space-x-2">
                    <Button variant="outline" size="icon" className="rounded-full border-gray-300">
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                    </Button>
                     <Button variant="outline" size="icon" className="rounded-full border-gray-300">
                      <Trash2 className="w-5 h-5 text-gray-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <section className="py-16">
              <h2 className="text-2xl font-bold text-center mb-6">Completa tu Look</h2>
              <div className="grid grid-cols-2 gap-4">
                {recommendedItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
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
