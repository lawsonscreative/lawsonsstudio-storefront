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
