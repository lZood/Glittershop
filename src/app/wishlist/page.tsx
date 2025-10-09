
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const wishlistItems = [
  products.find(p => p.id === '1'),
  products.find(p => p.id === '5'),
  products.find(p => p.id === '3'),
  products.find(p => p.id === '7'),
].filter(Boolean);

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function WishlistPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Mi Lista de Deseos</h1>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              item && (
                <div key={item.id} className="bg-card p-4 rounded-lg border flex flex-col justify-between">
                  <div>
                    <Link href={`/products/${item.id}`} className="block">
                      <div className="relative w-full h-60 rounded-md overflow-hidden bg-gray-100 mb-4">
                        {item.image && (
                          <Image
                            src={item.image.imageUrl}
                            alt={item.name || 'Product Image'}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <h2 className="font-bold text-lg mb-1">{item.name}</h2>
                      <p className="font-semibold text-primary text-base mb-2">{formatPrice(item.price || 0)}</p>
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-col space-y-2">
                    <Button className="w-full bg-primary text-primary-foreground">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Añadir al Carrito
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      Quitar de la lista
                    </Button>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tu lista de deseos está vacía</h2>
            <p className="text-muted-foreground mb-6">
              Añade tus joyas favoritas a tu lista de deseos para no perderlas de vista.
            </p>
            <Button asChild>
              <Link href="/shop">Explorar Tienda</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
