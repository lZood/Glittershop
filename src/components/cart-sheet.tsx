'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartSheet() {
    const { items, removeItem, updateQuantity, cartCount, subtotal, isCartOpen, setIsCartOpen } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(price);
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent className="w-full sm:w-[480px] flex flex-col p-0 bg-background/95 backdrop-blur-3xl border-l-0 shadow-2xl">
                <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                    <SheetTitle className="text-lg font-headline font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Tu Carrito
                        <span className="text-sm font-normal text-muted-foreground ml-2">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">Tu carrito está vacío</h3>
                            <p className="text-muted-foreground max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                            <SheetClose asChild>
                                <Button className="mt-8 rounded-full px-8" asChild>
                                    <Link href="/shop">Explorar Colección</Link>
                                </Button>
                            </SheetClose>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex gap-4 group">
                                    <div className="relative w-24 h-32 flex-shrink-0 bg-secondary/20 rounded-md overflow-hidden border border-border/50">
                                        <Image
                                            src={item.product.image?.imageUrl || '/placeholder.png'}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold line-clamp-2 pr-4">{item.product.name}</h4>
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.color, item.size)}
                                                    className="text-muted-foreground hover:text-red-500 transition-colors p-1 -mr-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1 space-x-2">
                                                {item.size && <span>Talla: {item.size}</span>}
                                                {item.size && item.color && <span>•</span>}
                                                {item.color && (
                                                    <span className="flex items-center gap-1 inline-flex">
                                                        Color:
                                                        <span className="w-2 h-2 rounded-full border border-border" style={{ backgroundColor: item.product.variants?.find(v => v.color === item.color)?.color_metadata?.hex || '#ccc' }} />
                                                        {item.color}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-border rounded-full h-8 px-2 bg-background shadow-sm">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity > 1) {
                                                            updateQuantity(item.product.id, item.color, item.size, item.quantity - 1);
                                                        } else {
                                                            removeItem(item.product.id, item.color, item.size);
                                                        }
                                                    }}
                                                    className="p-1 hover:text-primary transition-colors text-muted-foreground"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity + 1)}
                                                    className="p-1 hover:text-primary transition-colors text-muted-foreground"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="font-bold text-base">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t bg-background/50 backdrop-blur-md p-6 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Envío</span>
                                <span>Calculado en el checkout</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl pt-2 border-t">
                                <span>Total</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                        </div>
                        <SheetClose asChild>
                            <Button className="w-full rounded-full h-14 text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" asChild>
                                <Link href="/checkout" className="flex items-center justify-center gap-2">
                                    Proceder al Pago <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </Button>
                        </SheetClose>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
