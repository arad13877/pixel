import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(url && publishableKey);
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, publishableKey, {
      auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true },
    })
  : null;

export function requireSupabase() {
  if (!supabase) throw new Error('اتصال Supabase هنوز پیکربندی نشده است.');
  return supabase;
}

export async function invokeFunction<T>(name: string, body: Record<string, unknown>) {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke<T>(name, { body });
  if (error) throw error;
  return data;
}

export async function signInWithUsername(username: string, password: string) {
  const data = await invokeFunction<{ access_token: string; refresh_token: string }>('sign-in-username', { username, password });
  if (!data?.access_token || !data.refresh_token) throw new Error('invalid_login_response');
  return data;
}
