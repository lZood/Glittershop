'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { CheckoutStepper } from '@/components/checkout/checkout-stepper';
import { OrderSummary } from '@/components/checkout/order-summary';
import { motion, AnimatePresence } from 'framer-motion';

import type { Product } from '@/lib/types';

interface CartItem extends Product {
  quantity: number;
  size?: string;
  material?: string;
  length?: string;
  stock?: number;
}

// Mock Cart Data (In a real app, this would come from a context or API)
const initialCartItems: CartItem[] = [
  {
    ...products.find(p => p.id === '1')!,
    quantity: 1,
    size: '7',
    material: 'Oro Blanco',
    stock: 2,
  },
  {
    ...products.find(p => p.id === '7')!,
    quantity: 1,
    length: '18 pulgadas',
    stock: 1,
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item?.id === id) {
        const newQuantity = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item?.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item?.price || 0) * (item?.quantity || 1), 0);
  const shipping = 0.00;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 md:py-12">

        {/* Stepper */}
        <CheckoutStepper currentStep="cart" />

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 max-w-7xl mx-auto">

          {/* Left Column: Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Tu Carrito</h1>
              <span className="text-muted-foreground">{cartItems.length} artículos</span>
            </div>

            <AnimatePresence mode="popLayout">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  item && (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-card/50 backdrop-blur-sm border rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex gap-4 md:gap-6">
                        {/* Image */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0">
                          {item.image && (
                            <Image
                              src={item.image.imageUrl}
                              alt={item.name || 'Product Image'}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <Link href={`/products/${item.id}`} className="font-bold text-lg md:text-xl hover:text-primary transition-colors line-clamp-1">
                                {item.name}
                              </Link>
                              <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                                {item.size && <p>Talla: <span className="text-foreground font-medium">{item.size}</span></p>}
                                {item.material && <p>Material: <span className="text-foreground font-medium">{item.material}</span></p>}
                                {item.length && <p>Largo: <span className="text-foreground font-medium">{item.length}</span></p>}
                              </div>
                            </div>
                            <p className="font-bold text-lg md:text-xl">{formatPrice(item.price || 0)}</p>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border rounded-full bg-background">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-secondary/50 rounded-l-full transition-colors"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-secondary/50 rounded-r-full transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {item.stock && item.stock < 5 && (
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full animate-pulse">
                                  ¡Quedan {item.stock}!
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4" onClick={() => removeItem(item.id)} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-card/30 rounded-xl border border-dashed"
                >
                  <p className="text-xl text-muted-foreground mb-6">Tu carrito está vacío</p>
                  <Button asChild>
                    <Link href="/shop">Ir a la tienda</Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Additional Info / Upsell could go here */}
            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Envío Gratuito</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Todos los pedidos incluyen envío estándar gratuito y seguro de transporte.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              actionLabel="Continuar al Envío"
              actionHref="/shipping"
              disabled={cartItems.length === 0}
            />

            {/* Promo Code Input (Optional placement) */}
            <div className="mt-6">
              <div className="flex gap-2">
                <Input placeholder="Código de descuento" className="bg-background" />
                <Button variant="outline">Aplicar</Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
