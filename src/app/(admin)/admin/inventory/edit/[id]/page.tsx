import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { ProductForm } from '@/components/admin/inventory/product-form';
import { getCategories } from "@/lib/actions/categories";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const { data: categories } = await getCategories();

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (name),
            product_variants (*),
            product_images (*)
        `)
        .eq('id', id)
        .single();

    if (error || !product) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <ProductForm initialData={product} availableCategories={categories || []} />
        </div>
    );
}
