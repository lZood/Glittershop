'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Wand2, Trash2, AlertCircle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

interface Step2StockProps {
    form: UseFormReturn<any>;
    colors: { name: string; hex: string }[];
    setColors: (v: any[]) => void;
    newColorName: string;
    setNewColorName: (v: string) => void;
    newColorHex: string;
    setNewColorHex: (v: string) => void;
    selectedSizes: string[];
    setSelectedSizes: (v: string[]) => void;
    generateVariants: () => void;
    isGenerating: boolean;
    NUMERIC_COLOR_MAP: Record<string, string>;
    fields: any[];
    remove: (index: number | number[]) => void;
}

const SIZES = ['5', '6', '7', '8', '9', '10', 'Ajustable'];

export function Step2Stock({
    form,
    colors, setColors,
    newColorName, setNewColorName,
    newColorHex, setNewColorHex,
    selectedSizes, setSelectedSizes,
    generateVariants, isGenerating,
    NUMERIC_COLOR_MAP,
    fields, remove
}: Step2StockProps) {
    // Removed internal useFieldArray, using props instead.

    const [isAddingColor, setIsAddingColor] = useState(false);

    const handleAddColor = () => {
        if (newColorName && newColorHex) {
            if (colors.some(c => c.name === newColorName)) return;
            setColors([...colors, { name: newColorName, hex: newColorHex }]);
            setNewColorName('');
            setIsAddingColor(false);
        }
    };

    const toggleSize = (size: string) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    // Watch variants to show stock alerts or other logic? 
    // Field array gives us default values, but for real-time validation of stock < 0 we might need to watch.
    // However, shadcn FormField handles validation display.

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Stock y Variantes</h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Configura los colores, tallas y códigos de inventario para este producto.
                </p>
            </div>

            {/* Config Section */}
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <Label className="text-slate-900 font-bold uppercase text-xs tracking-wider">COLORES / ACABADOS</Label>
                        <Popover open={isAddingColor} onOpenChange={setIsAddingColor}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" className="text-[#b47331] text-xs font-bold hover:bg-[#b47331]/10 px-2 h-8">
                                    <Plus className="w-3 h-3 mr-1" />
                                    Agregar
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-3">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-xs text-slate-900">Nuevo Color</h4>
                                    <Input
                                        placeholder="Nombre (Ej: Rose Gold)"
                                        className="h-8 text-xs"
                                        value={newColorName}
                                        onChange={(e) => setNewColorName(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            className="h-8 w-full p-1"
                                            value={newColorHex}
                                            onChange={(e) => setNewColorHex(e.target.value)}
                                        />
                                        <Button onClick={handleAddColor} size="sm" className="h-8 w-8 p-0 bg-[#b47331]">
                                            <Check className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {colors.map((color) => (
                            <div key={color.name} className="relative group shrink-0">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-900 font-bold text-sm"
                                >
                                    <span className="w-4 h-4 rounded-full border border-slate-100" style={{ backgroundColor: color.hex }}></span>
                                    {color.name}
                                </button>
                                <button
                                    onClick={() => setColors(colors.filter(c => c.name !== color.name))}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-3">
                        <Label className="text-slate-900 font-bold uppercase text-xs tracking-wider">TALLAS DISPONIBLES</Label>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {SIZES.map(size => {
                            const isSelected = selectedSizes.includes(size);
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={cn(
                                        "h-12 min-w-[3rem] px-3 rounded-full flex items-center justify-center font-bold transition-colors shrink-0",
                                        isSelected
                                            ? "bg-[#b47331] text-white shadow-lg shadow-[#b47331]/30"
                                            : "border border-slate-200 text-slate-500 hover:border-[#b47331] hover:text-[#b47331]"
                                    )}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Generator */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#b47331]/20 flex items-center justify-center text-[#b47331]">
                        <Wand2 className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900">Generador Inteligente</h3>
                </div>

                <div className="space-y-2">
                    <Label className="uppercase text-[10px] font-bold text-slate-400 tracking-wider">FORMATO DE SKU</Label>
                    <Input value="CAT-MOD-COL-SIZ (Ej: 01-5932-01-7)" className="bg-white border-slate-200 rounded-xl h-10 font-mono text-xs text-slate-500" readOnly />
                </div>

                <Button
                    type="button"
                    onClick={generateVariants}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full h-12 rounded-xl bg-[#faecd6] border-none text-[#b47331] hover:bg-[#b47331] hover:text-white font-bold transition-all transform active:scale-95"
                >
                    {isGenerating ? "Generando..." : "Generar Combinaciones"}
                </Button>
            </div>

            {/* List */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">Inventario Actual</h3>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold">{fields.length}</span>
                </div>

                {fields.map((field, index) => {
                    // Watch specific field values if needed for UI (like stock === 0 alert)
                    // But accessing array directly might be easier/performant enough.
                    // We can use form.getValues(`variants.${index}`) but cleaner is to rely on form state.
                    const variant = form.watch(`variants.${index}`);
                    const variantColorHex = colors.find(c => c.name === variant.color)?.hex || '#ccc';

                    return (
                        <div key={field.id} className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm relative group">
                            <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full shadow-inner border border-slate-100" style={{ backgroundColor: variantColorHex }}></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{variant.color} - {variant.size}</h4>
                                    <p className="text-xs text-slate-400">{variant.sku}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.sku`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">SKU</Label>
                                            <FormControl>
                                                <Input {...field} className="h-10 rounded-xl border-slate-200 bg-slate-50/50" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.stock`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase">STOCK</Label>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    className={cn(
                                                        "h-10 rounded-xl border-slate-200 text-center font-bold",
                                                        (field.value === 0 || field.value === '0') ? "text-red-500 bg-red-50" : "text-slate-900"
                                                    )}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {(variant.stock === 0 || variant.stock === '0') && (
                                <div className="flex items-center gap-1.5 mt-3 text-red-500 text-xs font-bold">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Sin Stock</span>
                                </div>
                            )}
                        </div>
                    )
                })}

                {fields.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        <p>No hay variantes. ¡Usa el generador!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
