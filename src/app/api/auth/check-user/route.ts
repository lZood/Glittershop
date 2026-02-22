import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const trimmedEmail = email.trim();
  console.log('[DEBUG] check-user: Incoming email:', email);
  console.log('[DEBUG] check-user: Trimmed email:', trimmedEmail);

  // We use the service role key to bypass RLS, because anonymous users
  // cannot read the 'profiles' table by default.
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    console.log('[DEBUG] check-user: Querying profiles table (with service role)...');
    const { data, error, count } = await supabase
      .from('profiles')
      .select('id, email', { count: 'exact' })
      .ilike('email', trimmedEmail);

    if (error) {
      console.error('[DEBUG] check-user: Supabase error:', error);
      throw error;
    }

    console.log('[DEBUG] check-user: Query result:', {
      count,
      found: !!data?.length,
      data: data
    });

    const exists = count !== null && count > 0;
    return NextResponse.json({ exists });

  } catch (error: any) {
    console.error('[DEBUG] check-user: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
