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
