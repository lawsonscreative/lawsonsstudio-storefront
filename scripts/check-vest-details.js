/**
 * Script to check vest product with full details including images
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkVest() {
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*)
    `)
    .eq('slug', 'empower-elevate-cool-vest')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Product:', JSON.stringify(product, null, 2));
}

checkVest().catch(console.error);
