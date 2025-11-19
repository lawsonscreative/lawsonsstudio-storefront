/**
 * Supabase client for server-side usage (RSC, API routes)
 * Uses the anon key with RLS protection
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
