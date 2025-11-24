'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, MapPin, Truck, Store } from 'lucide-react';
import Link from 'next/link';
import { CheckoutStepper } from '@/components/checkout/checkout-stepper';
import { OrderSummary } from '@/components/checkout/order-summary';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ShippingPage() {
    const [shippingMethod, setShippingMethod] = useState('estandar');

    const subtotal = 250.00;
    const shippingCost = shippingMethod === 'expres' ? 15.00 : 0.00;
    const total = subtotal + shippingCost;

    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8 md:py-12">

                {/* Stepper */}
                <CheckoutStepper currentStep="shipping" />

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 max-w-7xl mx-auto">

                    {/* Left Column: Shipping Form */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">Información de Envío</h1>

                            <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Nombre</Label>
                                        <Input id="firstName" placeholder="Tu nombre" className="bg-background" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Apellidos</Label>
                                        <Input id="lastName" placeholder="Tus apellidos" className="bg-background" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input id="address" placeholder="Calle, número, piso..." className="pl-10 bg-background" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ciudad</Label>
                                        <Input id="city" placeholder="Ciudad" className="bg-background" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">Código Postal</Label>
                                        <Input id="zip" placeholder="00000" className="bg-background" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input id="phone" placeholder="+52 123 456 7890" className="bg-background" />
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox id="save-info" />
                                    <Label htmlFor="save-info" className="text-sm font-normal text-muted-foreground cursor-pointer">
                                        Guardar esta información para la próxima vez
                                    </Label>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-4">Método de Envío</h2>

                            <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="grid gap-4">
                                <Label
                                    className={cn(
                                        "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-secondary/10",
                                        shippingMethod === 'estandar' ? "border-primary bg-secondary/20 ring-1 ring-primary" : "bg-card/50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <RadioGroupItem value="estandar" id="estandar" />
                                        <div className="p-2 bg-background rounded-full border">
                                            <Truck className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <span className="font-bold block">Envío Estándar</span>
                                            <span className="text-sm text-muted-foreground">3-5 días hábiles</span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-green-600">Gratis</span>
                                </Label>

                                <Label
                                    className={cn(
                                        "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-secondary/10",
                                        shippingMethod === 'expres' ? "border-primary bg-secondary/20 ring-1 ring-primary" : "bg-card/50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <RadioGroupItem value="expres" id="expres" />
                                        <div className="p-2 bg-background rounded-full border">
                                            <Truck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <span className="font-bold block">Envío Exprés</span>
                                            <span className="text-sm text-muted-foreground">1-2 días hábiles</span>
                                        </div>
                                    </div>
                                    <span className="font-bold">$15.00</span>
                                </Label>

                                <Label
                                    className={cn(
                                        "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-secondary/10",
                                        shippingMethod === 'tienda' ? "border-primary bg-secondary/20 ring-1 ring-primary" : "bg-card/50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <RadioGroupItem value="tienda" id="tienda" />
                                        <div className="p-2 bg-background rounded-full border">
                                            <Store className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <span className="font-bold block">Recoger en Tienda</span>
                                            <span className="text-sm text-muted-foreground">Disponible hoy mismo</span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-green-600">Gratis</span>
                                </Label>
                            </RadioGroup>
                        </motion.div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-5">
                        <OrderSummary
                            subtotal={subtotal}
                            shipping={shippingCost}
                            total={total}
                            actionLabel="Continuar al Pago"
                            actionHref="/payment"
                        />

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Shield className="w-4 h-4" />
                            <span>Tus datos están protegidos con encriptación SSL de 256 bits.</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
