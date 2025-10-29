
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  category: Category | null;
  onSave: () => void;
}

export default function CategoryForm({ isOpen, setIsOpen, category, onSave }: CategoryFormProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [category, form, isOpen]);

  const handleSubmit = async (values: CategoryFormValues) => {
    let error;
    if (category) {
      // Update existing category
      ({ error } = await supabase.from('categories').update(values).eq('id', category.id));
    } else {
      // Create new category
      ({ error } = await supabase.from('categories').insert(values));
    }

    if (error) {
      toast({
        title: 'Error',
        description: `No se pudo guardar la categoría: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Éxito',
        description: `Categoría ${category ? 'actualizada' : 'creada'} exitosamente.`,
      });
      onSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Editar Categoría' : 'Añadir Nueva Categoría'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
