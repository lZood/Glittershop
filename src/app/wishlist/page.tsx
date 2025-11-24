'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { X, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

// Initial mock data
const initialWishlistItems = [
  products.find(p => p.id === '1'),
  products.find(p => p.id === '2'),
  products.find(p => p.id === '4'),
].filter(Boolean) as Product[];

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);
}

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>(initialWishlistItems);

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between max-w-5xl">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase text-foreground">
              Favoritos
            </h1>
            <span className="text-xs md:text-sm text-muted-foreground font-medium">
              ({items.length})
            </span>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-medium text-muted-foreground hover:text-destructive uppercase tracking-wider transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-5xl">
        {items.length > 0 ? (
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-card md:bg-transparent rounded-xl md:rounded-none border md:border-0 p-3 md:p-0 flex md:flex-col gap-4 md:gap-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Section */}
                <div className="relative w-24 h-24 md:w-full md:aspect-[3/4] flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-secondary/20">
                  {item.image && (
                    <Image
                      src={item.image.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  {/* Desktop Overlay Actions */}
                  <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full font-semibold shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      Ver Detalles
                    </Button>
                  </div>

                  {/* Desktop Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="hidden md:flex absolute top-3 right-3 z-20 bg-white/80 backdrop-blur hover:bg-white text-black rounded-full p-2 shadow-sm transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                    title="Eliminar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col md:mt-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Link href={`/products/${item.id}`} className="font-medium text-sm md:text-base text-foreground hover:text-primary transition-colors line-clamp-2 md:line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                    </div>

                    {/* Mobile Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="md:hidden -mt-1 -mr-1 p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <p className="font-bold text-sm md:text-lg">
                      {formatPrice(item.price)}
                    </p>

                    <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold uppercase tracking-wide md:w-full md:mt-4 md:h-10">
                      <ShoppingBag className="w-3 h-3 mr-2 md:w-4 md:h-4" />
                      <span className="md:hidden">Agregar</span>
                      <span className="hidden md:inline">Agregar al Carrito</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center animate-in fade-in zoom-in-95 duration-500 px-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 tracking-tight">Tu lista de deseos está vacía</h2>
            <p className="text-muted-foreground mb-8 max-w-md text-sm md:text-base leading-relaxed">
              Explora nuestras colecciones y guarda tus piezas favoritas.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 font-bold tracking-wide uppercase shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Link href="/">
                Explorar Joyas
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
