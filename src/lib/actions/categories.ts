'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type Category = {
    id: number;
    name: string;
    description?: string;
};

export async function getCategories(): Promise<{ success: boolean; data?: Category[]; error?: string }> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, description')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function createCategory(name: string): Promise<{ success: boolean; data?: Category; error?: string }> {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // Ideally check for admin role here too, assuming standard RLS or Admin client
    const adminSupabase = createAdminClient();

    // Check if exists
    const { data: existing } = await adminSupabase
        .from('categories')
        .select('id, name')
        .ilike('name', name)
        .maybeSingle();

    if (existing) {
        return { success: true, data: existing };
    }

    const { data, error } = await adminSupabase
        .from('categories')
        .insert({ name })
        .select('id, name, description')
        .single();

    if (error) {
        console.error('Error creating category:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}
