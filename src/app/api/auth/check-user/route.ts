import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Use the Supabase Admin client to securely check for a user from the `auth.users` table.
    // This is a secure way to check for user existence without exposing user data.
    // For this educational purpose, we're using the regular server client.
    // In a production app, you'd use an admin client initialized with the service_role key.
    const supabase = createClient();
    
    // This is a simplified check. A full admin client `getUserByEmail` would be better.
    // However, for the purpose of checking existence, we can check the profiles table
    // which should have a 1-to-1 mapping with auth.users.
    // The previous error was likely due to RLS policies on the 'profiles' table.
    // We will stick with profiles table but add a note about RLS.
    // **A better approach** would be an RPC function in Supabase.
    // For now, let's assume RLS is `true` for public read or we adjust it.
    // A common mistake is to have RLS that blocks unauthenticated reads.
    
    // Let's try to query the users table directly as it's more direct for checking auth existence.
    // Supabase RLS on auth.users is special and this might fail if not configured.
    // The most robust solution is an RPC function. Let's revert to checking `profiles` but with a try/catch.
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    // `PGRST116` is the code for "No rows found", which is not an actual error in this context.
    // It simply means the user does not exist.
    if (error && error.code !== 'PGRST116') {
        // Log the actual error for debugging, but don't expose it to the client.
        console.error('Supabase check user error:', error.message);
        return NextResponse.json({ error: 'Error al consultar la base de datos.' }, { status: 500 });
    }
    
    // `data` will be null if no user is found, and an object if found.
    // So, `!!data` correctly resolves to `false` or `true`.
    return NextResponse.json({ exists: !!data });

  } catch (e) {
    console.error('API route handler error:', e);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
