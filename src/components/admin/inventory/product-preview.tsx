import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductPreviewProps {
    title: string;
    category: string;
    price: number;
    salePrice?: number;
    images: Record<string, (string | { url: string; croppedArea?: { x: number; y: number; width: number; height: number } })[]>; // Map color -> metadata
    description?: string;
    colors: { name: string; hex: string }[];
    sizes: string[];
    tags: string[]; // Added tags prop
    video?: File | null; // Added video prop
}

export function ProductPreview({
    title,
    category,
    price,
    salePrice,
    images,
    description,
    colors,
    sizes,
    tags = [],
    video // Destructure video prop
}: ProductPreviewProps) {
    const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.name || 'default');
    const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Reset selection when props change
    useEffect(() => {
        if (colors.length > 0 && !colors.find(c => c.name === selectedColor)) {
            setSelectedColor(colors[0].name);
        }
    }, [colors, selectedColor]);

    useEffect(() => {
        if (sizes.length > 0 && !sizes.includes(selectedSize)) {
            setSelectedSize(sizes[0]);
        }
    }, [sizes, selectedSize]);

    const currentImageData = images[selectedColor] || images['default'] || [];
    const displayImageItem = currentImageData[currentImageIndex] || null;

    const displayImage = typeof displayImageItem === 'string' ? displayImageItem : displayImageItem?.url;
    const croppedArea = typeof displayImageItem === 'object' ? displayImageItem?.croppedArea : null;

    const hasDiscount = salePrice && salePrice < price;
    const discountPercent = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

    // Helper to get tag label
    const getTagLabel = (tagId: string) => {
        const labels: Record<string, string> = {
            'new': 'Nuevo',
            'bestseller': 'Más Vendido',
            'limited': 'Edición Limitada',
            'sale': 'Oferta',
            'exclusive': 'Exclusivo'
        };
        return labels[tagId] || tagId;
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Vista Previa Interactiva</h3>
            <div className="border rounded-xl overflow-hidden bg-card shadow-sm max-w-sm mx-auto group">
                {/* Image Area */}
                <div className="aspect-[3/4] relative bg-muted flex items-center justify-center overflow-hidden">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={title}
                            className="block object-cover w-full h-full max-w-none transition-transform duration-700"
                            style={croppedArea ? {
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: `${10000 / croppedArea.width}%`,
                                height: `${10000 / croppedArea.height}%`,
                                transform: `translate(-${croppedArea.x}%, -${croppedArea.y}%)`,
                                transformOrigin: '0 0'
                            } : {}}
                        />
                    ) : (
                        <div className="text-muted-foreground text-sm flex flex-col items-center">
                            <span>Sin imagen</span>
                            {selectedColor !== 'default' && <span className="text-xs">({selectedColor})</span>}
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {tags.map(tag => (
                            <Badge key={tag} className="bg-white/90 text-black hover:bg-white/100 backdrop-blur-sm shadow-sm uppercase text-[10px] tracking-wider">
                                {getTagLabel(tag)}
                            </Badge>
                        ))}
                        {hasDiscount && (
                            <Badge variant="destructive" className="shadow-sm">
                                -{discountPercent}%
                            </Badge>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white">
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
                        {currentImageData.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all shadow-sm",
                                    i === currentImageIndex ? "bg-white w-3" : "bg-white/50 hover:bg-white/80"
                                )}
                                onClick={() => setCurrentImageIndex(i)}
                            />
                        ))}
                        {video && (
                            <button
                                type="button"
                                className="w-1.5 h-1.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-all shadow-sm flex items-center justify-center p-[2px]"
                            >
                                <PlayCircle className="w-full h-full text-white" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            {category || 'Categoría'}
                        </p>
                        <h3 className="font-medium text-base leading-tight line-clamp-1">
                            {title || 'Título del Producto'}
                        </h3>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        {hasDiscount ? (
                            <>
                                <span className="font-semibold text-lg text-destructive">
                                    ${salePrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                    ${price?.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="font-semibold text-lg">
                                ${price?.toLocaleString() || '0.00'}
                            </span>
                        )}
                    </div>

                    {/* Color Swatches */}
                    {colors.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-xs font-medium text-muted-foreground">Color: {selectedColor}</span>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => { setSelectedColor(color.name); setCurrentImageIndex(0); }}
                                        className={cn(
                                            "w-6 h-6 rounded-full border border-muted-foreground/20 shadow-sm transition-all",
                                            selectedColor === color.name && "ring-2 ring-primary ring-offset-2 scale-110"
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sizes */}
                    {sizes.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-xs font-medium text-muted-foreground">Talla: {selectedSize}</span>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={cn(
                                            "px-2 py-1 text-xs border rounded-md transition-colors",
                                            selectedSize === size
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button size="sm" className="w-full rounded-full">
                        <ShoppingCart className="mr-2 h-3 w-3" />
                        Agregar al Carrito
                    </Button>
                </div>
            </div>

            {description && (
                <Card className="mt-4">
                    <CardContent className="p-4 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">Descripción:</p>
                        {description}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
