'use server';

import { createAdminClient } from "@/lib/supabase/admin";

// Basic environment variables for Skydropx
const SKYDROPX_API_URL = process.env.SKYDROPX_API_URL || "https://sb-pro.skydropx.com/api/v1";
// Client ID / Secret OR plain token if available
const SKYDROPX_API_TOKEN = process.env.SKYDROPX_API_TOKEN;
const SKYDROPX_CLIENT_ID = process.env.SKYDROPX_CLIENT_ID;
const SKYDROPX_CLIENT_SECRET = process.env.SKYDROPX_CLIENT_SECRET;

// Fixed sender address for Glittershop
const DEFAULT_SENDER = {
    name: "Glittershop HQ",
    street1: "Av. Ficticia 123",
    zip: "64000",
    city: "Monterrey",
    province: "Nuevo León",
    country: "MX",
    phone: "8180000000",
    email: "ventas@glittershop.com"
};

/**
 * Helper strictly to get an authenticated fetch header for Skydropx
 */
async function getSkydropxHeaders() {
    // If you have a direct Token, use it
    if (SKYDROPX_API_TOKEN) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SKYDROPX_API_TOKEN}`
        };
    }

    // Otherwise, generate oauth via client credentials
    if (!SKYDROPX_CLIENT_ID || !SKYDROPX_CLIENT_SECRET) {
        throw new Error("Missing Skydropx credentials in .env");
    }

    const authRes = await fetch(`${SKYDROPX_API_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: SKYDROPX_CLIENT_ID,
            client_secret: SKYDROPX_CLIENT_SECRET,
            grant_type: "client_credentials"
        })
    });

    if (!authRes.ok) throw new Error("Could not authenticate with Skydropx Oauth");
    const authData = await authRes.json();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`
    };
}

/**
 * 1. Create Quotation and fetch initial rates.
 * Since quotes resolve progressively, we may loop until "is_completed" is true.
 */
export async function createSkydropxQuotation(
    orderId: number,
    packageDetails: { weight: number, length: number, width: number, height: number },
    senderAddress?: any
) {
    try {
        const adminSupabase = createAdminClient();
        const { data: order } = await adminSupabase.from('orders').select('shipping_address').eq('id', orderId).single();
        if (!order) return { success: false, error: 'Order not found' };

        let address = order.shipping_address;
        if (typeof address === 'string') {
            try { address = JSON.parse(address); } catch (e) { }
        }

        if (!address?.postal_code || !address?.state || !address?.city) {
            return { success: false, error: 'La dirección del cliente está incompleta (falta CP, Estado o Ciudad).' };
        }

        const headers = await getSkydropxHeaders();
        const sender = senderAddress || DEFAULT_SENDER;

        const payload = {
            quotation: {
                order_id: String(orderId),
                address_from: {
                    country_code: "MX",
                    postal_code: sender.zip,
                    area_level1: sender.province,
                    area_level2: sender.city,
                    area_level3: sender.city
                },
                address_to: {
                    country_code: "MX",
                    postal_code: address.postal_code,
                    area_level1: address.state,
                    area_level2: address.city,
                    area_level3: address.neighborhood || address.city
                },
                parcels: [
                    {
                        weight: packageDetails.weight,
                        length: packageDetails.length,
                        width: packageDetails.width,
                        height: packageDetails.height
                    }
                ]
            }
        };

        console.log("Skydropx Quotation Request Payload:", JSON.stringify(payload, null, 2));

        const quoteRes = await fetch(`${SKYDROPX_API_URL}/quotations`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!quoteRes.ok) {
            const err = await quoteRes.text();
            console.error('Skydropx Quote Error [POST /quotations]:', err);
            return { success: false, error: 'Skydropx Quote Creation Failed.' };
        }

        const quoteData = await quoteRes.json();
        const quotationId = quoteData.data?.id || quoteData.id;

        console.log("Skydropx Quotation Created. ID:", quotationId);

        // Poll for rates until complete (max 6 seconds to avoid Vercel timeouts)
        let isCompleted = quoteData.data?.attributes?.is_completed || quoteData.is_completed;
        let rates: any[] = [];
        let attempts = 0;

        while (!isCompleted && attempts < 3) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;

            console.log(`Polling Skydropx... Attempt ${attempts}`);

            const statusRes = await fetch(`${SKYDROPX_API_URL}/quotations/${quotationId}`, {
                method: 'GET',
                headers
            });

            if (statusRes.ok) {
                const statusData = await statusRes.json();

                console.log(`Skydropx Get Quotation Response:`, JSON.stringify(statusData, null, 2));

                isCompleted = statusData.data?.attributes?.is_completed || statusData.is_completed;
                // Skydropx often returns the rates in an "included" object array inside JSON:API spec
                let extractedRates = [];
                if (statusData.included) {
                    extractedRates = statusData.included.filter((inc: any) => inc.type === 'rates');
                } else if (statusData.rates) {
                    extractedRates = statusData.rates;
                } else if (statusData.data?.attributes?.rates) {
                    extractedRates = statusData.data.attributes.rates;
                }
                rates = extractedRates.filter((r: any) => {
                    const rObj = r.attributes || r;
                    return rObj.success !== false;
                });
            } else {
                console.error("Skydropx Polling Error:", await statusRes.text());
            }
        }

        // Return extracted rates along with the quotation UI
        return { success: true, quotationId, rates };

    } catch (error: any) {
        console.error('Error in createSkydropxQuotation:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 2. Build shipment with a selected rate
 */
export async function createSkydropxShipment(
    orderId: number,
    quotationId: string,
    rateId: string,
    senderAddress?: any
) {
    try {
        const adminSupabase = createAdminClient();
        const { data: order } = await adminSupabase.from('orders').select('shipping_address, total_amount, guest_email').eq('id', orderId).single();
        if (!order) return { success: false, error: 'Order not found' };

        let address = order.shipping_address;
        if (typeof address === 'string') {
            try { address = JSON.parse(address); } catch (e) { }
        }

        const headers = await getSkydropxHeaders();
        const sender = senderAddress || DEFAULT_SENDER;

        const payload = {
            shipment: {
                quotation_id: quotationId,
                rate_id: rateId,
                format: "pdf",
                address_from: {
                    name: sender.name,
                    street1: sender.street1,
                    phone: sender.phone,
                    email: sender.email,
                    zip: sender.zip,
                    city: sender.city,
                    province: sender.province,
                    country: "MX",
                    reference: "HQ"
                },
                address_to: {
                    name: address.full_name || 'Cliente',
                    street1: `${address.street} ${address.exterior_number} ${address.interior_number || ''}`.trim(),
                    street2: address.neighborhood || '',
                    city: address.city,
                    province: address.state,
                    country: "MX",
                    zip: address.postal_code,
                    phone: address.phone || '0000000000',
                    email: order.guest_email || 'correo@ejemplo.com',
                    reference: address.delivery_instructions || 'Sin referencia'
                },
                packages: [
                    {
                        package_number: "1",
                        package_protected: false,
                        consignment_note: "53102400", // Standard clothing/goods classification
                        package_type: "4G" // 4G means Box (carton)
                    }
                ]
            }
        };

        const shipRes = await fetch(`${SKYDROPX_API_URL}/shipments`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!shipRes.ok) {
            const err = await shipRes.text();
            console.error('Skydropx Shipment Error:', err);
            return { success: false, error: 'Skydropx Shipment Failed: ' + err };
        }

        const shipData = await shipRes.json();

        // Extract tracking number and label from shipData
        // (Depends strictly on Skydropx JSON spec. Usually inside attributes or links)
        const trackingNumber = shipData?.data?.attributes?.tracking_number || shipData?.tracking_number;
        const labelUrl = shipData?.data?.attributes?.label_url || shipData?.label_url;

        // Update Order DB
        address.tracking_number = trackingNumber || 'GENERADA';
        address.label_url = labelUrl;
        address.skydropx_shipment_id = shipData?.data?.id || shipData?.id;

        const { error: updateError } = await adminSupabase
            .from('orders')
            .update({ shipping_address: address, status: 'Enviado' })
            .eq('id', orderId);

        if (updateError) throw new Error(updateError.message);

        return { success: true, trackingNumber, labelUrl };

    } catch (error: any) {
        console.error('Error in createSkydropxShipment:', error);
        return { success: false, error: error.message };
    }
}
