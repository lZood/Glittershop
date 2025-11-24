'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Shield, Lock } from 'lucide-react';
import Link from 'next/link';

interface OrderSummaryProps {
    subtotal: number;
    shipping?: number;
    total: number;
    actionLabel?: string;
    onAction?: () => void;
    actionHref?: string;
    isSticky?: boolean;
    className?: string;
    disabled?: boolean;
}

export function OrderSummary({
    subtotal,
    shipping = 0,
    total,
    actionLabel = 'Continuar',
    onAction,
    actionHref,
    isSticky = true,
    className,
    disabled = false
}: OrderSummaryProps) {

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className={cn(
            "bg-card/50 backdrop-blur-sm border rounded-xl p-6 shadow-sm",
            isSticky && "lg:sticky lg:top-24",
            className
        )}>
            <h2 className="text-xl font-bold mb-6 uppercase tracking-tight">Resumen del Pedido</h2>

            <div className="space-y-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span className="font-medium text-foreground">
                        {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                    </span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-end">
                    <span className="text-base font-bold">Total</span>
                    <div className="text-right">
                        <span className="text-2xl font-black text-primary block leading-none">
                            {formatPrice(total)}
                        </span>
                        <span className="text-xs text-muted-foreground">Impuestos incluidos</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-4">
                {actionHref ? (
                    <Button
                        asChild
                        className="w-full h-12 text-base font-bold uppercase tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                        disabled={disabled}
                    >
                        <Link href={actionHref}>{actionLabel}</Link>
                    </Button>
                ) : (
                    <Button
                        onClick={onAction}
                        className="w-full h-12 text-base font-bold uppercase tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                        disabled={disabled}
                    >
                        {actionLabel}
                    </Button>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Pago 100% Seguro y Encriptado</span>
                </div>

                <div className="flex justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                    {/* Simple visual representation of cards - in a real app use SVGs */}
                    <div className="w-8 h-5 bg-foreground/10 rounded"></div>
                    <div className="w-8 h-5 bg-foreground/10 rounded"></div>
                    <div className="w-8 h-5 bg-foreground/10 rounded"></div>
                </div>
            </div>
        </div>
    );
}
