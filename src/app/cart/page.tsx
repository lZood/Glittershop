'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { CheckoutStepper } from '@/components/checkout/checkout-stepper';
import { OrderSummary } from '@/components/checkout/order-summary';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, subtotal } = useCart();

  const freeShippingThreshold = 800;
  const shippingCost = 150;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = isFreeShipping ? 0 : shippingCost;
  const total = subtotal + shipping;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
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
                  <motion.div
                    key={`${item.product.id}-${item.color}-${item.size}`}
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
                        {item.product.image ? (
                          <Image
                            src={item.product.image.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Link href={`/products/${item.product.slug || item.product.id}`} className="font-bold text-lg md:text-xl hover:text-primary transition-colors line-clamp-1">
                              {item.product.name}
                            </Link>
                            <div className="text-sm text-muted-foreground mt-2 space-y-1">
                              {item.size && (
                                <div className="flex items-center gap-2">
                                  <span>Talla:</span>
                                  <span className="text-foreground font-medium px-2 py-0.5 bg-secondary/50 rounded-md text-xs">{item.size}</span>
                                </div>
                              )}
                              {item.color && (
                                <div className="flex items-center gap-2">
                                  <span>Color:</span>
                                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-secondary/30 border border-border/50">
                                    <span
                                      className="w-3 h-3 rounded-full border border-black/10 shadow-sm"
                                      style={{
                                        backgroundColor: item.product.variants?.find(v => v.color === item.color)?.color_metadata?.hex || '#ccc'
                                      }}
                                    />
                                    <span className="text-foreground font-medium text-xs">{item.color}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="font-bold text-lg md:text-xl">{formatPrice(item.product.price)}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-full bg-background">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-secondary/50 rounded-l-full transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-secondary/50 rounded-r-full transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.product.id, item.color, item.size)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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

            {/* Additional Info / Upsell */}
            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                {isFreeShipping ? <ArrowRight className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                {/* Can customize icon based on state if needed */}
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  {isFreeShipping ? '¡Felicidades! Tienes envío gratis' : `Agrega ${formatPrice(amountForFreeShipping)} más para envío gratis`}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isFreeShipping
                    ? 'Tu pedido califica para envío estándar gratuito.'
                    : 'Envío gratis en compras mayores a $800.00 MXN.'}
                </p>
                {!isFreeShipping && (
                  <div className="w-full bg-secondary/50 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              actionLabel="Continuar con el Envío"
              actionHref="/checkout"
              disabled={cartItems.length === 0}
            />

            {/* Coupon input removed - now integrated in OrderSummary */}
          </div>

        </div>
      </div>
    </div>
  );
}
