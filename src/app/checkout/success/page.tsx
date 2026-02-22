'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { useCart } from '@/lib/cart-context';

function SuccessScreen() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const { clearCart } = useCart();

    // Scroll to top on mount and clear cart
    useEffect(() => {
        window.scrollTo(0, 0);
        clearCart();
    }, [clearCart]);

    return (
        <div className="bg-background min-h-[80vh] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full text-center space-y-8"
            >
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </motion.div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">¡Pago Exitoso!</h1>
                    <p className="text-muted-foreground text-lg">
                        Tu pedido ha sido procesado correctamente.
                    </p>
                </div>

                {orderId && (
                    <div className="bg-secondary/20 border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                            <Package className="w-5 h-5" />
                            <span className="font-medium text-sm uppercase tracking-wider">Número de Orden</span>
                        </div>
                        <p className="text-2xl font-mono font-bold tracking-widest text-primary">{orderId}</p>
                    </div>
                )}

                <p className="text-sm text-muted-foreground">
                    Hemos enviado un correo con los detalles de tu compra.
                    Podrás ver el estado del envío en tu cuenta pronto.
                </p>

                <div className="pt-6 space-y-3 flex flex-col items-center">
                    <Button asChild size="lg" className="w-full h-14 text-lg rounded-xl group relative overflow-hidden">
                        <Link href="/shop">
                            <span className="relative z-10 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Seguir Comprando
                            </span>
                            <div className="absolute inset-0 h-full w-full bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full h-12 rounded-xl group">
                        <Link href="/profile" className="flex items-center justify-center gap-2">
                            Ver mis pedidos
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Cargando...</div>}>
            <SuccessScreen />
        </Suspense>
    );
}
