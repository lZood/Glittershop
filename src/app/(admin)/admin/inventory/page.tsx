import { createClient } from "@/lib/supabase/server";
import { InventoryClient } from "@/components/admin/inventory/inventory-client";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    const supabase = await createClient();

    // Fetch products with category and images
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            *,
            categories (name),
            product_images (image_url, is_primary),
            product_variants (id, stock, sku, color, size)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
    }

    return (
        <div className="max-w-5xl mx-auto">
            <InventoryClient products={products || []} />
        </div>
    );
}
