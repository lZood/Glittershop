'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from './client';

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  role: 'user' | 'admin';
};

type SessionContext = {
  session: (Session & { profile: Profile | null }) | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
};

const Context = createContext<SessionContext | undefined>(undefined);

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<(Session & { profile: Profile | null }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (user: User | null) => {
    if (!user) {
      console.log('SessionProvider: fetchProfile called with no user');
      return null;
    }
    console.log('SessionProvider: fetchProfile starting for user:', user.id, new Date().toISOString());
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*') // Select all fields to be safe
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("SessionProvider: Error fetching profile:", error, new Date().toISOString());
        // Do not return null immediately if error is just 'not found' - maybe retry? 
        // But for now log it.
        return null;
      }

      console.log('SessionProvider: fetchProfile success:', !!profile, new Date().toISOString());
      return profile as Profile | null;
    } catch (err) {
      console.error('SessionProvider: fetchProfile catch error:', err, new Date().toISOString());
      return null;
    }
  }, [supabase]);


  useEffect(() => {
    const getInitialSession = async () => {
      console.log('SessionProvider: Initializing session check...', new Date().toISOString());
      try {
        // Usamos getUser() que es más fiable para verificar el estado real en el servidor
        const { data: { user: initialUser }, error } = await supabase.auth.getUser();

        if (error) {
          console.warn('SessionProvider: Auth error or no active session:', error.message);
          setSession(null);
          // Important: Set isLoading false here
          setIsLoading(false);
          return;
        }

        if (initialUser) {
          console.log('SessionProvider: User found, fetching profile...', initialUser.id);
          const profile = await fetchProfile(initialUser);
          // Obtenemos la sesión actual para el contexto
          const { data: { session: currentSession } } = await supabase.auth.getSession();

          console.log('SessionProvider: Setting session with profile', !!profile);
          setSession({ ...currentSession, profile } as any);
        } else {
          console.log('SessionProvider: No user found');
          setSession(null);
        }
      } catch (err) {
        console.error('SessionProvider: Unexpected initialization error:', err);
        setSession(null);
      } finally {
        console.log('SessionProvider: Finished initialization (setting isLoading false)', new Date().toISOString());
        setIsLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('SessionProvider: Auth state changed event:', event, 'User:', newSession?.user?.id || 'none');

      try {
        if (newSession?.user) {
          // If event is INITIAL_SESSION, we might be racing with getInitialSession.
          // But getInitialSession handles the initial load.
          if (event === 'INITIAL_SESSION') {
            console.log('SessionProvider: Ignoring INITIAL_SESSION event in onAuthStateChange as getInitialSession handles it.');
            return;
          }

          console.log('SessionProvider: Auth state changed - updating session and fetching profile...');
          // Don't set profile to null immediately if we already have one to avoid flicker?
          // But if user changed, we must.

          const profile = await fetchProfile(newSession.user);
          setSession({ ...newSession, profile } as any);
        } else if (event === 'SIGNED_OUT') {
          console.log('SessionProvider: Auth state changed - clearing session');
          setSession(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('SessionProvider: Error in onAuthStateChange:', err);
      }
      // Note: we don't necessarily want to setLoading(false) here if it was already false.
      // But if it was true (e.g. from login page), we should.
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const value = {
    session,
    user: session?.user ?? null,
    profile: session?.profile ?? null,
    isLoading,
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

export const useSession = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider.');
  }
  return context;
};
