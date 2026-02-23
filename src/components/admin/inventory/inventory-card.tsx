'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    AlertCircle,
    ArrowUpRight,
    Box,
    CheckCircle2,
    Edit,
    Eye,
    FileText,
    Loader2,
    MoreHorizontal,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { deleteProduct, toggleProductStatus } from '@/lib/actions/products';
import { useToast } from '@/hooks/use-toast';

interface InventoryCardProps {
    product: any;
    mode?: 'list' | 'grid';
}

export function InventoryCard({ product, mode = 'list' }: InventoryCardProps) {
    const router = useRouter();
    const { toast } = useToast();
    const stock = product.stock || 0;
    const [isActive, setIsActive] = useState(product.is_active);
    const [isToggling, setIsToggling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const mainImage =
        product.product_images?.find((img: any) => img.is_primary)?.image_url ||
        product.product_images?.[0]?.image_url ||
        '/placeholder.png';

    let statusText = 'Disponible';
    if (!isActive) statusText = 'Borrador';
    else if (stock === 0) statusText = 'Agotado';
    else if (stock <= 5) statusText = 'Stock Bajo';

    const handleToggleVisibility = async (e: any) => {
        e.stopPropagation();
        setIsToggling(true);
        const newStatus = !isActive;

        try {
            const result = await toggleProductStatus(product.id, newStatus);
            if (result.success) {
                setIsActive(newStatus);
                toast({
                    title: newStatus ? 'Producto visible' : 'Producto oculto',
                    description: newStatus
                        ? `"${product.name}" ahora es visible en la tienda.`
                        : `"${product.name}" ya no aparece en la tienda.`,
                });
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        } catch {
            toast({ title: 'Error', description: 'No se pudo cambiar la visibilidad.', variant: 'destructive' });
        } finally {
            setIsToggling(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteProduct(product.id);
            if (result.success) {
                toast({
                    title: 'Producto eliminado',
                    description: `"${product.name}" fue eliminado correctamente.`,
                });
                router.refresh();
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        } catch {
            toast({ title: 'Error', description: 'No se pudo eliminar el producto.', variant: 'destructive' });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);

    const deleteDialog = (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent className="rounded-none bg-card border-border/50 shadow-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="uppercase tracking-widest font-bold text-lg">¿Confirmar Eliminación?</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs uppercase tracking-wider leading-relaxed py-4 opacity-70">
                        Estás a punto de borrar "{product.name}". Esta acción es irreversible y eliminará el producto de la base de datos y de Stripe.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none uppercase text-[10px] font-bold tracking-widest h-11 border-border/50">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-none uppercase text-[10px] font-bold tracking-widest h-11"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar Permanentemente'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    if (mode === 'grid') {
        return (
            <>
                <Card
                    onClick={() => router.push(`/admin/inventory/${product.id}`)}
                    className="group border border-border/50 bg-card rounded-none overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-brand/40 active:scale-[0.98] relative flex flex-col h-full"
                >
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {!isActive ? (
                            <div className="bg-slate-500/90 text-white p-1 backdrop-blur-sm">
                                <FileText className="w-3 h-3" />
                            </div>
                        ) : stock <= 5 ? (
                            <div className="bg-amber-500/90 text-white p-1 backdrop-blur-sm">
                                <AlertCircle className="w-3 h-3" />
                            </div>
                        ) : null}
                    </div>

                    <div className="absolute top-2 right-2 z-10">
                        <div
                            className={cn(
                                'px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest backdrop-blur-sm border',
                                stock <= 5 ? 'bg-red-500 text-white border-red-400' : 'bg-black/50 text-white border-white/20'
                            )}
                        >
                            STK: {stock}
                        </div>
                    </div>

                    <div className="relative aspect-square w-full overflow-hidden bg-secondary/30">
                        <Image src={mainImage} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ArrowUpRight className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between gap-1">
                        <div>
                            <span className="text-[7px] font-bold text-brand uppercase tracking-[0.2em] block mb-0.5">
                                {product.categories?.name || 'General'}
                            </span>
                            <h3 className="text-[10px] sm:text-xs font-bold text-foreground uppercase tracking-tight leading-tight group-hover:text-brand transition-colors line-clamp-2">
                                {product.name}
                            </h3>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                                <span className="text-xs sm:text-base font-bold text-foreground">{formatCurrency(product.price)}</span>
                                {product.original_price && product.original_price > product.price && (
                                    <span className="text-[8px] text-muted-foreground line-through opacity-50">
                                        {formatCurrency(product.original_price)}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-1 mt-1 border-t border-border/30 pt-2" onClick={(e) => e.stopPropagation()}>
                                <Link href={`/admin/inventory/edit/${product.id}`} className="flex-1">
                                    <Button variant="ghost" size="sm" className="w-full h-8 rounded-none hover:bg-brand hover:text-white transition-all p-0">
                                        <Edit className="w-3 h-3" />
                                    </Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="w-8 h-8 rounded-none hover:bg-secondary" onClick={(e) => e.stopPropagation()}>
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-none font-bold uppercase tracking-widest text-[9px] p-1 w-44">
                                        <DropdownMenuItem className="p-2" onClick={handleToggleVisibility}>
                                            {isToggling ? 'Cargando...' : isActive ? 'Ocultar' : 'Publicar'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="p-2 text-red-600" onClick={() => setShowDeleteDialog(true)}>
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </Card>
                {deleteDialog}
            </>
        );
    }

    return (
        <>
            <Card
                onClick={() => router.push(`/admin/inventory/${product.id}`)}
                className="group border border-border/50 dark:border-white/10 bg-card rounded-none transition-all duration-300 hover:shadow-2xl hover:shadow-brand/20 hover:border-brand/40 overflow-hidden active:scale-[0.98]"
            >
                <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border/30 dark:border-white/5 bg-secondary/10 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none truncate shrink-0 max-w-[100px] sm:max-w-none">
                            {product.slug?.toUpperCase() || 'S/N'}
                        </span>
                        <div className="h-3 w-px bg-border/50 shrink-0" />

                        <div
                            className={cn(
                                'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tight',
                                !isActive
                                    ? 'text-slate-500 bg-slate-100'
                                    : stock === 0
                                    ? 'text-red-600 bg-red-100'
                                    : stock <= 5
                                    ? 'text-amber-600 bg-amber-100'
                                    : 'text-green-600 bg-green-100'
                            )}
                        >
                            {!isActive ? (
                                <FileText className="w-2.5 h-2.5" />
                            ) : stock === 0 ? (
                                <XCircle className="w-2.5 h-2.5" />
                            ) : stock <= 5 ? (
                                <AlertCircle className="w-2.5 h-2.5" />
                            ) : (
                                <CheckCircle2 className="w-2.5 h-2.5" />
                            )}
                            <span className="hidden xs:inline whitespace-nowrap">{statusText}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <Box className="w-3 h-3 text-muted-foreground" strokeWidth={2.5} />
                        <span className={cn('text-[9px] font-bold uppercase tracking-wider whitespace-nowrap', stock <= 5 ? 'text-orange-500' : 'text-muted-foreground')}>
                            STK: {stock}
                        </span>
                    </div>
                </div>

                <div className="p-4 sm:p-6 flex items-start gap-4 sm:gap-6">
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 bg-secondary/30 dark:bg-white/5 border border-border/50 overflow-hidden group-hover:border-brand/30 transition-colors">
                        <Image src={mainImage} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ArrowUpRight className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[5rem] sm:min-h-[7rem]">
                        <div className="space-y-1 mb-2">
                            <span className="text-[8px] sm:text-[9px] font-bold text-brand uppercase tracking-[0.2em] block">
                                {product.categories?.name || 'General'}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-foreground uppercase tracking-tight leading-tight group-hover:text-brand transition-colors break-words overflow-hidden">
                                {product.name}
                            </h3>
                            {product.original_price && product.original_price > product.price && (
                                <div className="mt-1">
                                    <span className="inline-block text-[8px] font-bold text-red-500 bg-red-500/10 px-1 border border-red-500/20 uppercase tracking-widest">
                                        Oferta -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-baseline gap-2 mt-auto">
                            <span className="text-lg sm:text-2xl font-bold text-foreground tracking-tighter">{formatCurrency(product.price)}</span>
                            {product.original_price && product.original_price > product.price && (
                                <span className="text-[10px] sm:text-xs text-muted-foreground line-through opacity-50">
                                    {formatCurrency(product.original_price)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex border-t border-border/30 dark:border-white/5 h-12 sm:h-14" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/admin/inventory/${product.id}`} className="flex-1 border-r border-border/30 dark:border-white/5">
                        <Button variant="ghost" className="w-full h-full rounded-none hover:bg-brand/10 dark:hover:bg-white/5 active:bg-brand/20 text-foreground group/btn transition-all">
                            <Eye className="w-4 h-4 sm:mr-2 text-brand" />
                            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">Detalles</span>
                        </Button>
                    </Link>

                    <Link href={`/admin/inventory/edit/${product.id}`} className="flex-1 border-r border-border/30 dark:border-white/5">
                        <Button variant="ghost" className="w-full h-full rounded-none hover:bg-brand hover:text-white active:bg-brand/90 transition-all">
                            <Edit className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">Editar</span>
                        </Button>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-12 sm:w-16 h-full rounded-none hover:bg-secondary/40 dark:hover:bg-white/5 active:bg-secondary/60"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="rounded-none font-bold uppercase tracking-widest text-[10px] bg-card border-border/50 shadow-2xl p-1 w-52"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuItem className="p-3 focus:bg-brand focus:text-white" onClick={handleToggleVisibility}>
                                {isToggling ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : isActive ? 'Ocultar de la tienda' : 'Publicar en tienda'}
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="p-3 focus:bg-brand focus:text-white">
                                <Link href={`/products/${product.slug}`} target="_blank">
                                    Vista Previa Tienda
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/30" />
                            <DropdownMenuItem className="p-3 text-red-600 focus:bg-red-500 focus:text-white" onClick={() => setShowDeleteDialog(true)}>
                                Eliminar Producto
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Card>
            {deleteDialog}
        </>
    );
}
