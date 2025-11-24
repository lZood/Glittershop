'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { Check, Package, Calendar, ArrowRight, ShoppingBag, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { CheckoutStepper } from '@/components/checkout/checkout-stepper';

const orderItems = [
  {
    product: products.find(p => p.id === '5'), // Collar de Gota
    quantity: 1,
    price: 250,
  },
  {
    product: products.find(p => p.id === '2'), // Anillo de Oro con Diamantes
    quantity: 2,
    price: 250,
  },
];

const subtotal = 500.00;
const shipping = 10.00;
const taxes = 50.00;
const total = 560.00;

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);
}

export default function ConfirmationPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 max-w-3xl">

        {/* Stepper */}
        <div className="mb-12">
          <CheckoutStepper currentStep="confirmation" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6 mb-12"
        >
          <div className="relative inline-flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-green-500 rounded-full -z-10"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight font-headline">¡Gracias por tu compra!</h1>
            <p className="text-muted-foreground text-lg">
              Tu pedido <span className="font-bold text-foreground">#123456789</span> ha sido confirmado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-xl backdrop-blur-sm inline-flex mx-auto">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span>Enviado por: <strong>DHL Express</strong></span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Entrega estimada: <strong>15 de Julio</strong></span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="bg-background/60 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8 border-b border-border/50">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Resumen del Pedido
            </h2>

            <div className="space-y-6">
              {orderItems.map((item, index) => (
                item.product && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="flex items-center gap-4"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary border border-border/50 shadow-sm group">
                      <Image
                        src={item.product.image.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-lg">{formatPrice(item.price)}</p>
                  </motion.div>
                )
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-secondary/20 space-y-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Envío</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Impuestos</span>
              <span>{formatPrice(taxes)}</span>
            </div>
            <div className="border-t border-border/50 my-2"></div>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-lg">Total Pagado</span>
              <span className="font-bold text-2xl text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button className="h-14 px-8 rounded-full text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all" asChild>
            <Link href="/shop">
              Seguir Comprando <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" className="h-14 px-8 rounded-full text-lg font-medium border-2 hover:bg-secondary transition-all">
            <Download className="mr-2 w-5 h-5" /> Descargar Recibo
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
