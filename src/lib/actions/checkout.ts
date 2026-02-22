'use server';

import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { CartItem } from '@/lib/cart-context';

export async function createPaymentIntent(items: CartItem[], guestEmail?: string) {
    if (!items || items.length === 0) {
        throw new Error('El carrito está vacío.');
    }

    const supabase = await createClient();

    // Validate stock for each item securely on the backend
    for (const item of items) {
        // Evaluate main product stock
        const { data: productData, error: productError } = await supabase
            .from('products')
            .select('stock, name')
            .eq('id', item.product.id)
            .single();

        if (productError || !productData) {
            throw new Error(`Producto ${item.product.name} no encontrado en la base de datos.`);
        }

        if (productData.stock < item.quantity) {
            throw new Error(`Stock insuficiente para ${item.product.name}. Quedan ${productData.stock} disponibles.`);
        }

        // Evaluate variant stock if applicable
        if (item.color || item.size) {
            let variantQuery = supabase.from('product_variants').select('stock').eq('product_id', item.product.id);

            if (item.color) variantQuery = variantQuery.eq('color', item.color);
            else variantQuery = variantQuery.is('color', null);

            if (item.size) variantQuery = variantQuery.eq('size', item.size);
            else variantQuery = variantQuery.is('size', null);

            const { data: variantData, error: variantError } = await variantQuery.maybeSingle();

            if (variantData && variantData.stock < item.quantity) {
                const variantDesc = [item.color, item.size].filter(Boolean).join(' / ');
                throw new Error(`Stock insuficiente para ${item.product.name} (${variantDesc}). Quedan ${variantData.stock} disponibles.`);
            }
        }
    }

    // Calculate total securely on server to prevent tampering
    let subtotal = 0;
    for (const item of items) {
        subtotal += item.product.price * item.quantity;
    }

    // Exact logic from frontend
    const freeShippingThreshold = 800;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shippingCost = isFreeShipping ? 0 : 150;
    const totalAmount = subtotal + shippingCost;

    // Stripe requires integer amounts in cents
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'mxn',
        metadata: {
            guestEmail: guestEmail || '',
        }
    });

    return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
    };
}

export async function processSuccessfulOrder(
    paymentIntentId: string,
    items: CartItem[],
    address: any,
    guestEmail?: string
) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') {
        throw new Error('El pago aún no ha sido confirmado por Stripe.');
    }

    let subtotal = 0;
    for (const item of items) {
        subtotal += item.product.price * item.quantity;
    }
    const freeShippingThreshold = 800;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shippingCost = isFreeShipping ? 0 : 150;
    const totalAmount = subtotal + shippingCost;

    // Build the items payload for the RPC
    const itemsPayload = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        variant_color: item.color || null,
        variant_size: item.size || null
    }));

    // Call RPC to securely insert order and reduce stock
    const { data: orderId, error: orderError } = await supabase.rpc('create_order_and_items', {
        p_user_id: session?.user?.id || null,
        p_guest_email: session?.user?.email || guestEmail || null,
        p_total_amount: totalAmount,
        p_shipping_address: address,
        p_items: itemsPayload
    });

    if (orderError) {
        console.error('Error procesando la orden en DB:', orderError);
        throw new Error('Error al guardar la orden. Contacte soporte con su ID de pago: ' + paymentIntentId);
    }

    return { success: true, orderId };
}
