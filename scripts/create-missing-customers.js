const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createMissingCustomers() {
  console.log('\nCreating missing customer records...');
  console.log('='.repeat(60));

  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error listing users:', usersError);
    return;
  }

  for (const user of users) {
    console.log(`\n📧 ${user.email}`);

    // Check if customer record exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (existingCustomer) {
      console.log('   ✅ Customer record already exists');
      continue;
    }

    // Create customer record
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({
        auth_user_id: user.id,
        first_name: user.user_metadata.first_name || '',
        last_name: user.user_metadata.last_name || '',
        email: user.email,
        phone: user.user_metadata.phone || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('   ❌ Error creating customer record:', insertError);
    } else {
      console.log(`   ✅ Created customer record: ${newCustomer.first_name} ${newCustomer.last_name}`);
      console.log(`      Customer ID: ${newCustomer.id}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Done! All users now have customer records.');
  console.log('\nNames should now populate at checkout when logged in.');
}

createMissingCustomers().then(() => process.exit(0));
