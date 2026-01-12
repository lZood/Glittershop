'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { MoreHorizontal, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { updateProductStock } from "@/lib/actions/products"; // ensuring this exists later
import { toast } from "@/hooks/use-toast";

interface InventoryCardProps {
    product: any; // Type properly later
}

export function InventoryCard({ product }: InventoryCardProps) {
    const [stock, setStock] = useState(product.stock || 0);
    const [isLoading, setIsLoading] = useState(false);

    // Main image logic
    const mainImage = product.product_images?.find((img: any) => img.is_primary)?.image_url
        || product.product_images?.[0]?.image_url
        || '/placeholder.png'; // Fallback

    // Status logic
    let statusColor = "bg-green-500";
    let statusText = "Disponible";

    if (!product.is_active) {
        statusColor = "bg-slate-400";
        statusText = "Borrador";
    } else if (stock === 0) {
        statusColor = "bg-red-500";
        statusText = "Agotado";
    } else if (stock <= 5) {
        statusColor = "bg-orange-500";
        statusText = "Stock Bajo";
    }

    const handleStockUpdate = async (newStock: number) => {
        if (newStock < 0) return;
        setStock(newStock); // Optimistic

        // Debounce or immediate? Let's do immediate but silent unless error
        try {
            setIsLoading(true);
            // We need an action that updates the PRODUCT stock, not variant. 
            // Assuming product.id is what we target.
            const res = await updateProductStock(product.id, newStock);
            if (!res.success) {
                throw new Error(res.error);
            }
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar el stock", variant: "destructive" });
            setStock(product.stock); // Revert
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex items-center p-3 gap-4 border-none shadow-sm rounded-2xl hover:shadow-md transition-all">
            {/* Image Container */}
            <div className="relative w-20 h-20 flex-shrink-0">
                <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 relative">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
                {/* Status Dot */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusColor}`}></div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-slate-900 truncate pr-2">{product.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">SKU: {product.slug?.toUpperCase() || 'N/A'}</p> {/* Using slug as pseudo-SKU if sku missing */}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 -mr-2">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/inventory/edit/${product.id}`}>Editar</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/products/${product.slug}`} target="_blank">Ver en Tienda</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-end justify-between mt-2">
                    <div className="min-w-0 pr-2">
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap ${stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {statusText}
                        </p>
                        <p className="font-bold text-pink-600 truncate">
                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.sale_price || product.price)}
                        </p>
                    </div>

                    {/* Stock Control */}
                    <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100 shrink-0">
                        <button
                            disabled={isLoading || stock <= 0}
                            onClick={() => handleStockUpdate(stock - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">{stock}</span>
                        <button
                            disabled={isLoading}
                            onClick={() => handleStockUpdate(stock + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
