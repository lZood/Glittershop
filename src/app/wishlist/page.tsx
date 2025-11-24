'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { X, ShoppingBag, Heart, ArrowRight, Share2, Trash2, AlertCircle, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const footer = document.getElementById('main-footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide header when footer is intersecting (visible)
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      description: "Producto eliminado de favoritos",
    });
  };

  const clearAll = () => {
    setItems([]);
    toast({
      description: "Lista de favoritos vaciada",
    });
  };

  const shareWishlist = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "¡Enlace copiado!",
      description: "Comparte tu lista de deseos con tus amigos.",
    });
  };

  // Mock stock status for UI demonstration
  const getStockStatus = (index: number) => {
    if (index === 2) return { label: 'Pocas piezas', color: 'text-amber-600 bg-amber-100 border-amber-200' };
    return { label: 'Disponible', color: 'text-green-600 bg-green-100 border-green-200' };
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : '-200%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between max-w-6xl">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase text-foreground">
              Favoritos
            </h1>
            <Badge variant="secondary" className="text-xs font-bold rounded-full px-2.5">
              {items.length}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <>
                <Button variant="ghost" size="sm" onClick={shareWishlist} className="flex">
                  <Share2 className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Compartir</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Limpiar Lista</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará todos los artículos de tu lista de deseos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={clearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Sí, eliminar todo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl">
        {items.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {items.map((item, index) => {
                const stock = getStockStatus(index);
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative bg-card rounded-xl border shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                  >
                    {/* Image Section */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-secondary/20">
                      {item.image && (
                        <Image
                          src={item.image.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${stock.color}`}>
                          {stock.label}
                        </Badge>
                      </div>

                      {/* Remove Button (Desktop Overlay) */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur text-black rounded-full p-2.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-600 transform translate-y-[-10px] group-hover:translate-y-0"
                        title="Eliminar"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Quick Add Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center pb-6">
                        <Button className="w-full rounded-full font-bold shadow-lg bg-white text-black hover:bg-white/90">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Agregar al Carrito
                        </Button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">{item.category}</p>
                        <Link href={`/products/${item.id}`} className="block">
                          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="font-black text-xl">
                          {formatPrice(item.price)}
                        </p>
                        {/* Mobile Remove (Visible only on mobile) */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="md:hidden text-muted-foreground hover:text-destructive -mr-2"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Mobile Add to Cart */}
                      <Button className="w-full mt-4 rounded-full md:hidden" variant="secondary">
                        Agregar al Carrito
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 md:py-32 text-center px-4"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
              <div className="relative w-24 h-24 bg-background border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-primary/50" />
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-black mb-3 tracking-tight uppercase">Tu lista está vacía</h2>
            <p className="text-muted-foreground mb-8 max-w-md text-base md:text-lg leading-relaxed">
              Aún no has guardado ninguna joya. Explora nuestras colecciones exclusivas y encuentra tu próxima pieza favorita.
            </p>
            <Button asChild size="lg" className="rounded-full px-10 h-12 font-bold tracking-wide uppercase shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground">
              <Link href="/shop">
                Explorar Colección
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
