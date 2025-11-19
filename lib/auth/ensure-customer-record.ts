import type { User, SupabaseClient } from '@supabase/supabase-js';

/**
 * Ensures a customer record exists for the given user
 * Creates one if it doesn't exist
 *
 * This should be called after login/signup to ensure the user has a customer record
 * that links their auth account to their customer profile data
 */
export async function ensureCustomerRecord(user: User, supabase?: SupabaseClient): Promise<void> {
  if (!user) return;

  // If no supabase client provided, import the default one
  if (!supabase) {
    const { supabase: defaultClient } = await import('@/lib/supabase/client');
    supabase = defaultClient;
  }

  try {
    // Check if customer record exists
    const { data: existingCustomer, error: checkError } = await supabase
      .from('customers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    // If exists, we're done
    if (existingCustomer) {
      return;
    }

    // If error other than not found, log it
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking customer record:', checkError);
      return;
    }

    // Create customer record
    const { error: insertError } = await supabase
      .from('customers')
      .insert({
        auth_user_id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || null,
      });

    if (insertError) {
      console.error('Error creating customer record:', insertError);
    }
  } catch (error) {
    console.error('Error in ensureCustomerRecord:', error);
  }
}
