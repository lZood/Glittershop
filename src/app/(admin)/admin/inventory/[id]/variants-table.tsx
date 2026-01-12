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
                    className: "bg-green-50 dark:bg-green-900 border-green-200"
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
        <>
            {/* Desktop Table View */}
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden hidden md:block">
                <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Box className="w-4 h-4 text-primary" /> Inventario por Variante
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/30 text-xs uppercase text-muted-foreground font-semibold">
                            <tr>
                                <th className="px-6 py-4 text-left">SKU</th>
                                <th className="px-6 py-4 text-left">Color / Variante</th>
                                <th className="px-6 py-4 text-center">Talla</th>
                                <th className="px-6 py-4 text-right">Stock</th>
                                <th className="px-6 py-4 text-right w-[100px]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {variants?.map((variant: any) => (
                                <tr key={variant.id} className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground group-hover:text-foreground">
                                        {variant.sku}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {variant.color && (
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm"
                                                    style={{ backgroundColor: variant.color }}
                                                    title={variant.color}
                                                />
                                            )}
                                            <span className="font-medium capitalize">{variant.color || "Estándar"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant="outline" className="font-normal bg-background">
                                            {variant.size || "Única"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId === variant.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    onClick={() => setEditValue(Math.max(0, editValue - 1))}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                                                    className="w-16 h-8 text-center"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    onClick={() => setEditValue(editValue + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className={cn("font-bold tabular-nums", variant.stock === 0 ? "text-red-500" : "text-green-600 dark:text-green-400")}>
                                                {variant.stock === 0 ? "Agotado" : variant.stock}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId === variant.id ? (
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={cancelEdit}
                                                    disabled={isSaving}
                                                    className="h-8 w-8 p-0 rounded-full"
                                                >
                                                    <X className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleSave(variant.id)}
                                                    disabled={isSaving}
                                                    className="h-8 w-8 p-0 rounded-full bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    {isSaving ? <span className="animate-spin text-xs">...</span> : <Save className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startEdit(variant)}
                                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
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
            <div className="md:hidden space-y-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                    <Box className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Inventario</h3>
                </div>
                {variants?.map((variant: any) => (
                    <div key={variant.id} className="bg-card rounded-xl border shadow-sm p-4 flex flex-col gap-4">
                        {/* Header: SKU, Color, Size */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                {variant.color && (
                                    <div
                                        className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm flex-shrink-0"
                                        style={{ backgroundColor: variant.color }}
                                    />
                                )}
                                <div>
                                    <div className="font-semibold text-base">{variant.color || "Estándar"}</div>
                                    <div className="text-xs text-muted-foreground font-mono">{variant.sku}</div>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-sm px-3 py-1">
                                {variant.size || "Única"}
                            </Badge>
                        </div>

                        {/* Stock Controls */}
                        <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground uppercase">Stock Actual</span>

                            {editingId === variant.id ? (
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-full" // Larger touch target
                                        onClick={() => setEditValue(Math.max(0, editValue - 1))}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={editValue}
                                        onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                                        className="w-20 h-10 text-center text-lg font-bold"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-full"
                                        onClick={() => setEditValue(editValue + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <span className={cn("text-xl font-bold tabular-nums", variant.stock === 0 ? "text-red-500" : "text-green-600 dark:text-green-400")}>
                                    {variant.stock === 0 ? "Agotado" : variant.stock}
                                </span>
                            )}
                        </div>

                        {/* Mobile Actions */}
                        {editingId === variant.id ? (
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={cancelEdit}
                                    disabled={isSaving}
                                    className="w-full"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => handleSave(variant.id)}
                                    disabled={isSaving}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="secondary"
                                onClick={() => startEdit(variant)}
                                className="w-full"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Stock
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
