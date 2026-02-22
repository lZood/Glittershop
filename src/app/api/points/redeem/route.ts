import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { optionId } = await request.json();

        // Get current points
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('glitter_points')
            .eq('id', session.user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const currentPoints = profile.glitter_points || 0;

        const REDEMPTION_OPTIONS: Record<string, { points: number; name: string; discount: string; type: string }> = {
            'pts-500': { points: 500, name: 'Cupón de $50', discount: '$50.00', type: 'amount' },
            'pts-1000': { points: 1000, name: 'Cupón de $100', discount: '$100.00', type: 'amount' },
            'pts-2000': { points: 2000, name: 'Glitter 10% OFF', discount: '10%', type: 'percentage' },
            'pts-5000': { points: 5000, name: 'Glitter 25% OFF', discount: '25%', type: 'percentage' },
        };

        const option = REDEMPTION_OPTIONS[optionId];

        if (!option) {
            return NextResponse.json({ error: 'Opción de canje inválida' }, { status: 400 });
        }

        if (currentPoints < option.points) {
            return NextResponse.json({ error: 'Puntos insuficientes' }, { status: 400 });
        }

        // Deduct points
        const { error: deductError } = await supabase
            .from('profiles')
            .update({ glitter_points: currentPoints - option.points })
            .eq('id', session.user.id);

        if (deductError) {
            throw new Error('Error al deducir puntos');
        }

        // Generate a random coupon code
        const code = `GLTR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // In a real app, we would save this coupon to a 'user_coupons' table or Stripe
        // For now, we return it to be added to the local state in the profile

        return NextResponse.json({
            success: true,
            coupon: {
                code,
                name: option.name,
                discount: option.discount,
                type: option.type,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            },
            remainingPoints: currentPoints - option.points
        });

    } catch (error: any) {
        console.error('Redemption error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
