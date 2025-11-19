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
