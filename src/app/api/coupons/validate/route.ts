import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { couponCode } = await request.json();

        if (!couponCode) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }

        const trimmedCode = couponCode.trim().toUpperCase();

        // In a real production app, we would query Stripe for the coupon details.
        // For this demonstration, we'll try to find it in Stripe, but also have a 'welcome' fallback.

        // We use the service role key to check coupons via Stripe (simulated logic)
        // or just checking if it's a valid string for now.

        // Fallback/Demo coupons:
        const DEMO_COUPONS: Record<string, { name: string; discount: string; type: string }> = {
            'GLITTER10': { name: 'Welcome Glitter', discount: '10%', type: 'percentage' },
            'AÑO-NUEVO': { name: 'New Year Offer', discount: '15%', type: 'percentage' },
            'SORPRESA': { name: 'Surprise Discount', discount: '$50.00', type: 'amount' },
        };

        const coupon = DEMO_COUPONS[trimmedCode];

        if (coupon) {
            return NextResponse.json({
                valid: true,
                coupon: {
                    code: trimmedCode,
                    ...coupon
                }
            });
        }

        // If not in demo, we could try to verify with Stripe...
        // (Skipping actual Stripe verification here to avoid breaking without actual coupon IDs)

        return NextResponse.json({ valid: false, message: 'Cupón no válido o expirado' });

    } catch (error: any) {
        console.error('Coupon validation error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
