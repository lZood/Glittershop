'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { createReview } from "@/lib/actions/reviews";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ReviewFormProps {
    productId: string;
    variants?: { color: string; size: string }[]; // Available variants summary
    onSuccess?: () => void;
}

export function ReviewForm({ productId, variants = [], onSuccess }: ReviewFormProps) {
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Extract unique colors/sizes for simple selection
    const colors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));
    const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast({ title: "Selecciona una calificación", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await createReview({
                product_id: productId,
                rating,
                title,
                content,
                variant_color: selectedColor || undefined,
                variant_size: selectedSize || undefined
            });

            if (res.success) {
                toast({ title: "Reseña enviada", description: "Gracias por tu opinión." });
                setRating(0);
                setTitle("");
                setContent("");
                if (onSuccess) onSuccess();
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Ocurrió un error inesperado.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg bg-card">
            <h3 className="font-bold text-lg">Escribir Reseña</h3>

            <div className="space-y-2">
                <Label>Calificación</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={cn(
                                    "w-6 h-6",
                                    star <= rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {colors.length > 0 && (
                    <div className="space-y-2">
                        <Label>¿Qué color compraste?</Label>
                        <Select value={selectedColor} onValueChange={setSelectedColor}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                                {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {sizes.length > 0 && (
                    <div className="space-y-2">
                        <Label>¿Qué talla?</Label>
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                                {sizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                    id="title"
                    placeholder="Resumen de tu experiencia (opcional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Reseña</Label>
                <Textarea
                    id="content"
                    placeholder="¿Qué te pareció el producto?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Enviando..." : "Publicar Reseña"}
            </Button>
        </form>
    );
}
