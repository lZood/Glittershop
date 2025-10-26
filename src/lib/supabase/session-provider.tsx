'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from './client';

type Profile = {
  first_name: string;
  last_name: string;
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

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .single();
        
        setSession({ ...session, profile: profile as Profile | null });
      } else {
        setSession(null);
      }
      setIsLoading(false);
    });

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
       if (session) {
         supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
              setSession({ ...session, profile: profile as Profile | null });
              setIsLoading(false);
          });
       } else {
        setIsLoading(false);
       }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
