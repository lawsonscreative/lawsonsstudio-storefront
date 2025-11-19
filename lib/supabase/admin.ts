/**
 * Supabase admin client for server-side usage with service role key
 * BYPASSES RLS - use only for trusted server-side operations
 *
 * Use cases:
 * - Creating orders after payment confirmation
 * - Admin operations
 * - Background jobs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase service role environment variables');
}

export function getSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
