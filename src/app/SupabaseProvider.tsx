'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { getClientConfig, validateConfig } from '../utils/runtimeConfig';
import { logger } from '../utils/logger';

type SupabaseContext = {
  supabase: SupabaseClient | null;
  error: string | null;
};

const Context = createContext<SupabaseContext>({
  supabase: null,
  error: null,
});

type Props = {
  children: React.ReactNode;
};

export default function SupabaseProvider({ children }: Props) {
  const { session } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Log environment config for debugging
    logger.logConfig();

    try {
      // Validate required config values
      const config = validateConfig();

      if (!config.supabaseUrl || !config.supabaseAnonKey) {
        const errorMsg = 'Supabase URL or anon key is missing';
        logger.error(errorMsg);
        setError(errorMsg);
        return;
      }

      // Create Supabase client using the new third-party auth approach
      const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        accessToken: async () => {
          // Use Clerk's session token directly (no template needed)
          return session?.getToken() ?? null;
        },
      });

      setSupabase(client);
    } catch (err: any) {
      logger.error('Failed to initialize Supabase client:', err);
      setError(err.message);
    }
  }, [session]);

  return <Context.Provider value={{ supabase, error }}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return {
    supabase: context.supabase,
    error: context.error,
  };
};
