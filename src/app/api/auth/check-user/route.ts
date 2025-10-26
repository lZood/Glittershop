import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // IMPORTANT: In a real-world scenario, you would use the Supabase Admin client here
    // to securely check for a user from the `auth.users` table. This is the most secure method.
    // e.g. const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserByEmail(email)
    //
    // For this implementation, we will check the public `profiles` table. 
    // This requires Row Level Security (RLS) to be properly configured to prevent email enumeration.
    // We assume RLS is set to allow authenticated reads or is otherwise secured.

    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    // `PGRST116` is the code for "No rows found", which is not an actual error in this case.
    if (error && error.code !== 'PGRST116') {
        console.error('Check user error:', error);
        // Avoid leaking detailed error messages to the client
        return NextResponse.json({ error: 'Database error while checking user' }, { status: 500 });
    }

    return NextResponse.json({ exists: !!data });

  } catch (e) {
    console.error('API route error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
