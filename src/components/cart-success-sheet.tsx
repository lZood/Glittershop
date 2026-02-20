'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { Check, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCarousel } from '@/components/product-carousel';
import { products } from '@/lib/products';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';

export function CartSuccessSheet() {
    const { isSuccessSheetOpen, setIsSuccessSheetOpen, lastAddedItem, setIsCartOpen, cartCount } = useCart();
    const [recommendations, setRecommendations] = useState<Product[]>([]);

    useEffect(() => {
        // Fetch 3 random products for recommendations
        // In a real app, this would be smarter (related to lastAddedItem)
        const randomProducts = [...products]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        setRecommendations(randomProducts);
    }, [lastAddedItem]); // Refresh when item changes

    const handleViewCart = () => {
        setIsSuccessSheetOpen(false);
        setIsCartOpen(true);
    };

    if (!lastAddedItem) return null;

    return (
        <Sheet open={isSuccessSheetOpen} onOpenChange={setIsSuccessSheetOpen}>
            <SheetContent className="w-full sm:w-[480px] p-0 bg-[#1c1917] text-white border-none flex flex-col h-full shadow-2xl">
                <div className="flex-1 overflow-y-auto">
                    {/* Header: Added Item */}
                    <div className="p-8 pb-4">
                        <SheetHeader>
                            {/* Close button is built-in to the SheetContent via Shadcn, usually strict top-right. 
                                 We'll let default handle exist or customized if needed. 
                                 For now, standard X is fine.
                              */}
                        </SheetHeader>

                        <div className="flex items-start gap-6 pt-4">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shrink-0 bg-white">
                                {lastAddedItem.product.image ? (
                                    <Image
                                        src={lastAddedItem.product.image.imageUrl}
                                        alt={lastAddedItem.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200" />
                                )}
                            </div>
                            <div className="space-y-1 pt-2">
                                <h3 className="text-lg font-bold leading-tight">{lastAddedItem.product.name}</h3>
                                {(lastAddedItem.size || lastAddedItem.color) && (
                                    <p className="text-sm text-white/60">
                                        {lastAddedItem.size && `Talla ${lastAddedItem.size}`}
                                        {lastAddedItem.size && lastAddedItem.color && ' • '}
                                        {lastAddedItem.color}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 text-[#ff9f9f] font-medium pt-2 animate-in fade-in zoom-in duration-300">
                                    <span className="text-sm">Agregado</span>
                                    <Check className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 my-2" />

                    {/* Recommendations "Complete the Look" */}
                    <div className="p-8 pt-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-white/80">Completa el Look</h4>
                            <ChevronRight className="w-4 h-4 text-white/50" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {recommendations.map(product => (
                                <Link href={`/products/${product.slug}`} key={product.id} className="group block" onClick={() => setIsSuccessSheetOpen(false)}>
                                    <div className="aspect-[3/4] relative rounded-md overflow-hidden bg-white/5 mb-3">
                                        {product.image && (
                                            <Image
                                                src={product.image.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105 duration-500"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        {product.originalPrice && (
                                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">Rebajas</span>
                                        )}
                                        <p className="text-xs font-semibold leading-tight line-clamp-2 group-hover:text-[#ff9f9f] transition-colors">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-white/60">
                                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.price)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-8 border-t border-white/10 bg-white/5">
                    <Button
                        className="w-full h-12 bg-transparent border border-white/30 hover:bg-white hover:text-black text-white rounded-none uppercase tracking-widest text-xs font-bold transition-all duration-300"
                        asChild
                    >
                        <Link href="/cart" onClick={() => setIsSuccessSheetOpen(false)}>
                            Ver Carrito [ {cartCount} ]
                        </Link>
                    </Button>
                </div>

            </SheetContent>
        </Sheet>
    );
}
