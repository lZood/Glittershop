'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type Review = {
    id: string;
    product_id: string;
    user_id: string;
    variant_color?: string;
    variant_size?: string;
    rating: number;
    title: string;
    content: string;
    created_at: string;
    is_verified_purchase: boolean;
    user?: {
        first_name: string;
        last_name: string;
    };
};

export async function getProductReviews(productId: string): Promise<{ success: boolean; data?: Review[]; error?: string }> {
    const supabase = await createClient();

    // Join with profiles if possible, or just fetch reviews
    const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
            *,
            profiles:user_id (first_name, last_name)
        `)
        .eq('product_id', productId)
        .eq('is_approved', true) // Only approved
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, error: error.message };
    }

    // Map profiles to user object
    const formattedReviews = reviews.map((r: any) => ({
        ...r,
        user: r.profiles
    }));

    return { success: true, data: formattedReviews };
}

export async function createReview(data: {
    product_id: string;
    rating: number;
    title: string;
    content: string;
    variant_color?: string;
    variant_size?: string;
}): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Debes iniciar sesión para escribir una reseña." };
    }

    // Optional: Check if verified purchase (requires Orders table check, maybe later)

    const { error } = await supabase
        .from('reviews')
        .insert({
            product_id: data.product_id,
            user_id: user.id,
            rating: data.rating,
            title: data.title,
            content: data.content,
            variant_color: data.variant_color,
            variant_size: data.variant_size,
            is_approved: true // Auto-approve for now
        });

    if (error) {
        console.error("Error creating review:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/products`); // Revalidate all products or specific slug if we had it
    return { success: true };
}

export async function getAdminProductReviews(productId: string): Promise<{ success: boolean; data?: Review[]; error?: string }> {
    const supabase = await createClient();

    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    // Actually I should verify role, but RLS handles it.
    // But wait, my RLS policy "Admins read all reviews" uses public.is_admin() which checks auth.jwt
    // So just calling supabase.from('reviews') as authenticated user should work if they are admin.

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
            *,
            profiles:user_id (first_name, last_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching admin reviews:", error);
        return { success: false, error: error.message };
    }

    const formattedReviews = reviews.map((r: any) => ({
        ...r,
        user: r.profiles
    }));

    return { success: true, data: formattedReviews };
}
