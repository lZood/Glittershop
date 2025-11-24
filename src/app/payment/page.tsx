'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, CreditCard, Lock, Smartphone, Wallet } from 'lucide-react';
import Link from 'next/link';
import { CheckoutStepper } from '@/components/checkout/checkout-stepper';
import { OrderSummary } from '@/components/checkout/order-summary';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState('card');

    const subtotal = 1150.00;
    const shipping = 50.00;
    const taxes = 50.00;
    const total = subtotal + shipping + taxes;

    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8 md:py-12">

                {/* Stepper */}
                <CheckoutStepper currentStep="payment" />

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 max-w-7xl mx-auto">

                    {/* Left Column: Payment Methods */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">Método de Pago</h1>

                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">

                                {/* Credit Card */}
                                <Label
                                    className={cn(
                                        "block p-6 border rounded-xl cursor-pointer transition-all duration-300",
                                        paymentMethod === 'card'
                                            ? "border-primary bg-secondary/20 ring-1 ring-primary shadow-md"
                                            : "bg-card/50 hover:border-primary/50 hover:bg-secondary/10"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="card" id="card" />
                                            <div className="p-2 bg-background rounded-full border">
                                                <CreditCard className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="font-bold text-lg">Tarjeta de Crédito / Débito</span>
                                        </div>
                                        <div className="flex gap-1 opacity-70">
                                            {/* Icons placeholder */}
                                            <div className="w-8 h-5 bg-foreground/20 rounded"></div>
                                            <div className="w-8 h-5 bg-foreground/20 rounded"></div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {paymentMethod === 'card' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-4 pt-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="cardNumber">Número de tarjeta</Label>
                                                        <div className="relative">
                                                            <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="pl-10 bg-background" />
                                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="cardName">Nombre del titular</Label>
                                                        <Input id="cardName" placeholder="Como aparece en la tarjeta" className="bg-background" />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="expiry">Vencimiento</Label>
                                                            <Input id="expiry" placeholder="MM/AA" className="bg-background" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="cvc">CVC</Label>
                                                            <div className="relative">
                                                                <Input id="cvc" placeholder="123" className="pl-10 bg-background" />
                                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Label>

                                {/* PayPal */}
                                <Label
                                    className={cn(
                                        "flex items-center justify-between p-6 border rounded-xl cursor-pointer transition-all duration-300",
                                        paymentMethod === 'paypal'
                                            ? "border-primary bg-secondary/20 ring-1 ring-primary shadow-md"
                                            : "bg-card/50 hover:border-primary/50 hover:bg-secondary/10"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="paypal" id="paypal" />
                                        <div className="p-2 bg-background rounded-full border">
                                            <Wallet className="w-5 h-5 text-[#003087]" />
                                        </div>
                                        <span className="font-bold text-lg">PayPal</span>
                                    </div>
                                </Label>

                                {/* Apple Pay / Google Pay */}
                                <Label
                                    className={cn(
                                        "flex items-center justify-between p-6 border rounded-xl cursor-pointer transition-all duration-300",
                                        paymentMethod === 'digital'
                                            ? "border-primary bg-secondary/20 ring-1 ring-primary shadow-md"
                                            : "bg-card/50 hover:border-primary/50 hover:bg-secondary/10"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="digital" id="digital" />
                                        <div className="p-2 bg-background rounded-full border">
                                            <Smartphone className="w-5 h-5 text-foreground" />
                                        </div>
                                        <span className="font-bold text-lg">Apple Pay / Google Pay</span>
                                    </div>
                                </Label>

                            </RadioGroup>
                        </motion.div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-5">
                        <OrderSummary
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                            actionLabel={`Pagar ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}`}
                            actionHref="/confirmation"
                        />

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 dark:text-green-400">
                                <Shield className="w-5 h-5 flex-shrink-0" />
                                <p className="text-xs font-medium">
                                    Pago procesado de forma segura. No almacenamos tus datos financieros.
                                </p>
                            </div>

                            <div className="text-center text-xs text-muted-foreground">
                                <p>Al confirmar el pedido, aceptas nuestros <Link href="#" className="underline hover:text-primary">Términos y Condiciones</Link>.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
