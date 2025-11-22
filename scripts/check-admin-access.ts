/**
 * Script to check admin user access and permissions
 * Run with: node --loader ts-node/esm scripts/check-admin-access.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAdminAccess() {
  console.log('🔍 Checking admin access for andy@lawsonsenterprises.com...\n');

  // 1. Check if auth user exists
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.error('❌ Error fetching auth users:', authError);
    return;
  }

  const authUser = authUsers.users.find(u => u.email === 'andy@lawsonsenterprises.com');

  if (!authUser) {
    console.error('❌ Auth user not found for andy@lawsonsenterprises.com');
    return;
  }

  console.log('✅ Auth user found:', {
    id: authUser.id,
    email: authUser.email,
    created_at: authUser.created_at,
  });

  // 2. Check if admin_user exists
  const { data: adminUser, error: adminUserError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('auth_user_id', authUser.id)
    .single();

  if (adminUserError) {
    console.error('❌ Error fetching admin user:', adminUserError);
    return;
  }

  if (!adminUser) {
    console.error('❌ Admin user record not found');
    return;
  }

  console.log('✅ Admin user record found:', {
    id: adminUser.id,
    email: adminUser.email,
    is_active: adminUser.is_active,
  });

  // 3. Check admin roles
  const { data: userRoles, error: rolesError } = await supabase
    .from('admin_user_roles')
    .select(`
      *,
      admin_roles (key, name),
      brands (name)
    `)
    .eq('admin_user_id', adminUser.id);

  if (rolesError) {
    console.error('❌ Error fetching user roles:', rolesError);
    return;
  }

  console.log('✅ User roles:', userRoles);

  // 4. Test helper functions
  console.log('\n🧪 Testing helper functions...\n');

  const { data: isAdminResult, error: isAdminError } = await supabase
    .rpc('is_admin', { user_id: authUser.id });

  if (isAdminError) {
    console.error('❌ Error calling is_admin():', isAdminError);
  } else {
    console.log('✅ is_admin() result:', isAdminResult);
  }

  const { data: hasSuperAdminResult, error: hasSuperAdminError } = await supabase
    .rpc('has_admin_role', { user_id: authUser.id, role_key: 'super_admin' });

  if (hasSuperAdminError) {
    console.error('❌ Error calling has_admin_role():', hasSuperAdminError);
  } else {
    console.log('✅ has_admin_role(super_admin) result:', hasSuperAdminResult);
  }

  // 5. Check brand access
  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('id, name, slug');

  if (brandsError) {
    console.error('❌ Error fetching brands:', brandsError);
  } else {
    console.log('\n📦 Brands:', brands);

    for (const brand of brands || []) {
      const { data: hasAccess, error: accessError } = await supabase
        .rpc('has_brand_access', { user_id: authUser.id, target_brand_id: brand.id });

      if (accessError) {
        console.error(`❌ Error checking access to ${brand.name}:`, accessError);
      } else {
        console.log(`${hasAccess ? '✅' : '❌'} Access to ${brand.name}:`, hasAccess);
      }
    }
  }

  // 6. Check RLS policies on products table
  console.log('\n🔐 Checking RLS policies...\n');

  const { data: policies, error: policiesError } = await supabase
    .from('pg_policies')
    .select('*')
    .in('tablename', ['products', 'product_variants']);

  if (policiesError) {
    console.error('❌ Error fetching policies:', policiesError);
  } else {
    console.log('✅ RLS Policies:', policies);
  }
}

checkAdminAccess().catch(console.error);
