/**
 * Brand resolution system
 * Resolves the current brand based on domain or defaults to Lawsons Studio
 */

import { getSupabaseClient } from '../supabase/server';
import type { Brand } from '@/types/database';

/**
 * Resolve brand from hostname
 * For MVP, we'll default to Lawsons Studio
 * In production, this would query the database based on headers().host
 */
export async function resolveBrandFromHost(hostname?: string): Promise<Brand | null> {
  const supabase = getSupabaseClient();

  // For MVP: always return Lawsons Studio
  // In production: query by primary_domain matching hostname
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', 'lawsons-studio')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching brand:', error);
    return null;
  }

  return data as Brand;
}

/**
 * Get Lawsons Studio brand (default brand)
 */
export async function getLawsonsStudioBrand(): Promise<Brand | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', 'lawsons-studio')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching Lawsons Studio brand:', error);
    return null;
  }

  return data as Brand;
}

/**
 * Get brand by slug
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error(`Error fetching brand ${slug}:`, error);
    return null;
  }

  return data as Brand;
}

/**
 * Get brand by ID
 */
export async function getBrandById(id: string): Promise<Brand | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error(`Error fetching brand ${id}:`, error);
    return null;
  }

  return data as Brand;
}
