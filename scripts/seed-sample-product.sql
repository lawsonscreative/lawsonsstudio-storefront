-- Add sample product for testing
-- Run this in Supabase SQL Editor

-- Get brand ID (should already exist from migrations)
DO $$
DECLARE
  brand_uuid UUID;
  product_uuid UUID;
BEGIN
  -- Get Lawsons Studio brand ID
  SELECT id INTO brand_uuid FROM brands WHERE slug = 'lawsons-studio' LIMIT 1;

  -- Insert sample product
  INSERT INTO products (
    brand_id,
    name,
    slug,
    description,
    is_active,
    primary_image_url,
    inkthreadable_product_id
  ) VALUES (
    brand_uuid,
    'Classic Logo T-Shirt',
    'classic-logo-tshirt',
    'Premium cotton tee with bold Lawsons Studio branding. Perfect for everyday wear.',
    true,
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    'SAMPLE_PRODUCT_1'
  ) RETURNING id INTO product_uuid;

  -- Insert variants (different sizes)
  INSERT INTO product_variants (
    product_id,
    name,
    price_amount,
    currency,
    is_active,
    is_in_stock,
    size,
    color,
    inkthreadable_variant_id
  ) VALUES
    (product_uuid, 'Small - Black', 2499, 'GBP', true, true, 'S', 'Black', 'SAMPLE_VAR_S'),
    (product_uuid, 'Medium - Black', 2499, 'GBP', true, true, 'M', 'Black', 'SAMPLE_VAR_M'),
    (product_uuid, 'Large - Black', 2499, 'GBP', true, true, 'L', 'Black', 'SAMPLE_VAR_L'),
    (product_uuid, 'X-Large - Black', 2499, 'GBP', true, true, 'XL', 'Black', 'SAMPLE_VAR_XL');

  RAISE NOTICE 'Sample product added successfully!';
END $$;
