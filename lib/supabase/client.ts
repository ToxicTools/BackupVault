import { createClient } from '@supabase/supabase-js';
import { config, validateConfig } from '@/lib/config';

// Validate configuration on module load
// This will throw a helpful error if env vars are missing
validateConfig();

// Client-side Supabase client (for browser)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Server-side Supabase admin client (with service role key)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
