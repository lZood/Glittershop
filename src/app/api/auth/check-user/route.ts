import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('email', email);

    // If there's an error but it's not the "missing rows" error, it's a real error.
    // PGRST116 means "The result contains 0 rows". This is expected if the user doesn't exist.
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // If count is greater than 0, the user exists.
    const exists = count !== null && count > 0;
    return NextResponse.json({ exists });

  } catch (error: any) {
    console.error('Check user error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
