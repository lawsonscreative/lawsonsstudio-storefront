/**
 * Script to list all products
 * Run with: node scripts/list-products.js
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

async function listProducts() {
  console.log('📦 Listing all products...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, brand_id, is_active, created_at');

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  if (!products || products.length === 0) {
    console.log('✅ No products found in database');
    return;
  }

  console.log(`✅ Found ${products.length} product(s):\n`);
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   Slug: ${product.slug}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Active: ${product.is_active}`);
    console.log(`   Created: ${product.created_at}`);
    console.log('');
  });
}

listProducts().catch(console.error);
