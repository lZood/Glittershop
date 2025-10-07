'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, CreditCard, Camera, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const subtotal = 1150.00;
const shipping = 50.00;
const taxes = 50.00;
const total = subtotal + shipping + taxes;

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

const PaypalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.4 3.9c-2.4 2.1-3.1 5.5-1.8 8.1 1.3 2.6 4.3 4.1 7.1 3.5.4-.1.8-.2 1.1-.4-1.9 2.5-5.6 3.4-8.8 2.1-3.2-1.3-4.8-4.8-3.5-8.1 1.3-3.2 4.8-4.8 8.1-3.5.3.1.5.2.8.3C12.3 3.5 11.2 3.5 10.4 3.9z"/>
        <path d="M5.1 15.3c-1.3 2-1.2 4.6.3 6.4 1.5 1.8 4 2.3 6.1 1.3 2.1-1 3.2-3.1 2.7-5.3-.5-2.2-2.4-3.8-4.6-4-2.2-.2-4.3 1.1-5.5 3z"/>
    </svg>
);


export default function PaymentPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-md">

        {/* Breadcrumbs */}
        <div className="flex items-center justify-center text-sm text-muted-foreground mb-6">
            <Link href="/cart" className="text-primary font-medium">Carrito</Link>
            <span className="mx-2">{'>'}</span>
            <Link href="/shipping" className="text-primary font-medium">Envío</Link>
            <span className="mx-2">{'>'}</span>
            <span className="font-bold text-foreground">Pago</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">Finaliza tu Compra</h1>

        {/* Order Summary Accordion */}
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full mb-8 border rounded-lg">
            <AccordionItem value="item-1">
                <AccordionTrigger className="px-4 py-3 font-medium">
                    <div className='flex justify-between w-full pr-4'>
                        <span>Resumen del pedido</span>
                        <span className="font-bold">{formatPrice(total)}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-2 text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Envío</span>
                            <span>{formatPrice(shipping)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Impuestos</span>
                            <span>{formatPrice(taxes)}</span>
                        </div>
                        <div className="border-t my-2"></div>
                        <div className="flex justify-between font-bold text-foreground">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        <h2 className="text-xl font-bold mb-4">Elige tu método de pago</h2>

        <RadioGroup defaultValue="card" className="space-y-4">
            <Label className="block p-4 border-2 rounded-lg cursor-pointer border-yellow-500 bg-yellow-50/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5"/>
                        <span className="font-semibold">Tarjeta de crédito/débito</span>
                    </div>
                    <RadioGroupItem value="card" id="card" />
                </div>
                <div className="space-y-3">
                    <div className="relative">
                        <Input id="card-number" placeholder="Número de tarjeta" className="bg-background pr-10" />
                        <Camera className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                    </div>
                    <Input id="card-name" placeholder="Nombre en la tarjeta" className="bg-background" />
                    <div className="grid grid-cols-2 gap-3">
                        <Input id="card-expiry" placeholder="MM/YY" className="bg-background" />
                        <Input id="card-cvv" placeholder="CVV" className="bg-background" />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="save-card" />
                        <Label htmlFor="save-card" className="text-sm font-normal text-muted-foreground">Guardar este método de pago</Label>
                    </div>
                </div>
            </Label>

            <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
                <div className="flex items-center gap-2">
                    <PaypalIcon />
                    <span className="font-semibold">PayPal</span>
                </div>
                <RadioGroupItem value="paypal" id="paypal" />
            </Label>

            <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
                <span className="font-semibold">Apple Pay / Google Pay</span>
                <RadioGroupItem value="apple-google" id="apple-google" />
            </Label>
            
            <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
                <span className="font-semibold">Compra ahora, paga después</span>
                <RadioGroupItem value="klarna" id="klarna" />
            </Label>
        </RadioGroup>

        <Button asChild className="w-full h-12 text-lg font-bold mt-8" style={{ backgroundColor: '#FDB813', color: 'black' }}>
          <Link href="/confirmation">Pagar {formatPrice(total)}</Link>
        </Button>
        
        <div className="text-center text-muted-foreground text-xs mt-4 space-y-2">
            <div className="flex items-center justify-center gap-2">
                <Shield className="w-3 h-3"/>
                <span>Pago Seguro | SSL Encrypted</span>
            </div>
            <p>
                ¿Dudas con tu pago?{' '}
                <Link href="#" className="font-bold text-primary hover:underline">
                    Chatea con nosotros
                </Link>
            </p>
        </div>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-4">
             <Link href="#" className="hover:underline">Política de Privacidad</Link>
             <Link href="#" className="hover:underline">Términos de Servicio</Link>
        </div>
      </div>
    </div>
  );
}
