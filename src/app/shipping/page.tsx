
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, CreditCard } from 'lucide-react';
import Link from 'next/link';

const subtotal = 250.00;
const shipping = 0.00;
const total = subtotal + shipping;

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function ShippingPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4">Envío</h1>

        {/* Progress Stepper */}
        <div className="flex justify-center items-center mb-8 relative">
            <div className="flex justify-between items-center w-full max-w-xs">
                <div className="text-center">
                    <span className="font-bold" style={{color: '#B87333'}}>Carrito</span>
                    <div className="w-2 h-2 rounded-full mx-auto mt-1" style={{backgroundColor: '#B87333'}}></div>
                </div>
                <div className="text-center">
                    <span className="font-bold" style={{color: '#FDB813'}}>Envío</span>
                    <div className="w-3 h-3 rounded-full mx-auto mt-1" style={{backgroundColor: '#FDB813'}}></div>
                </div>
                <div className="text-center text-gray-400">
                    <span>Pago</span>
                    <div className="w-2 h-2 rounded-full bg-gray-300 mx-auto mt-1"></div>
                </div>
            </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs h-0.5 bg-gray-300" style={{zIndex: -1}}>
                <div className="h-full bg-yellow-400" style={{width: '50%'}}></div>
            </div>
        </div>
        
        {/* Shipping Information */}
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Información de Envío</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="full-name">Nombre completo</Label>
                    <Input id="full-name" placeholder="Nombre completo" />
                </div>
                <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" placeholder="Calle y número" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input id="city" placeholder="Ciudad" />
                    </div>
                    <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" placeholder="Estado" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="zip-code">Código Postal</Label>
                    <Input id="zip-code" placeholder="Código Postal" />
                </div>
                <div>
                    <Label htmlFor="phone">Teléfono de contacto</Label>
                    <Input id="phone" placeholder="Teléfono de contacto" />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="same-for-billing" defaultChecked />
                    <Label htmlFor="same-for-billing" className="font-normal">Usar la misma dirección para la facturación</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="save-address" />
                    <Label htmlFor="save-address" className="font-normal">Guardar esta dirección para futuras compras</Label>
                </div>
            </div>
        </div>

        {/* Shipping Method */}
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Elige un método de envío</h2>
            <RadioGroup defaultValue="estandar" className="space-y-3">
                <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer border-yellow-500">
                    <div className="flex items-center space-x-3">
                         <RadioGroupItem value="estandar" id="estandar" />
                         <div>
                            <span className="font-semibold">Estándar</span>
                            <p className="text-sm text-muted-foreground">Envío gratuito (3-5 días hábiles)</p>
                         </div>
                    </div>
                </Label>
                 <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="expres" id="expres" />
                         <div>
                            <span className="font-semibold">Exprés</span>
                            <p className="text-sm text-muted-foreground">Envío $15 (1-2 días hábiles)</p>
                         </div>
                    </div>
                </Label>
                 <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="tienda" id="tienda" />
                         <div>
                            <span className="font-semibold">Recoger en tienda</span>
                            <p className="text-sm text-muted-foreground">Recogida gratuita (disponible hoy)</p>
                         </div>
                    </div>
                </Label>
            </RadioGroup>
        </div>

        {/* Order Summary */}
        <div className="bg-amber-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Envío Seguro</span>
            </div>
            <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                <span>Pago Protegido</span>
            </div>
        </div>

        <Button className="w-full h-12 text-lg font-bold" style={{ backgroundColor: '#FDB813', color: 'black' }}>
          Continuar al Pago
        </Button>
        
        <div className="text-center mt-4 space-y-2">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
                ¿Necesitas ayuda? Chatea con nosotros
            </Link>
            <p>
                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Política de Devoluciones
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
