// Configuration file to ensure environment variables are properly loaded
// Next.js will inline these at build time

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || '',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://backup-vault.vercel.app',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://backup-vault.vercel.app/api',
  },
} as const;

// Validation function to ensure required env vars are present
export function validateConfig() {
  const missing: string[] = [];

  if (!config.supabase.url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!config.supabase.anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      `Please check your Vercel environment variable configuration.`
    );
  }

  return true;
}
