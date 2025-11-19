/**
 * Create Admin Account Script
 *
 * This script creates an admin account in Supabase Auth with specified credentials.
 * Run this once to create your admin account for testing.
 *
 * Usage:
 *   node scripts/create-admin.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function createAdminAccount() {
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    console.error('\nMake sure .env.local is configured correctly.');
    process.exit(1);
  }

  // Create Supabase admin client (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const adminEmail = 'andy@lawsonsenterprises.com';
  const adminPassword = 'Password123';

  console.log('🔧 Creating admin account...');
  console.log(`   Email: ${adminEmail}`);

  try {
    // Create the admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: 'Andy',
        last_name: 'Lawson',
        role: 'admin' // Add admin role to user metadata
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('⚠️  Admin account already exists!');
        console.log('   You can login with:');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        return;
      }
      throw error;
    }

    console.log('✅ Admin account created successfully!');
    console.log('   User ID:', data.user.id);
    console.log('   Email:', data.user.email);
    console.log('\n📝 Login credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n🔗 You can now login at: http://localhost:3000/auth/login');
    console.log('   Or access admin portal at: http://localhost:3000/admin');

  } catch (err) {
    console.error('❌ Error creating admin account:', err.message);
    process.exit(1);
  }
}

createAdminAccount();
