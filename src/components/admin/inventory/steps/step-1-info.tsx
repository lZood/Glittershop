'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, Link as LinkIcon, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Category } from "@/lib/actions/categories";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Step1InfoProps {
    form: UseFormReturn<any>;
    categories: Category[];
    newCategory: string;
    setNewCategory: (v: string) => void;
    handleAddCategory: () => void;
    isAddingCategory: boolean;
    setIsAddingCategory: (v: boolean) => void;
}

export function Step1Info({
    form,
    categories,
    newCategory, setNewCategory,
    handleAddCategory, isAddingCategory, setIsAddingCategory
}: Step1InfoProps) {
    const [showCost, setShowCost] = useState(false);

    // Auto-generate slug from title
    const title = form.watch('title');
    useEffect(() => {
        if (title && !form.getFieldState('slug').isDirty) {
            const slug = title.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            form.setValue('slug', slug);
        }
    }, [title, form]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Status Section */}
            <div className="bg-secondary/20 p-4 rounded-2xl border border-border/50 flex items-center justify-between">
                <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-foreground">Estado del Producto</h3>
                    <p className="text-xs text-muted-foreground">¿Debería estar visible en la tienda ahora?</p>
                </div>
                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-y-0 gap-3">
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider", field.value ? "text-emerald-500" : "text-muted-foreground/40")}>
                                {field.value ? "Activo" : "Inactivo"}
                            </span>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            {/* Basic Details Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-4">Detalles Básicos</h3>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground font-bold">Nombre del Producto</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            placeholder="Ej: Anillo de Diamante Solitario"
                                            className="bg-secondary/20 border-border focus-visible:ring-brand h-12 rounded-xl"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground font-bold">URL Amigable (Slug)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            placeholder="anillo-diamante-solitario"
                                            className="bg-secondary/20 border-border text-foreground h-12 rounded-xl pr-10"
                                        // readOnly // Allow editing if manual override needed, or keep readOnly
                                        />
                                        <LinkIcon className="w-4 h-4 text-muted-foreground/60 absolute right-4 top-4" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-foreground font-bold">Categoría</FormLabel>
                                    <Popover open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-brand text-xs h-6 px-2 hover:bg-brand/10">
                                                <Plus className="w-3 h-3 mr-1" /> Nueva
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-3">
                                            <div className="space-y-2">
                                                <h4 className="font-bold text-xs text-foreground">Nueva Categoría</h4>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={newCategory}
                                                        onChange={(e) => setNewCategory(e.target.value)}
                                                        className="h-8 text-xs"
                                                        placeholder="Nombre..."
                                                    />
                                                    <Button onClick={handleAddCategory} size="sm" className="h-8 w-8 p-0 bg-brand">
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl border-border bg-secondary/10">
                                            <SelectValue placeholder="Seleccionar Categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-xl max-h-60">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground font-bold">Descripción Premium</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Detalles del material, quilates, inspiración del diseño..."
                                        className="min-h-[120px] rounded-xl border-border bg-secondary/10"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Tags Section omitted for brevity or implemented with simple badge selection if needed. 
                    For now, skipping complex tag input unless crucial. 
                    Re-adding simple button toggles for common tags. */}
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-4">Precios</h3>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="base_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground font-bold">Precio Base (MXN)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-muted-foreground/60 font-medium">$</span>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            value={field.value === 0 ? '' : field.value}
                                            onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                            placeholder="0.00"
                                            className="pl-7 h-12 rounded-xl border-border bg-secondary/10"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sale_price"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-1">
                                    <FormLabel className="text-foreground font-bold">Precio de Oferta (Opcional)</FormLabel>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-muted-foreground/60 font-medium">$</span>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            value={!field.value || field.value === 0 ? '' : field.value}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                            placeholder="-"
                                            className="pl-7 h-12 rounded-xl border-border bg-secondary/10"
                                        />
                                    </div>
                                </FormControl>
                                <p className="text-[10px] text-muted-foreground font-medium">
                                    Reemplaza el precio base para el cliente.
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowCost(!showCost)}
                        className="p-0 h-auto hover:bg-transparent text-muted-foreground/60 hover:text-brand flex items-center gap-1 text-xs font-bold uppercase transition-colors"
                    >
                        {showCost ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        Costo de Producción (Privado)
                    </Button>

                    {showCost && (
                        <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                            <FormField
                                control={form.control}
                                name="cost_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative max-w-[50%]">
                                                <span className="absolute left-3 top-3.5 text-muted-foreground/60 font-medium">$</span>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    min={0}
                                                    value={!field.value || field.value === 0 ? '' : field.value}
                                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                                    placeholder="0.00"
                                                    className="pl-7 h-12 rounded-xl border-border/50 bg-secondary/10"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Details Section */}
            <div className="space-y-6 pt-4">
                <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-4">Detalles Adicionales</h3>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="care_instructions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground font-bold">Instrucciones de Cuidado</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Ej: No exponer al agua, limpiar con paño seco..."
                                        className="min-h-[80px] rounded-xl border-border bg-secondary/10"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="size_guide_type"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-foreground font-bold">Guía de Tallas</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl border-border bg-secondary/10">
                                            <SelectValue placeholder="Seleccionar Guía" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="none">Ninguna</SelectItem>
                                        <SelectItem value="ring">Anillos</SelectItem>
                                        <SelectItem value="bracelet">Pulseras</SelectItem>
                                        <SelectItem value="necklace">Collares</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-[10px]">
                                    Define qué tabla de tallas se mostrará al cliente.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-3">
                    <FormLabel className="text-foreground font-bold">Etiquetas</FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {['nuevo', 'bestseller', 'oferta', 'tendencia'].map((tag) => {
                            const currentTags = form.watch('tags') || [];
                            const isSelected = currentTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                        if (isSelected) {
                                            form.setValue('tags', currentTags.filter((t: string) => t !== tag));
                                        } else {
                                            form.setValue('tags', [...currentTags, tag]);
                                        }
                                    }}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                        isSelected
                                            ? "bg-brand text-brand-foreground shadow-md shadow-brand/20"
                                            : "bg-secondary/20 text-muted-foreground/60 hover:bg-secondary/30"
                                    )}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
