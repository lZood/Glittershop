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
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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
            {/* Basic Details Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Detalles Básicos</h3>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">Nombre del Producto</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            placeholder="Ej: Anillo de Diamante Solitario"
                                            className="bg-slate-50 border-slate-200 focus-visible:ring-[#b47331] h-12 rounded-xl"
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
                                <FormLabel className="text-slate-900 font-bold">URL Amigable (Slug)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            placeholder="anillo-diamante-solitario"
                                            className="bg-slate-100 border-slate-200 text-slate-500 h-12 rounded-xl pr-10"
                                        // readOnly // Allow editing if manual override needed, or keep readOnly
                                        />
                                        <LinkIcon className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
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
                                    <FormLabel className="text-slate-900 font-bold">Categoría</FormLabel>
                                    <Popover open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-[#b47331] text-xs h-6 px-2 hover:bg-[#b47331]/10">
                                                <Plus className="w-3 h-3 mr-1" /> Nueva
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-3">
                                            <div className="space-y-2">
                                                <h4 className="font-bold text-xs text-slate-900">Nueva Categoría</h4>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={newCategory}
                                                        onChange={(e) => setNewCategory(e.target.value)}
                                                        className="h-8 text-xs"
                                                        placeholder="Nombre..."
                                                    />
                                                    <Button onClick={handleAddCategory} size="sm" className="h-8 w-8 p-0 bg-[#b47331]">
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
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
                                <FormLabel className="text-slate-900 font-bold">Descripción Premium</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Detalles del material, quilates, inspiración del diseño..."
                                        className="min-h-[120px] rounded-xl border-slate-200"
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
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Precios</h3>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="base_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">Precio Base (MXN)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-slate-400 font-medium">$</span>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            value={field.value === 0 ? '' : field.value}
                                            onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                            placeholder="0.00"
                                            className="pl-7 h-12 rounded-xl border-slate-200"
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
                                    <FormLabel className="text-slate-900 font-bold">Precio de Oferta (Opcional)</FormLabel>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-slate-400 font-medium">$</span>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            value={!field.value || field.value === 0 ? '' : field.value}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                            placeholder="-"
                                            className="pl-7 h-12 rounded-xl border-slate-200"
                                        />
                                    </div>
                                </FormControl>
                                <p className="text-[10px] text-slate-500 font-medium">
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
                        className="p-0 h-auto hover:bg-transparent text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-bold uppercase transition-colors"
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
                                                <span className="absolute left-3 top-3.5 text-slate-400 font-medium">$</span>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    min={0}
                                                    value={!field.value || field.value === 0 ? '' : field.value}
                                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                                    placeholder="0.00"
                                                    className="pl-7 h-12 rounded-xl border-slate-100 bg-slate-50/50"
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
        </div>
    );
}
