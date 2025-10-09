
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { Heart, ShoppingCart, MoreVertical, Trash2, Share2, Star } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';


const wishlistItems = [
  products.find(p => p.id === '1'),
  products.find(p => p.id === '5'),
  products.find(p => p.id === '3'),
].filter(Boolean) as Product[];

const recommendedItems = products.slice(4, 7);

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
        <Star
            key={i}
            className={`w-4 h-4 ${
            i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
        />
        );
    }
    return stars;
}


export default function WishlistPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold text-left mb-2">Mi Lista de Deseos</h1>
        
        {wishlistItems.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-8">Tienes {wishlistItems.length} joyas guardadas</p>
            <div className="space-y-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-card rounded-lg border">
                  <div className="flex items-start gap-4 p-4">
                    <Link href={`/products/${item.id}`} className="block flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                        {item.image && (
                          <Image
                            src={item.image.imageUrl}
                            alt={item.name || 'Product Image'}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className='flex-1'>
                            <h2 className="font-bold text-base mb-1 pr-2">{item.name}</h2>
                            <p className="font-semibold text-primary text-base mb-2">{formatPrice(item.price || 0)}</p>
                        </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Compartir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(item.rating || 0)}
                      </div>

                      { item.id === '1' && (
                        <p className="text-sm font-medium text-red-600">¡Date prisa! Solo quedan 2 en tu talla.</p>
                      )}
                      { item.id === '5' && (
                        <div className="text-sm font-bold text-white bg-red-500 px-2 py-0.5 rounded-full inline-block">¡Ahora con -20% OFF!</div>
                      )}

                    </div>
                  </div>
                   <div className="border-t p-4">
                        <Button className="w-full bg-primary text-primary-foreground">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Mover al Carrito
                        </Button>
                    </div>
                </div>
              ))}
            </div>

            <section className="py-12 md:py-16">
                <h2 className="text-2xl font-bold text-left mb-6">Completa tu Look</h2>
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
            <Button asChild size="lg" className="font-bold">
              <Link href="/shop">Descubrir Joyas</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
