'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Trash2, Lock } from 'lucide-react';
import { products } from '@/lib/products';
import Link from 'next/link';

const cartItems = [
  {
    ...products.find(p => p.id === '1'),
    quantity: 1,
    size: '7',
    material: 'Oro Blanco',
    stock: 2,
  },
  {
    ...products.find(p => p.id === '7'),
    quantity: 1,
    length: '18 pulgadas',
    stock: 1,
  }
];

const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
const savings = -50.00;
const shipping = 0.00;
const total = subtotal + savings + shipping;

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function CartPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4">Carrito</h1>
        
        {/* Progress Stepper */}
        <div className="flex justify-center items-center mb-8">
            <div className="text-center">
                <span className="font-bold" style={{color: '#B87333'}}>Carrito</span>
                <div className="w-2 h-2 rounded-full mx-auto mt-1" style={{backgroundColor: '#B87333'}}></div>
            </div>
            <div className="w-16 h-px bg-gray-300 mx-2"></div>
            <div className="text-center text-gray-400">
                <span>Envío</span>
                <div className="w-2 h-2 rounded-full bg-gray-300 mx-auto mt-1"></div>
            </div>
            <div className="w-16 h-px bg-gray-300 mx-2"></div>
            <div className="text-center text-gray-400">
                <span>Pago</span>
                <div className="w-2 h-2 rounded-full bg-gray-300 mx-auto mt-1"></div>
            </div>
        </div>


        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            item && (
            <div key={item.id} className="bg-card p-4 rounded-lg border">
                <div className="flex items-start gap-4">
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
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-lg">{item.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {item.size && `Talla: ${item.size}, ${item.material}`}
                                    {item.length && `Largo: ${item.length}`}
                                </p>
                                <p className="text-sm font-semibold" style={{color: '#B87333'}}>¡Solo quedan {item.stock} en tu talla!</p>
                            </div>
                            <p className="font-bold text-lg">{formatPrice(item.price || 0)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                           <div className="flex items-center gap-2 border rounded-full px-2 py-1">
                                <button className="text-lg font-medium">-</button>
                                <span className="text-base font-medium w-4 text-center">{item.quantity}</span>
                                <button className="text-lg font-medium">+</button>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="border-t mt-4 pt-3 flex items-center justify-center">
                    <Button variant="ghost" className="text-muted-foreground">
                        <Heart className="w-4 h-4 mr-2" />
                        Mover a la lista de deseos
                    </Button>
                </div>
            </div>
            )
          ))}
        </div>

        {/* Discount Code */}
        <div className="flex gap-2 mb-6">
          <Input placeholder="Añadir código de descuento" className="flex-grow" />
          <Button className="font-bold" style={{ backgroundColor: '#FDB813', color: 'black' }}>Aplicar</Button>
        </div>

        {/* Order Summary */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Envío</span>
            <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
          </div>
           <div className="flex justify-between text-muted-foreground">
            <span>Ahorros</span>
            <span>{formatPrice(savings)}</span>
          </div>
          <div className="border-t my-2"></div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full h-12 text-lg font-bold" style={{ backgroundColor: '#FDB813', color: 'black' }}>
          Continuar con el envío
        </Button>

        {/* Payment Info */}
        <div className="text-center text-muted-foreground text-xs mt-6 space-y-2">
            <p>Métodos de pago aceptados: Visa, Mastercard, Amex, PayPal</p>
            <div className="flex items-center justify-center gap-2">
                <Lock className="w-3 h-3"/>
                <span>Pago Seguro</span>
            </div>
        </div>
      </div>
    </div>
  );
}
