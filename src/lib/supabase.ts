import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Development-time validation — warn but don't crash
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase Config] ⚠️ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from environment variables.\n' +
    'The app will use the Vite /api/ server endpoints for authentication.\n' +
    'Non-critical Supabase operations (sync) may be unavailable.'
  );
}

// Validate URL format
const isValidSupabaseUrl = (() => {
  if (!supabaseUrl) return false;
  try {
    const url = new URL(supabaseUrl);
    return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
})();

if (supabaseUrl && !isValidSupabaseUrl) {
  console.warn(
    `[Supabase Config] ⚠️ VITE_SUPABASE_URL "${supabaseUrl}" does not appear to be a valid Supabase project URL.`
  );
}

// Create client — use a safe dummy if URL/key are missing to prevent crash
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

/** Whether the Supabase REST API is actually reachable */
export let isSupabaseReachable = false;

export interface SupabaseSyncStatus {
  connected: boolean;
  lastSynced: string | null;
  mode: 'cloud-connected' | 'hybrid-fallback';
  error?: string | null;
}

/**
 * Test connectivity with Supabase project endpoint.
 * Gracefully handles DNS failures and network errors — never throws.
 */
export async function checkSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  if (!isValidSupabaseUrl) {
    isSupabaseReachable = false;
    return { ok: false, message: 'Supabase URL is not configured or invalid. Using server API endpoints.' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok || res.status === 200 || res.status === 404) {
      isSupabaseReachable = true;
      return { ok: true, message: `Connected to Supabase Project` };
    }
    isSupabaseReachable = false;
    return { ok: false, message: `Server returned status ${res.status}` };
  } catch (err: any) {
    isSupabaseReachable = false;
    const msg = err.name === 'AbortError'
      ? 'Connection timed out'
      : err.message || 'Connection failed';
    console.warn('[Supabase] Connection check failed (non-critical):', msg);
    return { ok: false, message: `Supabase not reachable: ${msg}. Using server API endpoints.` };
  }
}
