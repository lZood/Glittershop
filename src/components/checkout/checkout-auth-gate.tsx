'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { User, Mail, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CheckoutAuthGateProps {
    onContinueAsGuest: (email: string) => void;
}

export function CheckoutAuthGate({ onContinueAsGuest }: CheckoutAuthGateProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [checkingStorage, setCheckingStorage] = useState(true);

    useEffect(() => {
        // Check for previously saved guest email
        const savedEmail = localStorage.getItem('guest_checkout_email');
        if (savedEmail) {
            onContinueAsGuest(savedEmail);
        }
        setCheckingStorage(false);
    }, [onContinueAsGuest]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Por favor ingresa un email válido');
            return;
        }

        // Save for future friction-less checkout
        localStorage.setItem('guest_checkout_email', email);
        onContinueAsGuest(email);
    };

    // Prepare UI to avoid flash if we are about to redirect
    if (checkingStorage) return null;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Identifícate</h1>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">

                    {/* Option 1: Login (Primary/Highlighted) */}
                    <div className="order-1 md:order-1 bg-gradient-to-br from-primary/10 to-transparent p-5 md:p-6 rounded-xl border border-primary/20 shadow-lg space-y-5 flex flex-col justify-center relative overflow-hidden">
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="space-y-3 relative">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-2 shadow-md">
                                <User className="w-5 h-5" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold">Con Cuenta</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Accede a tus direcciones guardadas y acumula <span className="font-bold text-primary">Puntos Glitter</span> con cada compra.
                                </p>
                            </div>

                            <ul className="space-y-1.5 text-sm text-foreground/80">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Checkout más rápido
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Historial de pedidos
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Ofertas exclusivas por email
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3 pt-2 relative">
                            <Button className="w-full text-base h-11 shadow-md hover:shadow-lg transition-all" size="lg" asChild>
                                <Link href={`/login?redirect=/checkout`}>
                                    Iniciar Sesión
                                </Link>
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                ¿No tienes cuenta? <Link href="/register" className="underline hover:text-primary font-medium">Créala en segundos aquí</Link>
                            </p>
                        </div>
                    </div>

                    {/* Divider for Mobile */}
                    <div className="relative md:hidden order-2">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">O</span>
                        </div>
                    </div>

                    {/* Option 2: Guest (Secondary) */}
                    <div className="order-3 md:order-2 bg-card p-6 md:p-8 rounded-xl border shadow-sm space-y-6 flex flex-col">
                        <div className="space-y-2">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Invitado</h2>
                            <p className="text-muted-foreground">
                                ¿No quieres registrarte? No hay problema. Solo necesitamos tu email para el comprobante.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-end">
                            <div className="space-y-2">
                                <Label htmlFor="guest-email">Correo Electrónico</Label>
                                <Input
                                    id="guest-email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    className={error ? 'border-destructive' : ''}
                                />
                                {error && <p className="text-xs text-destructive">{error}</p>}
                            </div>
                            <Button type="submit" variant="outline" className="w-full group h-12 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50" size="lg">
                                Continuar como Invitado
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
