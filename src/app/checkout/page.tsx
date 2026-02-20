'use client';

import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useSession } from '@/lib/supabase/session-provider';
import { CheckoutAuthGate } from '@/components/checkout/checkout-auth-gate';
import { CheckoutStepper } from '@/components/checkout/checkout-stepper';
import { AddressForm } from '@/components/checkout/address-form';
import { AddressList } from '@/components/checkout/address-list';
import { getUserAddresses, Address } from '@/lib/actions/address';

type CheckoutStep = 'cart' | 'shipping' | 'payment';

export default function CheckoutPage() {
    const { items, subtotal, cartCount } = useCart();
    const { session } = useSession();
    const [guestEmail, setGuestEmail] = useState('');

    // Step State
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');

    // Shipping State
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);

    // Initial Data Fetch
    useEffect(() => {
        if (session?.user) {
            getUserAddresses().then(addresses => {
                setSavedAddresses(addresses);
                const defaultAddr = addresses.find(a => a.is_default);
                if (defaultAddr) setSelectedAddress(defaultAddr);
            });
        }
    }, [session, currentStep]); // Refetch when entering steps/session changes

    // Shipping Cost Logic
    const freeShippingThreshold = 800;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shippingCost = isFreeShipping ? 0 : 150; // Standard fixed for now until dynamic
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

    // Auth Gate: Check if user is logged in OR has provided guest email
    if (!session && !guestEmail) {
        return <CheckoutAuthGate onContinueAsGuest={setGuestEmail} />;
    }

    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header Nav */}
                {currentStep === 'cart' ? (
                    <Link href="/cart" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Volver al carrito
                    </Link>
                ) : (
                    <button onClick={() => setCurrentStep('cart')} className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Volver al paso anterior
                    </button>
                )}

                <CheckoutStepper currentStep={currentStep} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* STEP 1: CART REVIEW */}
                        {currentStep === 'cart' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                                <h2 className="text-2xl font-bold">Revisa tu Pedido</h2>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex gap-4 p-4 border rounded-xl bg-card">
                                            <div className="relative h-20 w-20 rounded-md overflow-hidden bg-white border shrink-0">
                                                {item.product.image ? (
                                                    <Image
                                                        src={item.product.image.imageUrl}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="bg-gray-200 w-full h-full" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold truncate">{item.product.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.color} {item.size && `• ${item.size}`}
                                                </p>
                                                <p className="text-sm">Cant: {item.quantity}</p>
                                            </div>
                                            <div className="text-right font-bold">
                                                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.product.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button size="lg" className="w-full text-lg h-12" onClick={() => setCurrentStep('shipping')}>
                                    Continuar a Envío
                                </Button>
                            </div>
                        )}

                        {/* STEP 2: SHIPPING */}
                        {currentStep === 'shipping' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-2xl font-bold">Dirección de Envío</h2>

                                {/* Guest Form (Always manual if guest) */}
                                {!session && (
                                    <div className="p-6 border rounded-xl bg-card">
                                        <h3 className="font-semibold mb-4 text-base md:text-lg">Ingresa tu dirección de envío</h3>
                                        <AddressForm
                                            onSuccess={() => { }} // Not used when customSubmit is present
                                            onCancel={() => { }} // No cancel for guest, main view
                                            onSubmit={async (data) => {
                                                // Create a temporary address object for the guest
                                                const guestAddressWithId: Address = {
                                                    id: 'guest-temp-id',
                                                    user_id: 'guest',
                                                    ...data,
                                                    address_line2: data.address_line2 || null, // Ensure explicit null if undefined
                                                };
                                                setSelectedAddress(guestAddressWithId);
                                                setCurrentStep('payment');
                                            }}
                                        />
                                    </div>
                                )}

                                {/* User Logged In Logic */}
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
                                                        // Refresh list
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
                                                    disabled={!selectedAddress}
                                                    onClick={() => setCurrentStep('payment')}
                                                >
                                                    Continuar a Pago
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* STEP 3: PAYMENT */}
                        {currentStep === 'payment' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-2xl font-bold">Pago</h2>
                                <div className="p-8 border rounded-xl bg-secondary/10 text-center space-y-4">
                                    <p className="text-muted-foreground">
                                        Has llegado al final del flujo de demostración.
                                    </p>
                                    <p className="font-semibold">
                                        Enviar a: <br />
                                        {session ? selectedAddress?.full_name : 'Invitado'} <br />
                                        {session ? selectedAddress?.address_line1 : '...'}
                                    </p>
                                    <Button size="lg" className="w-full md:w-auto mt-4">
                                        Procesar Pago (Simulado)
                                    </Button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="lg:col-span-5 h-fit sticky top-24">
                        <div className="bg-secondary/10 border rounded-xl p-6 lg:p-8">
                            <h2 className="text-xl font-bold mb-6">Resumen</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal ({cartCount} productos)</span>
                                    <span>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Envío</span>
                                    <span className={isFreeShipping ? "text-primary font-medium" : ""}>
                                        {isFreeShipping ? 'Gratis' : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(shippingCost)}
                                    </span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(total)}</span>
                            </div>

                            {/* Visual cues for step progress in Summary if desired */}
                            <div className="mt-8 text-xs text-muted-foreground text-center">
                                {currentStep === 'cart' && "Siguiente: Envío"}
                                {currentStep === 'shipping' && "Siguiente: Pago"}
                                {currentStep === 'payment' && "Listo para finalizar"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
