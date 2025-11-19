/**
 * Product queries
 * Server-side functions to fetch products from Supabase
 */

import { getSupabaseClient } from '../supabase/server';
import type { Product, ProductVariant, ProductWithVariants } from '@/types/database';

/**
 * Get all active products for a brand with their variants
 */
export async function getProducts(brandId: string): Promise<ProductWithVariants[]> {
  const supabase = getSupabaseClient();

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*)
    `)
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products as ProductWithVariants[];
}

/**
 * Get a single product by slug with variants
 */
export async function getProductBySlug(
  brandId: string,
  slug: string
): Promise<ProductWithVariants | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*)
    `)
    .eq('brand_id', brandId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }

  return data as ProductWithVariants;
}

/**
 * Get a product variant by ID
 */
export async function getProductVariant(variantId: string): Promise<ProductVariant | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('id', variantId)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error(`Error fetching variant ${variantId}:`, error);
    return null;
  }

  return data as ProductVariant;
}
