'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Shield, Lock, Ticket, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

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
    disabled = false,
    showCouponInput = true
}: OrderSummaryProps & { showCouponInput?: boolean }) {
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: string, type: string } | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);

    const [finalTotal, setFinalTotal] = useState(total);

    useEffect(() => {
        let newTotal = total;
        if (appliedCoupon) {
            if (appliedCoupon.type === 'percentage') {
                const discountValue = parseFloat(appliedCoupon.discount) / 100;
                newTotal = total - (total * discountValue);
            } else if (appliedCoupon.type === 'amount') {
                const discountValue = parseFloat(appliedCoupon.discount.replace(/[^0-9.]/g, ''));
                newTotal = Math.max(0, total - discountValue);
            }
        }
        setFinalTotal(newTotal);
    }, [total, appliedCoupon]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponLoading(true);
        setCouponError(null);

        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ couponCode })
            });
            const data = await res.json();

            if (data.valid) {
                setAppliedCoupon(data.coupon);
                setCouponCode('');
            } else {
                setCouponError(data.message || 'Cupón inválido');
            }
        } catch (err) {
            setCouponError('Error al conectar con el servidor');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponError(null);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
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

                {appliedCoupon && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex justify-between items-center py-2 px-3 bg-primary/5 rounded-lg border border-primary/20"
                    >
                        <div className="flex items-center gap-2">
                            <Ticket className="w-3.5 h-3.5 text-primary" />
                            <div>
                                <span className="text-xs font-black uppercase text-primary block leading-none">{appliedCoupon.code}</span>
                                <span className="text-[10px] text-muted-foreground">Descuento aplicado</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary">-{appliedCoupon.type === 'percentage' ? appliedCoupon.discount : appliedCoupon.discount}</span>
                            <button onClick={removeCoupon} className="p-1 hover:bg-primary/10 rounded-full transition-colors">
                                <X className="w-3 h-3 text-primary" />
                            </button>
                        </div>
                    </motion.div>
                )}

                <Separator className="my-4" />

                <div className="flex justify-between items-end">
                    <span className="text-base font-bold">Total</span>
                    <div className="text-right">
                        <span className="text-2xl font-black text-primary block leading-none">
                            {formatPrice(finalTotal)}
                        </span>
                        <span className="text-xs text-muted-foreground">Impuestos incluidos</span>
                    </div>
                </div>
            </div>

            {showCouponInput && !appliedCoupon && (
                <div className="mt-6 pt-6 border-t border-dashed">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Input
                                placeholder="Código de cupón"
                                className="h-10 text-xs font-bold uppercase tracking-widest pl-10 bg-background"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            />
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-10 px-4 font-black text-[10px] uppercase tracking-wider transition-all"
                            disabled={!couponCode || couponLoading}
                            onClick={handleApplyCoupon}
                        >
                            {couponLoading ? '...' : 'Aplicar'}
                        </Button>
                    </div>
                    {couponError && (
                        <p className="text-[10px] text-destructive mt-2 flex items-center gap-1 font-bold animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-3 h-3" /> {couponError}
                        </p>
                    )}
                </div>
            )}

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
