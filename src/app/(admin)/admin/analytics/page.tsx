import { createClient } from "@/lib/supabase/server";
import { AnalyticsClient } from "./analytics-client";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // Fetch all orders for deep analysis (last 6 months or similar)
    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                product:products (
                    name,
                    category
                )
            )
        `)
        .order('created_at', { ascending: false });

    // Fetch total products for inventory stats
    const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    // Fetch profiles for customer analysis
    const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at');

    return (
        <AnalyticsClient
            orders={orders || []}
            totalProducts={totalProducts || 0}
            customerCreationDates={profiles?.map(p => p.created_at) || []}
        />
    );
}
