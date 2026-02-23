'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Check, Minus, Plus, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ProductCarousel } from '@/components/product-carousel';
import { products } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/store/wishlist';
import { toast } from 'sonner';

function formatPrice(price: number) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(price);
}

function renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star
                key={i}
                className={`w-4 h-4 ${i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                    }`}
            />
        );
    }
    return stars;
}

export default function ProductDetailClient({ product, relatedProducts = [], children }: { product: Product, relatedProducts?: Product[], children?: React.ReactNode }) {
    // Extract unique colors/metals from variants
    const uniqueColors = Array.from(new Set(product.variants?.map(v => v.color).filter(Boolean))) as string[];
    const dynamicMetals = uniqueColors.map(colorName => {
        const variant = product.variants?.find(v => v.color === colorName);
        return {
            id: colorName,
            name: colorName,
            color: variant?.color_metadata?.hex || '#CCCCCC' // Fallback hex
        };
    });

    // Extract unique sizes from variants
    const uniqueSizes = Array.from(new Set(product.variants?.map(v => v.size).filter(Boolean))).sort() as string[];

    const [selectedMetal, setSelectedMetal] = useState(dynamicMetals[0] || null);
    const [selectedSize, setSelectedSize] = useState<string | null>(uniqueSizes[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [[page, direction], setPage] = useState([0, 0]);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const { addItem } = useCart();

    // Global Wishlist
    const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const isWishlisted = mounted ? isInWishlist(product.id) : false;

    const handleWishlistToggle = () => {
        if (isWishlisted) {
            removeWishlistItem(product.id);
            toast.success('Eliminado de favoritos');
        } else {
            addWishlistItem(product);
            toast.success('¡Agregado a tu lista de deseos!', { icon: '✨' });
        }
    };

    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

    useEffect(() => {
        // Handle Recently Viewed Logic
        try {
            const stored = localStorage.getItem('recently_viewed');
            let viewed: Product[] = stored ? JSON.parse(stored) : [];

            // Remove current product if it exists (to move it to top/front)
            viewed = viewed.filter(p => p.id !== product.id);

            // Add current product to front
            viewed.unshift(product);

            // Limit to 10
            if (viewed.length > 10) viewed = viewed.slice(0, 10);

            // Save back
            localStorage.setItem('recently_viewed', JSON.stringify(viewed));

            // Set state (excluding current product from the display list)
            setRecentlyViewed(viewed.filter(p => p.id !== product.id));

        } catch (e) {
            console.error("Error managing recently viewed", e);
        }
    }, [product]);

    // Reset image index when color changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedMetal]);

    // Filter Images by Color
    const filteredImages = useMemo(() => {
        const fallbackImages = product.images ?? [];

        if (!product.images_metadata || product.images_metadata.length === 0) {
            return fallbackImages; // Fallback to all strings if no metadata
        }

        const exactMatch = product.images_metadata
            .filter(img => img.color === selectedMetal?.name)
            .map(img => img.url);

        if (exactMatch.length > 0) return exactMatch;

        // Fallback: If no images for this color, show generic/uncolored images
        const generic = product.images_metadata
            .filter(img => !img.color || img.color === 'default')
            .map(img => img.url);

        return generic.length > 0 ? generic : fallbackImages;
    }, [selectedMetal, product.images_metadata, product.images]);

    // Dynamic Images from Product
    const productImages = filteredImages.map((url, idx) => ({
        id: `img-${idx}`,
        imageUrl: url,
        description: product.name,
        imageHint: product.name
    }));

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
        setCurrentImageIndex((prev) => (prev + newDirection + productImages.length) % productImages.length);
    };

    const setDirection = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    }

    const slideVariants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
            };
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    if (!product) {
        return <div>Producto no encontrado</div>;
    }

    const rating = product.rating || 0;
    const reviews = product.reviews || 0;
    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">

                    {/* Left Column: Images (Sticky) */}
                    <div className="space-y-4 lg:sticky lg:top-24 h-fit">
                        <div className="relative aspect-[4/5] w-full bg-secondary/30 rounded-2xl overflow-hidden shadow-sm group touch-pan-y">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentImageIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = swipePower(offset.x, velocity.x);

                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(1);
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(-1);
                                        }
                                    }}
                                    onClick={() => setIsLightboxOpen(true)}
                                    className="absolute inset-0 cursor-zoom-in active:cursor-grabbing"
                                >
                                    {productImages[currentImageIndex] && (
                                        <Image
                                            src={productImages[currentImageIndex].imageUrl}
                                            alt={product.description}
                                            fill
                                            className="object-cover pointer-events-none"
                                            priority
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Discount Badge */}
                            {product.originalPrice && (
                                <Badge className="absolute top-4 left-4 bg-red-500 text-white border-none px-3 py-1.5 text-sm font-bold shadow-md z-10">
                                    -{discountPercentage}%
                                </Badge>
                            )}

                            {/* Navigation Arrows (Minimal) */}
                            <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none z-20">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="pointer-events-auto hover:bg-transparent hover:text-primary transition-colors"
                                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                >
                                    <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-foreground drop-shadow-md" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="pointer-events-auto hover:bg-transparent hover:text-primary transition-colors"
                                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                >
                                    <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-foreground drop-shadow-md" />
                                </Button>
                            </div>
                        </div>

                        {/* Segmented Line Indicator (External) */}
                        <div className="flex justify-center gap-1.5 pt-2">
                            {productImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        const direction = index > currentImageIndex ? 1 : -1;
                                        setDirection(direction);
                                        setCurrentImageIndex(index);
                                    }}
                                    className={cn(
                                        "h-1 rounded-full transition-all duration-300",
                                        index === currentImageIndex
                                            ? "w-8 bg-foreground"
                                            : "w-4 bg-border hover:bg-foreground/50"
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                        {/* Header */}
                        <div className="space-y-4 border-b pb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-foreground">{product.name}</h1>
                                    <p className="text-muted-foreground mt-2 text-lg">{product.category}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-secondary h-12 w-12"
                                    onClick={handleWishlistToggle}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {isWishlisted ? (
                                            <motion.div
                                                key="filled"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                                            >
                                                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
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
                                                <Heart className="w-8 h-8 text-black" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {renderStars(rating)}
                                </div>
                                <span className="text-sm font-medium text-muted-foreground underline decoration-dotted underline-offset-4 cursor-pointer hover:text-foreground transition-colors">
                                    {reviews} reseñas
                                </span>
                            </div>

                            <div className="flex items-baseline gap-3">
                                <p className="text-4xl font-bold text-foreground">{formatPrice(product.price)}</p>
                                {product.originalPrice && (
                                    <p className="text-xl text-muted-foreground line-through decoration-muted-foreground/50">
                                        {formatPrice(product.originalPrice)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Selectors */}
                        <div className="space-y-6">
                            {/* Metal/Color Selector */}
                            {dynamicMetals.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Color / Material</span>
                                        <span className="text-sm font-medium text-foreground">{selectedMetal?.name}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        {dynamicMetals.map((metal) => (
                                            <button
                                                key={metal.id}
                                                onClick={() => setSelectedMetal(metal)}
                                                className={cn(
                                                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative group",
                                                    selectedMetal?.id === metal.id ? "border-primary scale-110 shadow-sm" : "border-transparent hover:scale-105"
                                                )}
                                                title={metal.name}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-full shadow-inner border border-border/50"
                                                    style={{ backgroundColor: metal.color }}
                                                />
                                                {selectedMetal?.id === metal.id && (
                                                    <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold whitespace-nowrap bg-foreground text-background px-2 py-0.5 rounded-full">
                                                        {metal.name}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            {uniqueSizes.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Talla</span>
                                        <span className="text-sm font-medium text-primary underline cursor-pointer">Guía de tallas</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {uniqueSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={cn(
                                                    "h-10 w-14 rounded-lg border font-medium text-sm transition-all duration-200",
                                                    selectedSize === size
                                                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                                                        : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-secondary/50"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4">
                            <div className="flex gap-4">
                                <div className="flex items-center border border-border rounded-full h-12 w-32 px-4 bg-background">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-1 hover:text-primary transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="flex-1 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-1 hover:text-primary transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <Button
                                    className="flex-1 h-12 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                    size="lg"
                                    onClick={() => addItem({
                                        product,
                                        quantity,
                                        color: selectedMetal?.name,
                                        size: selectedSize || undefined
                                    })}
                                >
                                    Añadir al Carrito
                                </Button>
                            </div>
                            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                Envío gratuito y devoluciones en 30 días
                            </p>
                        </div>

                        {/* Accordions */}
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="description">
                                <AccordionTrigger className="text-base font-semibold">Descripción</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {product.description}
                                </AccordionContent>
                            </AccordionItem>

                            {/* Materials - currently hardcoded or from description, can be dynamic later */}
                            <AccordionItem value="materials">
                                <AccordionTrigger className="text-base font-semibold">Materiales y Cuidados</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    {product.care_instructions || "Recomendamos limpiar con un paño suave y evitar el contacto directo con perfumes."}
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="shipping">
                                <AccordionTrigger className="text-base font-semibold">Envío y Devoluciones</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Envío estándar gratuito (3-5 días laborables). Envío express disponible. Devoluciones gratuitas dentro de los 30 días posteriores a la compra.
                                </AccordionContent>
                            </AccordionItem>

                            {product.tags && product.tags.length > 0 && (
                                <AccordionItem value="details">
                                    <AccordionTrigger className="text-base font-semibold">Detalles Adicionales</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed flex flex-wrap gap-2">
                                        {product.tags.map(tag => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                        </Accordion>

                        {/* Social Proof / Reviews Preview */}
                        <div className="pt-8 border-t">
                            <h3 className="font-bold text-lg mb-4">Reseñas Destacadas</h3>
                            <div className="space-y-4">
                                <div className="bg-secondary/30 p-4 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src="https://picsum.photos/seed/user1/100" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold">Jane Doe</p>
                                            <div className="flex text-yellow-500">
                                                {renderStars(5)}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">"Es incluso más hermoso en persona. La calidad es excepcional y el envío fue muy rápido."</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Recommendations Sections */}
                <div className="mt-16 space-y-12">
                    {relatedProducts.length > 0 && (
                        <ProductCarousel
                            title="También te podría gustar"
                            products={relatedProducts}
                        />
                    )}

                    {recentlyViewed.length > 0 && (
                        <ProductCarousel
                            title="Visto recientemente"
                            products={recentlyViewed}
                        />
                    )}
                </div>
            </div>

            {children}



            {/* Lightbox Overlay */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-md flex flex-col"
                    >
                        {/* Close Button */}
                        <div className="absolute top-4 right-4 z-[70]">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-secondary h-12 w-12"
                                onClick={() => setIsLightboxOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Main Image Area */}
                        <div className="flex-1 relative flex items-center justify-center p-0 md:p-12 overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentImageIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        // Only allow swipe if not zoomed in
                                        const swipe = swipePower(offset.x, velocity.x);
                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(1);
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(-1);
                                        }
                                    }}
                                    className="absolute inset-0 flex items-center justify-center w-full h-full"
                                >
                                    {productImages[currentImageIndex] && (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <TransformWrapper
                                                initialScale={1}
                                                minScale={1}
                                                maxScale={4}
                                                centerOnInit
                                                wheel={{ disabled: true }}
                                                doubleClick={{ disabled: true }}
                                            >
                                                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                                    <TransformComponent
                                                        wrapperClass="!w-full !h-full flex items-center justify-center"
                                                        contentClass="!w-full !h-full flex items-center justify-center"
                                                    >
                                                        <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center">
                                                            <Image
                                                                src={productImages[currentImageIndex].imageUrl}
                                                                alt={product.description}
                                                                fill
                                                                className="object-contain"
                                                                priority
                                                            />
                                                        </div>
                                                    </TransformComponent>
                                                )}
                                            </TransformWrapper>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-[70]">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="pointer-events-auto bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12 backdrop-blur-sm transition-colors"
                                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="pointer-events-auto bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12 backdrop-blur-sm transition-colors"
                                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </Button>
                            </div>
                        </div>

                        {/* Thumbnails Footer */}
                        <div className="h-24 md:h-32 border-t bg-background/50 backdrop-blur flex items-center justify-center gap-4 px-4 overflow-x-auto z-[70]">
                            {productImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        const direction = index > currentImageIndex ? 1 : -1;
                                        setDirection(direction);
                                        setCurrentImageIndex(index);
                                    }}
                                    className={cn(
                                        "relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                                        index === currentImageIndex
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <Image
                                        src={img.imageUrl}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
