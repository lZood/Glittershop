'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useWishlist } from '@/lib/store/wishlist';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type ProductCardProps = {
    product: Product;
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(price);
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem, removeItem, isInWishlist } = useWishlist();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isFavorite = mounted ? isInWishlist(product.id) : false;

    const handleWishlistAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFavorite) {
            removeItem(product.id);
            toast.success('Eliminado de favoritos');
        } else {
            addItem(product);
            toast.success('¡Agregado a tu lista de deseos!', {
                icon: '✨'
            });
        }
    };

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="group relative flex flex-col h-full">
            <Link href={`/products/${product.slug || product.id}`} className="group flex-1 flex flex-col">
                <div className="aspect-[3/4] relative overflow-hidden rounded-xl bg-secondary/20">
                    {product.image && (
                        <Image
                            src={product.image.imageUrl}
                            alt={product.description}
                            data-ai-hint={product.image.imageHint}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}

                    {/* Offer Badge */}
                    {product.originalPrice && (
                        <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white border-none px-2 py-1 text-xs font-bold shadow-sm z-10">
                            -{discountPercentage}%
                        </Badge>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleWishlistAdd}
                        className={`absolute top-2 right-2 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-full transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20 ${isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} shadow-sm`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isFavorite ? (
                                <motion.div
                                    key="filled"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="outline"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Star className="w-5 h-5 text-black" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>


                </div>

                <div className="mt-4 space-y-2 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-base leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                            {product.name}
                        </h3>
                    </div>

                    {/* Color Swatches */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="flex gap-1.5">
                            {product.colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="w-3 h-3 rounded-full border border-border shadow-sm"
                                    style={{ backgroundColor: color }}
                                    title="Color disponible"
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-auto pt-2 flex items-baseline gap-2">
                        <p className={`font-bold text-lg ${product.originalPrice ? 'text-red-600' : 'text-foreground'}`}>
                            {formatPrice(product.price)}
                        </p>
                        {product.originalPrice && (
                            <p className="text-sm text-muted-foreground line-through decoration-muted-foreground/60">
                                {formatPrice(product.originalPrice)}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
