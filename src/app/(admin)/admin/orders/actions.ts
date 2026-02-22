'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function getAllOrdersForAdmin() {
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
            id, 
            total_amount, 
            status, 
            created_at, 
            shipping_address,
            guest_email,
            order_items (
                quantity
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error in getAllOrdersForAdmin:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function getOrderDetails(orderId: number) {
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                product:products (
                    id, name, stock, price,
                    product_images ( image_url )
                )
            )
        `)
        .eq('id', orderId)
        .single();

    if (error) {
        console.error('Error in getOrderDetails:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function updateOrderStatus(orderId: number, status: string, trackingNumber?: string) {
    const supabaseAdmin = createAdminClient();

    const updateData: any = { status };
    if (trackingNumber !== undefined) {
        updateData.tracking_number = trackingNumber;
    }

    const { error } = await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

    if (error) {
        console.error('Error in updateOrderStatus:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function updateOrderTracking(orderId: number, trackingNumber: string) {
    const supabaseAdmin = createAdminClient();
    const { data } = await supabaseAdmin.from('orders').select('shipping_address').eq('id', orderId).single();
    if (!data) return { success: false, error: 'Order not found' };

    let address = data.shipping_address;
    if (typeof address === 'string') {
        try { address = JSON.parse(address); } catch (e) { }
    }
    if (typeof address !== 'object' || !address) address = {};
    (address as any).tracking_number = trackingNumber;

    const { error } = await supabaseAdmin.from('orders').update({ shipping_address: address, status: 'Enviado' }).eq('id', orderId);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
