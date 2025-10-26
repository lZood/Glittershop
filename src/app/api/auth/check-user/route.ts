import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// This is a placeholder. For a real implementation, you would need admin privileges
// to check user existence without trying to log in.
// We'll simulate this with a client-side check on the 'profiles' table for now,
// but this API route structure is the proper, secure way to do it.

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // IMPORTANT: In a real-world scenario, you would use the Supabase Admin client here
    // to securely check for a user from the `auth.users` table.
    // const supabaseAdmin = createClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
    // const { data, error } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    //
    // Since we don't have the admin SDK configured in this environment,
    // we will check the public `profiles` table. This is NOT secure if your RLS
    // policies don't restrict access, as it can lead to email enumeration.
    // This is a temporary workaround for the prompt's requested flow.

    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Check user error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ exists: !!data });

  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
