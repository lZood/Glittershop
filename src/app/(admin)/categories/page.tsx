
'use client';
import { useState, useEffect } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import CategoryForm from './category-form';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar las categorías.', variant: 'destructive' });
    } else {
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    const { error } = await supabase.from('categories').delete().eq('id', categoryToDelete.id);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la categoría.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Categoría eliminada.' });
      fetchCategories(); // Refresh list
    }
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Categorías</CardTitle>
                <CardDescription>
                  Gestiona las categorías de tus productos.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-1" onClick={() => { setSelectedCategory(null); setIsFormOpen(true); }}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Añadir Categoría
                </span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(category)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(category)} className="text-red-600">
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <CategoryForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        category={selectedCategory}
        onSave={handleFormSave}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría
              "{categoryToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
