const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listUsers() {
  console.log('\nListing all auth users:');
  console.log('='.repeat(60));

  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error listing users:', usersError);
    return;
  }

  if (users.length === 0) {
    console.log('No users found in auth.users table');
    return;
  }

  console.log(`Found ${users.length} user(s):\n`);

  for (const user of users) {
    console.log(`📧 ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Metadata:`, user.user_metadata);

    // Check if has customer record
    const { data: customer } = await supabase
      .from('customers')
      .select('id, first_name, last_name')
      .eq('auth_user_id', user.id)
      .single();

    if (customer) {
      console.log(`   ✅ Has customer record: ${customer.first_name} ${customer.last_name}`);
    } else {
      console.log(`   ❌ No customer record`);
    }
    console.log('');
  }

  console.log('='.repeat(60));
}

listUsers().then(() => process.exit(0));
