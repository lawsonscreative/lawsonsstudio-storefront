/**
 * Create Admin User Script
 *
 * This script creates or updates an admin user in the database.
 * It links the admin user to a Supabase Auth user and assigns roles.
 *
 * Usage:
 *   npm run create-admin -- --email admin@example.com --role super_admin
 *   npm run create-admin -- --email admin@example.com --role brand_admin --brand-slug lawsons-studio
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const value = args[i + 1];
      parsed[key] = value;
      i++;
    }
  }

  return parsed;
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function createAdminUser() {
  const args = parseArgs();

  // Get email
  let email = args.email;
  if (!email) {
    email = await prompt('Enter admin email: ');
  }

  if (!email) {
    console.error('❌ Email is required');
    process.exit(1);
  }

  // Get role
  let roleKey = args.role;
  if (!roleKey) {
    roleKey = await prompt('Enter role (super_admin, brand_admin, support, viewer): ');
  }

  if (!['super_admin', 'brand_admin', 'support', 'viewer'].includes(roleKey)) {
    console.error('❌ Invalid role. Must be: super_admin, brand_admin, support, or viewer');
    process.exit(1);
  }

  // Get brand slug if brand-scoped role
  let brandSlug = args['brand-slug'];
  if (roleKey !== 'super_admin' && !brandSlug) {
    brandSlug = await prompt('Enter brand slug (or leave empty for all brands): ');
  }

  console.log('\n🔍 Looking up user in Supabase Auth...');

  // Find auth user by email
  const { data: authData } = await supabase.auth.admin.listUsers();
  const authUser = authData?.users.find((u) => u.email === email);

  if (!authUser) {
    console.error(`❌ No Supabase Auth user found with email: ${email}`);
    console.error('   Please create the user first via Supabase Auth.');
    process.exit(1);
  }

  console.log(`✅ Found auth user: ${authUser.id}`);

  // Check if admin_users record exists
  const { data: existingAdmin } = await supabase
    .from('admin_users')
    .select('*')
    .eq('auth_user_id', authUser.id)
    .single();

  let adminUserId: string;

  if (existingAdmin) {
    console.log('✅ Admin user record already exists');
    adminUserId = existingAdmin.id;

    // Update if needed
    await supabase
      .from('admin_users')
      .update({
        email,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', adminUserId);
  } else {
    console.log('📝 Creating admin_users record...');

    const { data: newAdmin, error } = await supabase
      .from('admin_users')
      .insert({
        auth_user_id: authUser.id,
        email,
        is_active: true,
      })
      .select()
      .single();

    if (error || !newAdmin) {
      console.error('❌ Failed to create admin user:', error);
      process.exit(1);
    }

    adminUserId = newAdmin.id;
    console.log('✅ Admin user created');
  }

  // Get role ID
  const { data: role } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('key', roleKey)
    .single();

  if (!role) {
    console.error(`❌ Role not found: ${roleKey}`);
    process.exit(1);
  }

  // Get brand ID if brand-scoped
  let brandId: string | null = null;
  if (brandSlug) {
    const { data: brand } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', brandSlug)
      .single();

    if (!brand) {
      console.error(`❌ Brand not found with slug: ${brandSlug}`);
      process.exit(1);
    }

    brandId = brand.id;
    console.log(`✅ Found brand: ${brand.name}`);
  }

  // Check if role assignment exists
  const { data: existingRole } = await supabase
    .from('admin_user_roles')
    .select('*')
    .eq('admin_user_id', adminUserId)
    .eq('role_id', role.id)
    .eq('brand_id', brandId)
    .single();

  if (existingRole) {
    console.log('✅ Role assignment already exists');
  } else {
    console.log('📝 Assigning role...');

    const { error } = await supabase.from('admin_user_roles').insert({
      admin_user_id: adminUserId,
      role_id: role.id,
      brand_id: brandId,
    });

    if (error) {
      console.error('❌ Failed to assign role:', error);
      process.exit(1);
    }

    console.log('✅ Role assigned');
  }

  console.log('\n✨ Admin user configured successfully!');
  console.log(`   Email: ${email}`);
  console.log(`   Role: ${role.name}`);
  if (brandId) {
    console.log(`   Brand: ${brandSlug}`);
  } else {
    console.log(`   Brand: All brands (cross-brand access)`);
  }
}

createAdminUser()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
