
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function ConfirmationPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <header className="flex items-center justify-between mb-8">
            <Link href="/payment">
                <ArrowLeft className="h-6 w-6" />
            </Link>
          <h1 className="font-bold text-lg">Glittershop</h1>
          <div className="w-6"></div>
        </header>

        <main className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-yellow-500" />
          </div>

          <h2 className="text-2xl font-bold mb-2">¡Gracias por tu compra!</h2>
          <p className="text-muted-foreground">
            Tu pedido <span className="font-bold text-foreground">#123456789</span> está en camino.
          </p>
          <p className="text-muted-foreground mb-8">
            Fecha de entrega estimada: <span className="font-bold text-foreground">15 de julio</span>
          </p>

          <div className="text-left border-t pt-6">
            <h3 className="font-bold text-lg mb-4">Resumen del pedido</h3>
            
            <div className="space-y-4 mb-6">
              {orderItems.map((item, index) => (
                item.product && (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={item.product.image.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.name === 'Anillo de Oro con Diamantes' ? 'Pendientes de oro' : 'Collar de diamantes'}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                  </div>
                )
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
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
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total pagado</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>
             <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6">
                <Lock className="w-3 h-3"/>
                <span>Pago seguro y protegido</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
             <Button className="w-full h-12 text-lg font-bold" style={{ backgroundColor: '#FDB813', color: 'black' }}>
                Rastrear pedido
            </Button>
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full h-12 bg-amber-100/50 border-amber-200 hover:bg-amber-100">Ver detalles</Button>
                <Button variant="outline" className="w-full h-12 bg-amber-100/50 border-amber-200 hover:bg-amber-100">Compartir</Button>
            </div>
          </div>

          <div className="mt-8 text-sm">
            <p className="text-muted-foreground">
                ¿Necesitas ayuda? <Link href="#" className="font-bold text-yellow-600">Contacta con nosotros</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
