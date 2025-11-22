/**
 * Script to fix the vest product image URL
 * Run with: node scripts/fix-vest-image.js
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

async function fixVestImage() {
  console.log('Updating vest product image URL...\n');

  const { error } = await supabase
    .from('products')
    .update({
      primary_image_url: '/products/empower-elevate-vest/front.png'
    })
    .eq('slug', 'empower-elevate-cool-vest');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Updated image URL to: /products/empower-elevate-vest/front.png');
}

fixVestImage().catch(console.error);
