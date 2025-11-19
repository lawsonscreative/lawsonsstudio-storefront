-- Create brands table
-- This table holds configuration for each brand/tenant in the multi-tenant platform

CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Brand identity
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  primary_domain TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Visual theme
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#28E8EB',
  secondary_color TEXT NOT NULL DEFAULT '#ED474A',
  accent_color TEXT NOT NULL DEFAULT '#50468C',
  background_color_dark TEXT NOT NULL DEFAULT '#160F19',

  -- Inkthreadable configuration
  inkthreadable_store_id TEXT,
  inkthreadable_shipping_method TEXT,

  -- Stripe configuration
  currency TEXT NOT NULL DEFAULT 'GBP',

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on slug for fast brand resolution
CREATE INDEX idx_brands_slug ON brands(slug);

-- Create index on primary_domain for domain-based brand resolution
CREATE INDEX idx_brands_primary_domain ON brands(primary_domain);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active brands
CREATE POLICY "Public can view active brands"
  ON brands
  FOR SELECT
  USING (is_active = true);

COMMENT ON TABLE brands IS 'Multi-tenant brand/tenant configuration table';
COMMENT ON COLUMN brands.slug IS 'URL-safe identifier for the brand';
COMMENT ON COLUMN brands.primary_domain IS 'Primary domain for this brand (e.g., lawsonsstudio.co.uk)';
COMMENT ON COLUMN brands.metadata IS 'Additional brand-specific configuration as JSON';
-- Create products and product_variants tables
-- These tables hold the product catalog, scoped by brand_id

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Brand relationship
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,

  -- Product identity
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Inkthreadable mapping
  inkthreadable_product_id TEXT,

  -- Images and media
  image_urls TEXT[] DEFAULT '{}',
  primary_image_url TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Ensure unique slugs per brand
  CONSTRAINT unique_product_slug_per_brand UNIQUE (brand_id, slug)
);

-- Create index on brand_id for fast filtering
CREATE INDEX idx_products_brand_id ON products(brand_id);

-- Create index on is_active for filtering active products
CREATE INDEX idx_products_is_active ON products(is_active);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create product_variants table
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Product relationship
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  -- Variant identity
  name TEXT NOT NULL,
  sku TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Pricing (in smallest currency unit, e.g., pence for GBP)
  price_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',

  -- Inkthreadable mapping
  inkthreadable_variant_id TEXT,

  -- Stock and availability
  stock_quantity INTEGER,
  is_in_stock BOOLEAN NOT NULL DEFAULT true,

  -- Variant attributes (size, color, etc.)
  size TEXT,
  color TEXT,
  attributes JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on product_id for fast variant lookup
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);

-- Create index on is_active for filtering active variants
CREATE INDEX idx_product_variants_is_active ON product_variants(is_active);

-- Create index on SKU for fast lookups
CREATE INDEX idx_product_variants_sku ON product_variants(sku) WHERE sku IS NOT NULL;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products of active brands
CREATE POLICY "Public can view active products"
  ON products
  FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = products.brand_id
      AND brands.is_active = true
    )
  );

-- Allow public read access to active variants of active products
CREATE POLICY "Public can view active product variants"
  ON product_variants
  FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND products.is_active = true
      AND EXISTS (
        SELECT 1 FROM brands
        WHERE brands.id = products.brand_id
        AND brands.is_active = true
      )
    )
  );

