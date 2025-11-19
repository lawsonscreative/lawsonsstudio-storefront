-- Create customers and addresses tables
-- These tables support customer accounts and saved addresses

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Customer identity
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,

  -- Optional link to Supabase Auth (for future implementation)
  auth_user_id UUID UNIQUE,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on email for fast customer lookup
CREATE INDEX idx_customers_email ON customers(email);

-- Create index on auth_user_id for auth integration
CREATE INDEX idx_customers_auth_user_id ON customers(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Customer relationship
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

  -- Address type
  label TEXT, -- e.g., "Home", "Work"
  is_default_shipping BOOLEAN NOT NULL DEFAULT false,
  is_default_billing BOOLEAN NOT NULL DEFAULT false,

  -- Address fields
  recipient_name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  county TEXT,
  postcode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'GB',

  -- Phone for delivery
  phone TEXT,

  -- Original address text (for debugging/support)
  original_input TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on customer_id for fast address lookup
CREATE INDEX idx_addresses_customer_id ON addresses(customer_id);

-- Create index on default addresses for fast lookups
CREATE INDEX idx_addresses_default_shipping ON addresses(customer_id, is_default_shipping) WHERE is_default_shipping = true;
CREATE INDEX idx_addresses_default_billing ON addresses(customer_id, is_default_billing) WHERE is_default_billing = true;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- RLS policies for customers (future: auth-based access)
-- For now, no public access - all access via service role
CREATE POLICY "Service role can access all customers"
  ON customers
  FOR ALL
  USING (true);

-- RLS policies for addresses (future: customers can only see their own)
-- For now, no public access - all access via service role
CREATE POLICY "Service role can access all addresses"
  ON addresses
  FOR ALL
  USING (true);

COMMENT ON TABLE customers IS 'Customer identities and accounts';
COMMENT ON COLUMN customers.auth_user_id IS 'Optional link to Supabase Auth user';
COMMENT ON TABLE addresses IS 'Saved customer addresses for shipping and billing';
COMMENT ON COLUMN addresses.original_input IS 'Original address text entered by customer for debugging';
