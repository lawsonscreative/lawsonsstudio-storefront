/**
 * TypeScript types for database schema
 * These types represent the Supabase tables and should be kept in sync with migrations
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Brand {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  primary_domain: string | null;
  is_active: boolean;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color_dark: string;
  inkthreadable_store_id: string | null;
  inkthreadable_shipping_method: string | null;
  currency: string;
  metadata: Json;
}

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  brand_id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  inkthreadable_product_id: string | null;
  image_urls: string[];
  primary_image_url: string | null;
  metadata: Json;
}

export interface ProductVariant {
  id: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  name: string;
  sku: string | null;
  is_active: boolean;
  price_amount: number; // in smallest currency unit (pence)
  currency: string;
  inkthreadable_variant_id: string | null;
  stock_quantity: number | null;
  is_in_stock: boolean;
  size: string | null;
  color: string | null;
  attributes: Json;
  metadata: Json;
}

export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  auth_user_id: string | null;
  metadata: Json;
}

export interface Address {
  id: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  label: string | null;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  recipient_name: string;
  line1: string;
  line2: string | null;
  city: string;
  county: string | null;
  postcode: string;
  country: string;
  phone: string | null;
  original_input: string | null;
  metadata: Json;
}

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  brand_id: string;
  customer_id: string | null;
  status: OrderStatus;
  customer_email: string;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_phone: string | null;
  shipping_recipient_name: string;
  shipping_line1: string;
  shipping_line2: string | null;
  shipping_city: string;
  shipping_county: string | null;
  shipping_postcode: string;
  shipping_country: string;
  shipping_phone: string | null;
  billing_line1: string | null;
  billing_line2: string | null;
  billing_city: string | null;
  billing_county: string | null;
  billing_postcode: string | null;
  billing_country: string | null;
  subtotal_amount: number; // in smallest currency unit
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  inkthreadable_order_id: string | null;
  inkthreadable_status: string | null;
  tracking_number: string | null;
  carrier: string | null;
  metadata: Json;
}

export interface OrderItem {
  id: string;
  created_at: string;
  order_id: string;
  product_id: string;
  product_variant_id: string;
  product_name: string;
  variant_name: string;
  variant_sku: string | null;
  inkthreadable_product_id: string | null;
  inkthreadable_variant_id: string | null;
  unit_price_amount: number; // in smallest currency unit
  quantity: number;
  total_amount: number;
  currency: string;
  metadata: Json;
}

// Helper types for joined data
export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Cart types (client-side only, not in database)
export interface CartItem {
  product_id: string;
  product_variant_id: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}
