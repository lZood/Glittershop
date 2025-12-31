import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/profile';

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session) {
      const user = session.user;

      // On successful OAuth login, check if a profile exists and create one if not.
      // This handles both new user sign-ups and existing user logins via OAuth.
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          // Extract user's full name from metadata, fallback to a generic name
          first_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Glittershop Member',
          last_name: '', // Social providers usually don't provide a separate last name
          email: user.email!, // Email is guaranteed to exist with OAuth
          // dob is not provided by Google OAuth by default for privacy reasons.
          // The user can be prompted to enter it in their profile settings.
        });

      if (!profileError) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      console.error('Profile creation/update error:', profileError);
      // Redirect to an error page or show a message even if profile creation fails
      return NextResponse.redirect(`${origin}/login?error=Could not create user profile`);

    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
