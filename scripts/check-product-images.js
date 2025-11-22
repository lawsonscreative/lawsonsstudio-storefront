/**
 * Script to check product images
 * Run with: node scripts/check-product-images.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProductImages() {
  const { data: products, error } = await supabase
    .from('products')
    .select('name, slug, primary_image_url, image_urls')
    .eq('slug', 'empower-elevate-cool-vest');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Product image data:');
  console.log(JSON.stringify(products, null, 2));
}

checkProductImages().catch(console.error);
