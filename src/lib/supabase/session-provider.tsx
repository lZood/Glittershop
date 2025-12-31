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
  const supabase = createClient();
  const [session, setSession] = useState<(Session & { profile: Profile | null }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (user: User | null) => {
    if (!user) {
      return null;
    }
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, dob, role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return profile as Profile | null;
  }, [supabase]);


  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (initialSession?.user) {
        const profile = await fetchProfile(initialSession.user);
        setSession({ ...initialSession, profile });
      }
      setIsLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('SessionProvider: Auth state changed:', event, newSession?.user?.id);

      if (newSession?.user) {
        // Optimistically set session so UI can react immediately (e.g. redirect)
        // We cast to any because profile is missing initially
        setSession({ ...newSession, profile: null } as any);

        console.log('SessionProvider: Fetching profile...');
        const profile = await fetchProfile(newSession.user);
        console.log('SessionProvider: Profile fetched:', profile ? 'Found' : 'Not found');

        setSession({ ...newSession, profile });
      } else {
        setSession(null);
      }
      setIsLoading(false);
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
