'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/products';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteProductButtonProps {
    productId: string;
    productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteProduct(productId);
            if (result.success) {
                toast({
                    title: "Producto eliminado",
                    description: `El producto "${productName}" ha sido eliminado correctamente.`,
                    className: "bg-background border-border/50 rounded-none uppercase tracking-widest font-bold"
                });
                router.push('/admin/inventory');
                router.refresh();
            } else {
                toast({
                    title: "Error",
                    description: result.error || "No se pudo eliminar el producto.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error inesperado",
                description: "Ocurrió un error al intentar eliminar.",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isDeleting} className="h-10 rounded-none border border-red-200 bg-red-50/10 hover:bg-red-500 hover:text-white text-red-600 transition-all font-bold uppercase tracking-[0.1em] text-[10px]">
                    {isDeleting ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-2 h-3.5 w-3.5" />}
                    Eliminar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-none border-border/50">
                <AlertDialogHeader>
                    <AlertDialogTitle className="uppercase tracking-[0.1em] font-bold">¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
                        <strong className="text-foreground"> "{productName}" </strong> y todas sus variantes, imágenes y datos asociados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel disabled={isDeleting} className="rounded-none uppercase tracking-[0.1em] text-[10px] font-bold">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-none uppercase tracking-[0.1em] text-[10px] font-bold h-10 px-6"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Eliminando..." : "Sí, eliminar producto"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
