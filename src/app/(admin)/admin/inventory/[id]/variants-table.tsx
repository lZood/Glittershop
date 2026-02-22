'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Edit, Save, X, Plus, Minus } from 'lucide-react';
import { updateVariantStock } from '@/lib/actions/products';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface VariantsTableProps {
    variants: any[];
}

export function VariantsTable({ variants }: VariantsTableProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const startEdit = (variant: any) => {
        setEditingId(variant.id);
        setEditValue(variant.stock);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue(0);
    };

    const handleSave = async (variantId: number) => {
        setIsSaving(true);
        try {
            const result = await updateVariantStock(variantId, editValue);
            if (result.success) {
                toast({
                    title: "Stock actualizado",
                    description: "El inventario se ha guardado correctamente.",
                    className: "bg-background border-border/50 rounded-none uppercase tracking-widest font-bold"
                });
                setEditingId(null);
            } else {
                toast({
                    title: "Error",
                    description: result.error || "No se pudo actualizar el stock.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Ocurrió un error inesperado.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="bg-background border border-border/50 rounded-none overflow-hidden hidden md:block">
                <div className="p-6 border-b border-border/50 bg-secondary/5 flex items-center justify-between">
                    <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                        <Box className="w-3 h-3" /> Inventario por Variante
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/10 text-[10px] uppercase text-muted-foreground tracking-[0.2em] font-bold">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold">SKU</th>
                                <th className="px-6 py-4 text-left font-bold">Variante</th>
                                <th className="px-6 py-4 text-center font-bold">Talla</th>
                                <th className="px-6 py-4 text-right font-bold">Stock</th>
                                <th className="px-6 py-4 text-right w-[100px] font-bold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {variants?.map((variant: any) => (
                                <tr key={variant.id} className="hover:bg-secondary/5 transition-colors group">
                                    <td className="px-6 py-5 font-mono text-[10px] text-muted-foreground group-hover:text-foreground">
                                        {variant.sku}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            {variant.color && (
                                                <div
                                                    className="w-4 h-4 border border-border/50 shadow-sm"
                                                    style={{ backgroundColor: variant.color }}
                                                    title={variant.color}
                                                />
                                            )}
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                                                {variant.color || "Estándar"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <Badge variant="outline" className="rounded-none border-border/50 text-[10px] font-bold uppercase tracking-widest bg-background">
                                            {variant.size || "Única"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {editingId === variant.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-none border-border/50"
                                                    onClick={() => setEditValue(Math.max(0, editValue - 1))}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                                                    className="w-16 h-8 text-center rounded-none border-border/50 font-bold"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-none border-border/50"
                                                    onClick={() => setEditValue(editValue + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className={cn("text-lg font-medium tabular-nums", variant.stock === 0 ? "text-red-500" : "text-foreground")}>
                                                {variant.stock === 0 ? "AGOTADO" : variant.stock}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {editingId === variant.id ? (
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={cancelEdit}
                                                    disabled={isSaving}
                                                    className="h-8 w-8 p-0 rounded-none hover:bg-red-500/10"
                                                >
                                                    <X className="h-4 w-4 text-red-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleSave(variant.id)}
                                                    disabled={isSaving}
                                                    className="h-8 w-8 p-0 rounded-none hover:bg-green-500/10"
                                                >
                                                    {isSaving ? <span className="animate-spin text-xs">.</span> : <Save className="h-4 w-4 text-green-500" />}
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startEdit(variant)}
                                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all rounded-none hover:bg-secondary/50"
                                            >
                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <Box className="w-3 h-3 text-muted-foreground" />
                    <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Inventario por Variante</h3>
                </div>
                {variants?.map((variant: any) => (
                    <div key={variant.id} className="bg-background border border-border/50 rounded-none p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                {variant.color && (
                                    <div
                                        className="w-10 h-10 border border-border/20 shadow-sm flex-shrink-0"
                                        style={{ backgroundColor: variant.color }}
                                    />
                                )}
                                <div>
                                    <div className="text-[12px] font-bold uppercase tracking-widest text-foreground">{variant.color || "Estándar"}</div>
                                    <div className="text-[10px] text-muted-foreground font-mono mt-1">SKU: {variant.sku}</div>
                                </div>
                            </div>
                            <Badge variant="outline" className="rounded-none border-border/50 text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-secondary/5">
                                {variant.size || "Única"}
                            </Badge>
                        </div>

                        <div className="bg-secondary/5 border border-border/10 p-4 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Stock Actual</span>

                            {editingId === variant.id ? (
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-none border-border/50"
                                        onClick={() => setEditValue(Math.max(0, editValue - 1))}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={editValue}
                                        onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                                        className="w-16 h-10 text-center text-lg font-bold rounded-none border-border/50"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-none border-border/50"
                                        onClick={() => setEditValue(editValue + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <span className={cn("text-xl font-medium tabular-nums", variant.stock === 0 ? "text-red-500" : "text-foreground")}>
                                    {variant.stock === 0 ? "AGOTADO" : variant.stock}
                                </span>
                            )}
                        </div>

                        {editingId === variant.id ? (
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    onClick={cancelEdit}
                                    disabled={isSaving}
                                    className="w-full rounded-none uppercase tracking-[0.1em] text-[10px] font-bold h-12"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => handleSave(variant.id)}
                                    disabled={isSaving}
                                    className="w-full rounded-none uppercase tracking-[0.1em] text-[10px] font-bold h-12 bg-foreground text-background"
                                >
                                    {isSaving ? "Guardando..." : "Guardar"}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => startEdit(variant)}
                                className="w-full rounded-none uppercase tracking-[0.1em] text-[10px] font-bold h-12 border-border/50"
                            >
                                <Edit className="h-3.5 w-3.5 mr-2" />
                                Editar Stock
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