COMMENT ON TABLE products IS 'Product catalog, scoped by brand_id';
COMMENT ON COLUMN products.inkthreadable_product_id IS 'Inkthreadable product ID for POD fulfillment';
COMMENT ON TABLE product_variants IS 'Product variants (size, color, etc.) with pricing';
COMMENT ON COLUMN product_variants.price_amount IS 'Price in smallest currency unit (e.g., pence for GBP)';
COMMENT ON COLUMN product_variants.inkthreadable_variant_id IS 'Inkthreadable variant ID for POD fulfillment';
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
-- Create order status enum
CREATE TYPE order_status AS ENUM (
  'pending_payment',
  'paid',
  'in_production',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Brand and customer relationships
  brand_id UUID NOT NULL REFERENCES brands(id),
  customer_id UUID REFERENCES customers(id),

  -- Order status
  status order_status NOT NULL DEFAULT 'pending_payment',

  -- Customer details (snapshot at time of order)
  customer_email TEXT NOT NULL,
  customer_first_name TEXT,
  customer_last_name TEXT,
  customer_phone TEXT,

  -- Shipping address (snapshot at time of order)
  shipping_recipient_name TEXT NOT NULL,
  shipping_line1 TEXT NOT NULL,
  shipping_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_county TEXT,
  shipping_postcode TEXT NOT NULL,
  shipping_country TEXT NOT NULL DEFAULT 'GB',
  shipping_phone TEXT,

  -- Billing address (snapshot at time of order, can differ from shipping)
  billing_line1 TEXT,
  billing_line2 TEXT,
  billing_city TEXT,
  billing_county TEXT,
  billing_postcode TEXT,
  billing_country TEXT DEFAULT 'GB',

  -- Pricing (in smallest currency unit, e.g., pence for GBP)
  subtotal_amount INTEGER NOT NULL,
  shipping_amount INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',

  -- Stripe integration
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,

  -- Inkthreadable integration
  inkthreadable_order_id TEXT UNIQUE,
  inkthreadable_status TEXT,
  tracking_number TEXT,
  carrier TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Order relationship
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  -- Product and variant references (snapshot at time of order)
  product_id UUID NOT NULL REFERENCES products(id),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),

  -- Product details (snapshot at time of order)
  product_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  variant_sku TEXT,

  -- Inkthreadable mapping
  inkthreadable_product_id TEXT,
  inkthreadable_variant_id TEXT,

  -- Pricing (in smallest currency unit)
  unit_price_amount INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for orders
CREATE INDEX idx_orders_brand_id ON orders(brand_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_checkout_session_id ON orders(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE INDEX idx_orders_inkthreadable_order_id ON orders(inkthreadable_order_id) WHERE inkthreadable_order_id IS NOT NULL;
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Create indexes for order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_product_variant_id ON order_items(product_variant_id);

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for orders (no public access - all via service role)
CREATE POLICY "Service role can access all orders"
  ON orders
  FOR ALL
  USING (true);

-- RLS policies for order_items (no public access - all via service role)
CREATE POLICY "Service role can access all order items"
  ON order_items
  FOR ALL
  USING (true);

-- Future: Add policies for authenticated users to view their own orders
-- CREATE POLICY "Customers can view their own orders"
--   ON orders
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM customers
--       WHERE customers.id = orders.customer_id
--       AND customers.auth_user_id = auth.uid()
--     )
--   );

COMMENT ON TABLE orders IS 'Orders placed by customers, including Stripe and Inkthreadable references';
COMMENT ON COLUMN orders.status IS 'Order lifecycle status';
COMMENT ON COLUMN orders.customer_email IS 'Snapshot of customer email at time of order';
COMMENT ON COLUMN orders.shipping_recipient_name IS 'Recipient name for delivery (may differ from customer for gifts)';
COMMENT ON COLUMN orders.subtotal_amount IS 'Subtotal in smallest currency unit (e.g., pence)';
COMMENT ON COLUMN orders.stripe_checkout_session_id IS 'Stripe Checkout Session ID';
COMMENT ON COLUMN orders.inkthreadable_order_id IS 'Inkthreadable order ID for POD fulfillment';
COMMENT ON TABLE order_items IS 'Line items within each order (snapshots product/variant details)';
COMMENT ON COLUMN order_items.unit_price_amount IS 'Unit price in smallest currency unit at time of order';
-- Seed data: Create Lawsons Studio brand record

INSERT INTO brands (
  name,
  slug,
  primary_domain,
  is_active,
  logo_url,
  primary_color,
  secondary_color,
  accent_color,
  background_color_dark,
  currency
) VALUES (
  'Lawsons Studio',
  'lawsons-studio',
  'lawsonsstudio.co.uk',
  true,
  '/images/logo.png',
  '#28E8EB',
  '#ED474A',
  '#50468C',
  '#160F19',
  'GBP'
)
ON CONFLICT (slug) DO NOTHING;

-- Store the brand ID for reference in subsequent migrations (if needed)
COMMENT ON TABLE brands IS 'Multi-tenant brand/tenant configuration table. Lawsons Studio is slug: lawsons-studio';
