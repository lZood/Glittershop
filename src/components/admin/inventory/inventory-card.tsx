'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Box, Eye, Edit, Trash2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct, toggleProductStatus } from "@/lib/actions/products";
import { useToast } from "@/hooks/use-toast";

interface InventoryCardProps {
    product: any;
}

export function InventoryCard({ product }: InventoryCardProps) {
    const router = useRouter();
    const { toast } = useToast();
    const stock = product.stock || 0;
    const [isActive, setIsActive] = useState(product.is_active);
    const [isToggling, setIsToggling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Main image logic
    const mainImage = product.product_images?.find((img: any) => img.is_primary)?.image_url
        || product.product_images?.[0]?.image_url
        || '/placeholder.png';

    // Status logic
    let statusColor = "bg-green-500";
    let statusText = "Disponible";

    if (!isActive) {
        statusColor = "bg-slate-400";
        statusText = "Borrador";
    } else if (stock === 0) {
        statusColor = "bg-red-500";
        statusText = "Agotado";
    } else if (stock <= 5) {
        statusColor = "bg-orange-500";
        statusText = "Stock Bajo";
    }

    // Variant stock logic
    const lowStockVariants = product.product_variants?.filter((v: any) => v.stock <= 3) || [];
    const hasLowStockVariants = lowStockVariants.length > 0;

    // Toggle visibility handler
    const handleToggleVisibility = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsToggling(true);
        const newStatus = !isActive;
        try {
            const result = await toggleProductStatus(product.id, newStatus);
            if (result.success) {
                setIsActive(newStatus);
                toast({
                    title: newStatus ? "Producto visible" : "Producto oculto",
                    description: newStatus
                        ? `"${product.name}" ahora es visible en la tienda y en Stripe.`
                        : `"${product.name}" ya no aparece en la tienda ni en Stripe.`,
                });
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "No se pudo cambiar la visibilidad.", variant: "destructive" });
        } finally {
            setIsToggling(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteProduct(product.id);
            if (result.success) {
                toast({
                    title: "Producto eliminado",
                    description: `"${product.name}" fue eliminado de la base de datos y archivado en Stripe.`,
                });
                router.refresh();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "No se pudo eliminar el producto.", variant: "destructive" });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    return (
        <>
            <Card
                onClick={() => router.push(`/admin/inventory/${product.id}`)}
                className="flex items-center p-3 gap-3 border-none shadow-sm rounded-2xl hover:shadow-md transition-all active:scale-[0.99] w-full max-w-full overflow-hidden relative cursor-pointer"
            >
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
                        <div className="min-w-0 pr-1">
                            <h3 className="font-bold text-slate-900 truncate text-sm sm:text-base">{product.name}</h3>
                            <p className="text-[10px] text-slate-400 font-mono truncate">SKU: {product.slug?.toUpperCase() || 'N/A'}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Visibility Toggle */}
                            <div
                                className="flex items-center"
                                onClick={(e) => e.stopPropagation()}
                                title={isActive ? "Visible en tienda" : "Oculto de tienda"}
                            >
                                <Switch
                                    checked={isActive}
                                    onCheckedChange={() => {
                                        // We use a synthetic click event wrapper here
                                        const fakeEvent = { stopPropagation: () => { } } as React.MouseEvent;
                                        handleToggleVisibility(fakeEvent);
                                    }}
                                    disabled={isToggling}
                                    className="scale-75 data-[state=checked]:bg-green-500"
                                />
                            </div>

                            {/* Dropdown Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 -mr-2 flex-shrink-0"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/inventory/${product.id}`} className="flex items-center gap-2">
                                            <Eye className="h-4 w-4" />
                                            Ver detalles
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/inventory/edit/${product.id}`} className="flex items-center gap-2">
                                            <Edit className="h-4 w-4" />
                                            Editar
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/products/${product.slug}`} target="_blank" className="flex items-center gap-2">
                                            <ExternalLink className="h-4 w-4" />
                                            Ver en Tienda
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2"
                                        onClick={() => setShowDeleteDialog(true)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="flex items-end justify-between mt-1.5">
                        <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${stock === 0 ? 'text-red-500' : isActive ? 'text-green-600' : 'text-slate-400'}`}>
                                    {statusText}
                                </p>
                                {/* Variant Warning */}
                                {hasLowStockVariants && stock > 0 && (
                                    <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[9px] font-bold animate-pulse">
                                        <span>⚠ {lowStockVariants.length} var. bajos</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <p className="font-bold text-[#b47331] truncate">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.price)}
                                </p>
                                {product.original_price && product.original_price > product.price && (
                                    <>
                                        <span className="text-[10px] text-slate-400 line-through">
                                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.original_price)}
                                        </span>
                                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 rounded">
                                            -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Simple Stock Display */}
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 shrink-0">
                            <Box className="w-3 h-3 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">Stock: {stock}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar "{product.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente el producto de la base de datos.
                            El producto también será <strong>archivado en Stripe</strong> (marcado como inactivo)
                            para mantener el historial de pagos y pedidos.
                            <br /><br />
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                "Sí, eliminar producto"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
