'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type Address = {
    id: string;
    user_id: string;
    full_name: string;
    street: string;
    exterior_number?: string | null;
    interior_number?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
    delivery_instructions?: string | null;
    is_default: boolean;
};

const addressSchema = z.object({
    full_name: z.string().min(1, 'El nombre es requerido'),
    street: z.string().min(1, 'La calle es requerida'),
    exterior_number: z.string().min(1, 'Número exterior requerido'), // Some might not have number, usually 'SN', but let's require text
    interior_number: z.string().optional(),
    neighborhood: z.string().min(1, 'La colonia es requerida'),
    city: z.string().min(1, 'La ciudad es requerida'),
    state: z.string().min(1, 'El estado es requerido'),
    postal_code: z.string().min(5, 'Código postal inválido').max(5, 'Código postal inválido'),
    phone: z.string().min(10, 'Teléfono debe tener 10 dígitos'),
    delivery_instructions: z.string().optional(),
    is_default: z.boolean().default(false),
    country: z.string().default('MX'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export async function getUserAddresses() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false }) // Default first
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching addresses:', error);
        return [];
    }

    return data as Address[];
}

export async function saveAddress(data: AddressFormData, id?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Debes iniciar sesión para guardar direcciones' };
    }

    const validated = addressSchema.safeParse(data);
    if (!validated.success) {
        return { error: 'Datos inválidos verificados por servidor' };
    }

    // If setting as default, unset others first
    if (validated.data.is_default) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id);
    }

    // Check if it's the first address, make it default automatically if so
    if (!validated.data.is_default && !id) {
        const { count } = await supabase
            .from('addresses')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (count === 0) {
            validated.data.is_default = true;
        }
    }

    if (id) {
        // Update existing
        const { error } = await supabase
            .from('addresses')
            .update({
                ...validated.data,
            })
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) return { error: error.message };
    } else {
        // Insert new
        const { error } = await supabase
            .from('addresses')
            .insert({
                user_id: user.id,
                ...validated.data,
            });

        if (error) return { error: error.message };
    }

    revalidatePath('/checkout');
    revalidatePath('/profile');
    return { success: true };
}

export async function deleteAddress(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'No autorizado' };

    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) return { error: error.message };

    revalidatePath('/checkout');
    return { success: true };
}
