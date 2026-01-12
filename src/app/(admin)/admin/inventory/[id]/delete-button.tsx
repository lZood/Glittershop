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
                });
                router.push('/admin/inventory');
                router.refresh(); // Ensure the list is updated
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
                <Button variant="destructive" size="sm" disabled={isDeleting} className="h-8 md:h-9">
                    {isDeleting ? <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" /> : <Trash2 className="md:mr-2 h-3 w-3 md:h-4 md:w-4" />}
                    <span className="hidden md:inline">Eliminar</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
                        <strong> "{productName}" </strong> y todas sus variantes, imágenes y datos asociados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault(); // Prevent closing immediately to show loading state if needed
                            handleDelete();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Eliminando..." : "Sí, eliminar producto"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
