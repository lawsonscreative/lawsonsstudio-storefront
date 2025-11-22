-- =====================================================
-- ADD VARIANT IMAGE SUPPORT
-- =====================================================
-- This migration adds image URL field to product variants
-- so each variant (color/size) can have its own image
-- =====================================================

-- Add image_url column to product_variants
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment
COMMENT ON COLUMN product_variants.image_url IS 'Variant-specific image URL (e.g., for different colors)';
