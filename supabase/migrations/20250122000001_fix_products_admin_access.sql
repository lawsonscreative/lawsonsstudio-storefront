-- =====================================================
-- FIX PRODUCTS ADMIN ACCESS
-- =====================================================
-- This migration adds:
-- 1. RLS policies for admin users to manage products
-- 2. Missing columns for product provider type and variant SKU mapping
-- =====================================================

-- =====================================================
-- 1. ADD MISSING COLUMNS
-- =====================================================

-- Add provider_type to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS provider_type TEXT DEFAULT 'other';

-- Add inkthreadable_sku to product_variants table
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS inkthreadable_sku TEXT;

-- Create index on inkthreadable_sku for fast lookups
CREATE INDEX IF NOT EXISTS idx_product_variants_inkthreadable_sku
  ON product_variants(inkthreadable_sku)
  WHERE inkthreadable_sku IS NOT NULL;

-- =====================================================
-- 2. ADD RLS POLICIES FOR ADMIN ACCESS
-- =====================================================

-- Admin users can view all products (including inactive ones)
CREATE POLICY "Admins can view all products"
  ON products
  FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid())
  );

-- Admin users can insert products for brands they have access to
CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    has_brand_access(auth.uid(), brand_id)
  );

-- Admin users can update products for brands they have access to
CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    has_brand_access(auth.uid(), brand_id)
  )
  WITH CHECK (
    has_brand_access(auth.uid(), brand_id)
  );

-- Admin users can delete products for brands they have access to
CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    has_brand_access(auth.uid(), brand_id)
  );

-- Admin users can view all product variants
CREATE POLICY "Admins can view all product variants"
  ON product_variants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND has_brand_access(auth.uid(), products.brand_id)
    )
  );

-- Admin users can insert product variants
CREATE POLICY "Admins can insert product variants"
  ON product_variants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND has_brand_access(auth.uid(), products.brand_id)
    )
  );

-- Admin users can update product variants
CREATE POLICY "Admins can update product variants"
  ON product_variants
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND has_brand_access(auth.uid(), products.brand_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND has_brand_access(auth.uid(), products.brand_id)
    )
  );

-- Admin users can delete product variants
CREATE POLICY "Admins can delete product variants"
  ON product_variants
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND has_brand_access(auth.uid(), products.brand_id)
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON COLUMN products.provider_type IS 'Product provider type (e.g., inkthreadable, other)';
COMMENT ON COLUMN product_variants.inkthreadable_sku IS 'Inkthreadable SKU for POD fulfillment mapping';
