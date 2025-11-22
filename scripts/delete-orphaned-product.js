/**
 * Script to delete the orphaned "Empower Elevate Cool Vest" product
 * Run with: node scripts/delete-orphaned-product.js
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

async function deleteOrphanedProduct() {
  const productId = '2e68130d-600f-49f5-8871-0673abb91d6f'; // Empower Elevate Cool Vest

  console.log('🗑️  Deleting orphaned product...\n');

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('❌ Error deleting product:', error);
    return;
  }

  console.log('✅ Successfully deleted orphaned product "Empower Elevate Cool Vest"');
}

deleteOrphanedProduct().catch(console.error);
