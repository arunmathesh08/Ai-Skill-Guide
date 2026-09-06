import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ysqggazrfrmpvxqzmyru.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_s8GW6jTe1OlDrPjokLv5zw_QLCisWEO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

export interface SupabaseSyncStatus {
  connected: boolean;
  lastSynced: string | null;
  mode: 'cloud-connected' | 'hybrid-fallback';
  error?: string | null;
}

/**
 * Test connectivity with Supabase project endpoint
 */
export async function checkSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });
    if (res.ok || res.status === 200 || res.status === 404) {
      return { ok: true, message: 'Connected to Supabase Project (ysqggazrfrmpvxqzmyru)' };
    }
    return { ok: false, message: `Server returned status ${res.status}` };
  } catch (err: any) {
    return { ok: false, message: err.message || 'Connection failed' };
  }
}
