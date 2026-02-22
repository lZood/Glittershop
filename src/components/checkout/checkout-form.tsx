'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { processSuccessfulOrder } from '@/lib/actions/checkout';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
    paymentIntentId: string;
    guestEmail?: string;
    shippingAddress: any;
}

export function CheckoutForm({ paymentIntentId, guestEmail, shippingAddress }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { items, clearCart } = useCart();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        // Confirm the payment with Stripe Elements
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL isn't strictly necessary if redirect is 'if_required', we test locally here
                return_url: `${window.location.origin}/payment/success`,
            },
            redirect: 'if_required', // Avoids automatic redirection to wait for our DB saving
        });

        if (error) {
            setErrorMessage(error.message || 'Ha ocurrido un error inesperado al procesar el pago.');
            setIsProcessing(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                // Call server action to securely deduct stock & insert order
                const result = await processSuccessfulOrder(
                    paymentIntent.id,
                    items,
                    shippingAddress,
                    guestEmail
                );

                if (result.success) {
                    // Redirect to success page directly; cart will be cleared on the success page
                    router.push(`/checkout/success?order_id=${result.orderId}`);
                }
            } catch (err: any) {
                setErrorMessage(err.message || 'Error guardando orden en la base de datos.');
            }
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card border rounded-xl p-4 md:p-6 shadow-sm">
                <PaymentElement />
            </div>

            {errorMessage && (
                <div className="text-destructive text-sm font-medium p-3 bg-destructive/10 rounded-md border border-destructive/20">
                    {errorMessage}
                </div>
            )}

            <Button
                type="submit"
                size="lg"
                disabled={!stripe || isProcessing}
                className="w-full text-lg h-12"
            >
                {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Pago y transacciones procesadas de forma segura por Stripe.</span>
            </div>
        </form>
    );
}
