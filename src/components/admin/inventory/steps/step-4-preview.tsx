'use client';

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Save, Rocket, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Point, Area } from 'react-easy-crop';

// Mock types for form values to avoid importing from parent if not exported
interface ProductFormValues {
    title: string;
    description: string;
    base_price: number;
    category: string;
    tags: string[];
    // ... other fields
}

interface Step4PreviewProps {
    form: UseFormReturn<any>;
    previewUrls: Record<string, { url: string; crop?: Point; zoom?: number; pixelCrop?: Area }[]>;
    videoPreview: string | null;
    colors: { name: string; hex: string }[];
    onSubmit: (status: 'draft' | 'active') => void;
    isSubmitting: boolean;
    onBack: () => void;
}

export function Step4Preview({
    form,
    previewUrls,
    videoPreview,
    colors,
    onSubmit,
    isSubmitting,
    onBack
}: Step4PreviewProps) {
    const values = form.getValues();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');

    // Flatten images from all colors for the carousel if needed, or show active color images
    // Let's emulate the real product page: Default shows standard images or first color
    const activeImages = previewUrls[selectedColor] || [];
    const allImages = Object.values(previewUrls).flat();

    // Fallback if no images
    const displayImages = activeImages.length > 0 ? activeImages : allImages.length > 0 ? allImages : [{ url: 'https://placehold.co/600x600?text=No+Image' }];

    const currentImage = displayImages[activeImageIndex] || displayImages[0];

    const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
    const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-foreground">Vista Previa</h2>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Así es como tus clientes verán el producto.
                </p>
            </div>

            {/* Mock Product Page */}
            <div className="bg-card rounded-3xl shadow-sm border border-border/50 overflow-hidden">
                {/* Image Gallery Mock */}
                <div className="relative aspect-square bg-secondary/10">
                    <img
                        src={currentImage?.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />

                    {displayImages.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 hover:bg-card backdrop-blur-md flex items-center justify-center text-foreground shadow-sm z-10">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 hover:bg-card backdrop-blur-md flex items-center justify-center text-foreground shadow-sm z-10">
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
                                {displayImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "w-1.5 h-1.5 rounded-full transition-all",
                                            idx === activeImageIndex ? "bg-white w-3" : "bg-white/50"
                                        )}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Product Info Mock */}
                <div className="p-6 space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-bold text-foreground leading-tight">{values.title || 'Nombre del Producto'}</h3>
                            <div className="bg-secondary/10 px-2 py-1 rounded text-[10px] font-black uppercase text-muted-foreground">
                                {values.category || 'Categoría'}
                            </div>
                        </div>
                        <p className="text-brand font-bold mt-2">
                            ${Number(values.base_price || 0).toFixed(2)}
                        </p>
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm text-muted-foreground line-clamp-3">
                        {values.description || 'Sin descripción...'}
                    </div>

                    {/* Colors Mock */}
                    {colors.length > 0 && (
                        <div className="space-y-3">
                            <span className="text-xs font-bold uppercase text-foreground tracking-wider">Color: {selectedColor}</span>
                            <div className="flex gap-2">
                                {colors.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => {
                                            setSelectedColor(color.name);
                                            setActiveImageIndex(0);
                                        }}
                                        className={cn(
                                            "w-8 h-8 rounded-full border-2 transition-all",
                                            selectedColor === color.name ? "border-brand scale-110" : "border-transparent hover:scale-110"
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Guide Label Mock */}
                    <div className="flex items-center gap-2 text-brand text-xs font-bold font-mono">
                        <ArrowRight className="w-3 h-3" />
                        Guía de Tallas
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-14 rounded-2xl border-border text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-bold"
                >
                    <ArrowRight className="w-5 h-5 rotate-180 mr-2" />
                    Atrás
                </Button>

                <Button
                    variant="outline"
                    onClick={() => onSubmit('draft')}
                    disabled={isSubmitting}
                    className="h-14 rounded-2xl border-border text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-bold"
                >
                    <EyeOff className="w-4 h-4 mr-2" />
                    <div className="flex flex-col items-start gap-0.5">
                        <span className="leading-none">Guardar Borrador</span>
                        <span className="text-[10px] font-normal opacity-70">Oculto a clientes</span>
                    </div>
                </Button>

                <Button
                    onClick={() => onSubmit('active')}
                    disabled={isSubmitting}
                    className="h-14 rounded-2xl bg-brand hover:bg-brand/90 text-brand-foreground font-bold shadow-lg shadow-brand/30"
                >
                    <Rocket className="w-4 h-4 mr-2" />
                    <div className="flex flex-col items-start gap-0.5">
                        <span className="leading-none">Publicar Producto</span>
                        <span className="text-[10px] font-normal opacity-90">Visible en tienda</span>
                    </div>
                </Button>
            </div>
        </div>
    );
}
