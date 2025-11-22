/**
 * Script to check products and their variants in detail
 * Run with: node scripts/check-products-detailed.js
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

async function checkProducts() {
  console.log('📦 Checking all products and variants...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  if (!products || products.length === 0) {
    console.log('✅ No products found in database');
    return;
  }

  console.log(`Found ${products.length} product(s):\n`);

  for (const product of products) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Product: ${product.name}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`ID: ${product.id}`);
    console.log(`Slug: ${product.slug}`);
    console.log(`Brand ID: ${product.brand_id}`);
    console.log(`Active: ${product.is_active}`);
    console.log(`Provider Type: ${product.provider_type || 'N/A'}`);
    console.log(`Created: ${product.created_at}`);
    console.log(`Updated: ${product.updated_at}`);

    // Check for variants
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', product.id);

    if (variantsError) {
      console.error('❌ Error fetching variants:', variantsError);
    } else if (!variants || variants.length === 0) {
      console.log('\n⚠️  WARNING: No variants found for this product!');
    } else {
      console.log(`\nVariants (${variants.length}):`);
      variants.forEach((variant, index) => {
        console.log(`  ${index + 1}. ${variant.name}`);
        console.log(`     SKU: ${variant.sku || 'N/A'}`);
        console.log(`     Price: £${(variant.price_amount / 100).toFixed(2)} ${variant.currency}`);
        console.log(`     Active: ${variant.is_active}, In Stock: ${variant.is_in_stock}`);
        console.log(`     Inkthreadable SKU: ${variant.inkthreadable_sku || 'N/A'}`);
      });
    }
  }

  console.log(`\n${'='.repeat(80)}\n`);
}

checkProducts().catch(console.error);
