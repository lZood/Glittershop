'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Admin client bypasses RLS. We'll use this securely since we manually verify session.user.id.
const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserOrders() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return [];

    const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                product:products (
                    *,
                    product_images (*)
                )
            )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data;
}

export async function getOrderById(id: string) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return null;

    const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                product:products (
                    *,
                    product_images (*)
                )
            )
        `)
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return null;
    }
    return data;
}
