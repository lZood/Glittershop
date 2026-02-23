'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { useSession } from '@/lib/supabase/session-provider';
import { CheckoutAuthGate } from '@/components/checkout/checkout-auth-gate';
import { CheckoutStepper } from '@/components/checkout/checkout-stepper';
import { AddressForm } from '@/components/checkout/address-form';
import { AddressList } from '@/components/checkout/address-list';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { getUserAddresses, Address } from '@/lib/actions/address';
import { createPaymentIntent } from '@/lib/actions/checkout';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CheckoutStep = 'shipping' | 'payment';

export default function CheckoutPage() {
    const { items, subtotal, cartCount } = useCart();
    const { session } = useSession();
    const { toast } = useToast();
    const [guestEmail, setGuestEmail] = useState('');

    const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    useEffect(() => {
        if (!session?.user) return;

        getUserAddresses().then((addresses) => {
            setSavedAddresses(addresses);
            const defaultAddr = addresses.find((a) => a.is_default);
            if (defaultAddr) setSelectedAddress(defaultAddr);
        });
    }, [session]);

    const freeShippingThreshold = 800;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shippingCost = isFreeShipping ? 0 : 150;
    const total = subtotal + shippingCost;

    if (cartCount === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
                <p className="text-muted-foreground mb-8">Parece que aún no has añadido nada.</p>
                <Button asChild size="lg">
                    <Link href="/shop">Ir a la tienda</Link>
                </Button>
            </div>
        );
    }

    if (!session && !guestEmail) {
        return <CheckoutAuthGate onContinueAsGuest={setGuestEmail} />;
    }

    const startPayment = async () => {
        if (!selectedAddress) {
            toast({
                title: 'Error',
                description: 'Por favor selecciona o ingresa una dirección de envío',
                variant: 'destructive',
            });
            return;
        }

        setIsLoadingPayment(true);
        try {
            const res = await createPaymentIntent(items, guestEmail);
            if (res.clientSecret) {
                setClientSecret(res.clientSecret);
                setPaymentIntentId(res.paymentIntentId);
                setCurrentStep('payment');
            }
        } catch (e: any) {
            toast({
                title: 'Error',
                description: e.message || 'Error inicializando el pago',
                variant: 'destructive',
            });
        } finally {
            setIsLoadingPayment(false);
        }
    };

    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8">
                {currentStep === 'shipping' ? (
                    <Link href="/cart" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Volver al carrito
                    </Link>
                ) : (
                    <button onClick={() => setCurrentStep('shipping')} className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Volver al paso anterior
                    </button>
                )}

                <CheckoutStepper currentStep={currentStep} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                    <div className="lg:col-span-7 space-y-8">
                        {currentStep === 'shipping' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-2xl font-bold">Dirección de Envío</h2>

                                {!session && (
                                    <div className="p-6 border rounded-xl bg-card">
                                        <h3 className="font-semibold mb-4 text-base md:text-lg">Ingresa tu dirección de envío</h3>
                                        <AddressForm
                                            onSuccess={() => {}}
                                            onCancel={() => {}}
                                            onSubmit={async (data) => {
                                                const guestAddressWithId: Address = {
                                                    id: 'guest-temp-id',
                                                    user_id: 'guest',
                                                    ...data,
                                                    interior_number: data.interior_number || undefined,
                                                };
                                                setSelectedAddress(guestAddressWithId);
                                                setTimeout(() => startPayment(), 0);
                                            }}
                                        />
                                    </div>
                                )}

                                {session && (
                                    <>
                                        {isAddingAddress || editingAddress ? (
                                            <div className="p-6 border rounded-xl bg-card">
                                                <h3 className="font-semibold mb-4">{editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
                                                <AddressForm
                                                    existingAddress={editingAddress}
                                                    onSuccess={() => {
                                                        setIsAddingAddress(false);
                                                        setEditingAddress(undefined);
                                                        getUserAddresses().then(setSavedAddresses);
                                                    }}
                                                    onCancel={() => {
                                                        setIsAddingAddress(false);
                                                        setEditingAddress(undefined);
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <AddressList
                                                    addresses={savedAddresses}
                                                    selectedAddressId={selectedAddress?.id}
                                                    onSelect={setSelectedAddress}
                                                    onAdd={() => setIsAddingAddress(true)}
                                                    onEdit={(addr) => setEditingAddress(addr)}
                                                />
                                                <Button
                                                    size="lg"
                                                    className="w-full text-lg h-12 mt-6"
                                                    disabled={!selectedAddress || isLoadingPayment}
                                                    onClick={startPayment}
                                                >
                                                    {isLoadingPayment ? 'Cargando...' : 'Continuar a Pago'}
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {currentStep === 'payment' && clientSecret && paymentIntentId && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-2xl font-bold">Pago</h2>
                                <div className="mb-6 p-4 border rounded-xl bg-secondary/10">
                                    <p className="font-semibold">Resumen de Envío:</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedAddress?.full_name} <br />
                                        {selectedAddress?.street} {selectedAddress?.exterior_number}{' '}
                                        {selectedAddress?.interior_number && `Int ${selectedAddress.interior_number}`},{' '}
                                        {selectedAddress?.neighborhood} <br />
                                        {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.postal_code}
                                    </p>
                                </div>

                                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                    <CheckoutForm paymentIntentId={paymentIntentId} guestEmail={guestEmail} shippingAddress={selectedAddress} />
                                </Elements>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5">
                        <OrderSummary
                            subtotal={subtotal}
                            shipping={shippingCost}
                            total={total}
                            actionLabel={currentStep === 'shipping' ? 'Continuar a Pago' : undefined}
                            onAction={currentStep === 'shipping' ? startPayment : undefined}
                            disabled={isLoadingPayment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
