const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCustomerRecord(email) {
  console.log(`\nChecking customer record for: ${email}`);
  console.log('='.repeat(60));

  // Get auth user
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error listing users:', usersError);
    return;
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.log('❌ User not found in auth.users');
    return;
  }

  console.log('\n✅ Auth User Found:');
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Email Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
  console.log(`   Created: ${user.created_at}`);
  console.log(`   User Metadata:`, user.user_metadata);

  // Check customers table
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  if (customerError && customerError.code !== 'PGRST116') {
    console.error('\n❌ Error querying customers table:', customerError);
    return;
  }

  if (!customer) {
    console.log('\n❌ No customer record found in customers table');
    console.log('   This is why the name doesn\'t populate at checkout!');
    console.log('\n🔧 Creating customer record...');

    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({
        auth_user_id: user.id,
        first_name: user.user_metadata.first_name || '',
        last_name: user.user_metadata.last_name || '',
        email: user.email,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating customer record:', insertError);
    } else {
      console.log('✅ Customer record created successfully!');
      console.log('   Customer:', newCustomer);
    }
  } else {
    console.log('\n✅ Customer Record Found:');
    console.log(`   ID: ${customer.id}`);
    console.log(`   Auth User ID: ${customer.auth_user_id}`);
    console.log(`   Name: ${customer.first_name} ${customer.last_name}`);
    console.log(`   Email: ${customer.email}`);
    console.log(`   Phone: ${customer.phone || '(not set)'}`);
    console.log(`   Created: ${customer.created_at}`);
  }

  // Check addresses
  const { data: addresses, error: addressError } = await supabase
    .from('addresses')
    .select('*')
    .eq('customer_id', customer?.id || 0);

  if (!addressError && addresses && addresses.length > 0) {
    console.log(`\n✅ ${addresses.length} Address(es) Found:`);
    addresses.forEach((addr, i) => {
      console.log(`   ${i + 1}. ${addr.address_line1}, ${addr.city} ${addr.postal_code}`);
    });
  } else {
    console.log('\n⚠️  No addresses found');
  }

  console.log('\n' + '='.repeat(60));
}

// Get email from command line argument
const email = process.argv[2] || 'andy@lawsonsenterprise.co.uk';
checkCustomerRecord(email).then(() => process.exit(0));
