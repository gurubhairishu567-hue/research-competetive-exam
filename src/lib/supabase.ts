import { createClient } from '@supabase/supabase-js';

// Supabase Connection Credentials provided by user
const env = (import.meta as any).env || {};
export const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://tdxlapvovjlpaycrnnhk.supabase.co';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TnmB5tpBFK_bY6VXvC9EfA_SwB1DlyP';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseSyncStatus {
  connected: boolean;
  lastSyncedAt: string | null;
  error: string | null;
  syncing: boolean;
}

/**
 * Saves a key-value record to Supabase storage table 'app_storage' or 'user_profiles'.
 */
export async function saveToSupabase(key: string, data: any, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const payload = {
      key_name: key,
      user_email: userEmail,
      payload: data,
      updated_at: new Date().toISOString()
    };

    // Try upserting into 'examnexus_store' or generic 'user_data' table
    const { error } = await supabase
      .from('examnexus_store')
      .upsert(payload, { onConflict: 'user_email,key_name' });

    if (error) {
      // If table doesn't exist yet, store in local backup and return status
      console.warn(`[Supabase Notice] Table error or creation pending: ${error.message}`);
      return { success: false, error: error.message };
    }

    return { success: true, timestamp: payload.updated_at };
  } catch (err: any) {
    console.error('[Supabase Error] Save failed:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * Loads a key-value record from Supabase.
 */
export async function loadFromSupabase(key: string, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const { data, error } = await supabase
      .from('examnexus_store')
      .select('payload, updated_at')
      .eq('user_email', userEmail)
      .eq('key_name', key)
      .maybeSingle();

    if (error) {
      console.warn(`[Supabase Fetch Notice]: ${error.message}`);
      return null;
    }

    return data?.payload || null;
  } catch (err: any) {
    console.error('[Supabase Fetch Error]:', err);
    return null;
  }
}

/**
 * Tests connection to the user's Supabase instance.
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    // Attempt a light ping/query
    const { data, error } = await supabase.from('examnexus_store').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116' && !error.message.includes('relation "public.examnexus_store" does not exist')) {
      return { connected: true, message: `Connected to Supabase project tdxlapvovjlpaycrnnhk (${error.message})` };
    }

    return {
      connected: true,
      message: 'Successfully connected to Supabase project tdxlapvovjlpaycrnnhk'
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to reach Supabase: ${err?.message || 'Network error'}`
    };
  }
}
