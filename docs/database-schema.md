# Database Schema Documentation

This document describes the Supabase database schema for Lawsons Commerce Platform.

## Overview

The platform uses a **multi-tenant architecture** where all data is scoped by `brand_id`. This allows multiple brands to share the same database while maintaining complete data isolation.

## Tables

### `brands`

Stores configuration for each brand/tenant in the platform.

**Columns:**
- `id` (UUID, PK) - Unique brand identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)
- `name` (TEXT) - Brand display name
- `slug` (TEXT, UNIQUE) - URL-safe brand identifier (e.g., "lawsons-studio")
- `primary_domain` (TEXT) - Primary domain for the brand (e.g., "lawsonsstudio.co.uk")
- `is_active` (BOOLEAN) - Whether the brand is currently active
- `logo_url` (TEXT) - Path to brand logo
- `primary_color` (TEXT) - Primary brand color (hex)
- `secondary_color` (TEXT) - Secondary brand color (hex)
- `accent_color` (TEXT) - Accent brand color (hex)
- `background_color_dark` (TEXT) - Dark background color (hex)
- `inkthreadable_store_id` (TEXT) - Inkthreadable store/profile identifier
- `inkthreadable_shipping_method` (TEXT) - Default shipping method for Inkthreadable
- `currency` (TEXT) - Currency code (e.g., "GBP")
- `metadata` (JSONB) - Additional brand-specific configuration

**Indexes:**
- `idx_brands_slug` on `slug`
- `idx_brands_primary_domain` on `primary_domain`

**RLS Policies:**
- Public can SELECT active brands (`is_active = true`)

---

### `products`

Product catalog, scoped by `brand_id`.

**Columns:**
- `id` (UUID, PK) - Unique product identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)
- `brand_id` (UUID, FK → brands.id) - Brand this product belongs to
- `name` (TEXT) - Product name
- `slug` (TEXT) - URL-safe product identifier (unique per brand)
- `description` (TEXT) - Product description
- `is_active` (BOOLEAN) - Whether the product is currently active
- `inkthreadable_product_id` (TEXT) - Inkthreadable product ID for POD fulfillment
- `image_urls` (TEXT[]) - Array of product image URLs
- `primary_image_url` (TEXT) - Main product image URL
- `metadata` (JSONB) - Additional product data

**Constraints:**
- UNIQUE (`brand_id`, `slug`) - Ensures unique slugs per brand

**Indexes:**
- `idx_products_brand_id` on `brand_id`
- `idx_products_is_active` on `is_active`

**RLS Policies:**
- Public can SELECT active products of active brands

---

### `product_variants`

Product variants (size, color, etc.) with pricing.

**Columns:**
- `id` (UUID, PK) - Unique variant identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)
- `product_id` (UUID, FK → products.id) - Product this variant belongs to
- `name` (TEXT) - Variant name (e.g., "Large - Black")
- `sku` (TEXT) - Stock Keeping Unit
- `is_active` (BOOLEAN) - Whether the variant is currently active
- `price_amount` (INTEGER) - Price in smallest currency unit (e.g., pence for GBP)
- `currency` (TEXT) - Currency code (e.g., "GBP")
- `inkthreadable_variant_id` (TEXT) - Inkthreadable variant ID for POD fulfillment
- `stock_quantity` (INTEGER) - Available stock quantity
- `is_in_stock` (BOOLEAN) - Whether the variant is in stock
- `size` (TEXT) - Size attribute (e.g., "L", "XL")
- `color` (TEXT) - Color attribute (e.g., "Black", "White")
- `attributes` (JSONB) - Additional variant attributes
- `metadata` (JSONB) - Additional variant data

**Indexes:**
- `idx_product_variants_product_id` on `product_id`
- `idx_product_variants_is_active` on `is_active`
- `idx_product_variants_sku` on `sku` (where sku IS NOT NULL)

**RLS Policies:**
- Public can SELECT active variants of active products of active brands

---

### `customers`

Customer identities and accounts.

**Columns:**
- `id` (UUID, PK) - Unique customer identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)
- `email` (TEXT, UNIQUE) - Customer email address
- `first_name` (TEXT) - Customer first name
- `last_name` (TEXT) - Customer last name
- `phone` (TEXT) - Customer phone number
- `auth_user_id` (UUID, UNIQUE) - Optional link to Supabase Auth user
- `metadata` (JSONB) - Additional customer data

**Indexes:**
- `idx_customers_email` on `email`
- `idx_customers_auth_user_id` on `auth_user_id` (where auth_user_id IS NOT NULL)

**RLS Policies:**
- Service role has full access
- Future: authenticated users can view/update their own record

---

### `addresses`

Saved customer addresses for shipping and billing.

**Columns:**
- `id` (UUID, PK) - Unique address identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)
- `customer_id` (UUID, FK → customers.id) - Customer this address belongs to
- `label` (TEXT) - Address label (e.g., "Home", "Work")
- `is_default_shipping` (BOOLEAN) - Whether this is the default shipping address
- `is_default_billing` (BOOLEAN) - Whether this is the default billing address
- `recipient_name` (TEXT) - Recipient name for delivery
- `line1` (TEXT) - Address line 1
- `line2` (TEXT) - Address line 2
- `city` (TEXT) - City/town
- `county` (TEXT) - County/state
- `postcode` (TEXT) - Postcode/ZIP code
- `country` (TEXT) - Country code (e.g., "GB")
- `phone` (TEXT) - Phone number for delivery
- `original_input` (TEXT) - Original address text entered by customer (for debugging)
- `metadata` (JSONB) - Additional address data

**Indexes:**
- `idx_addresses_customer_id` on `customer_id`
- `idx_addresses_default_shipping` on `(customer_id, is_default_shipping)` (where is_default_shipping = true)
- `idx_addresses_default_billing` on `(customer_id, is_default_billing)` (where is_default_billing = true)

**RLS Policies:**
- Service role has full access
- Future: authenticated users can view/manage their own addresses

---

### `orders`

Orders placed by customers, including Stripe and Inkthreadable references.

**Columns:**
- `id` (UUID, PK) - Unique order identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)
- `brand_id` (UUID, FK → brands.id) - Brand this order belongs to
- `customer_id` (UUID, FK → customers.id) - Customer who placed the order
- `status` (order_status) - Order lifecycle status
- `customer_email` (TEXT) - Snapshot of customer email at time of order
- `customer_first_name` (TEXT) - Snapshot of customer first name
- `customer_last_name` (TEXT) - Snapshot of customer last name
- `customer_phone` (TEXT) - Snapshot of customer phone
- `shipping_recipient_name` (TEXT) - Recipient name for delivery (may differ from customer for gifts)
- `shipping_line1` (TEXT) - Shipping address line 1
- `shipping_line2` (TEXT) - Shipping address line 2
- `shipping_city` (TEXT) - Shipping city/town
- `shipping_county` (TEXT) - Shipping county/state
- `shipping_postcode` (TEXT) - Shipping postcode/ZIP
- `shipping_country` (TEXT) - Shipping country code
- `shipping_phone` (TEXT) - Shipping phone number
- `billing_line1` (TEXT) - Billing address line 1 (optional, can differ from shipping)
- `billing_line2` (TEXT) - Billing address line 2
- `billing_city` (TEXT) - Billing city/town
- `billing_county` (TEXT) - Billing county/state
- `billing_postcode` (TEXT) - Billing postcode/ZIP
- `billing_country` (TEXT) - Billing country code
- `subtotal_amount` (INTEGER) - Subtotal in smallest currency unit (e.g., pence)
- `shipping_amount` (INTEGER) - Shipping cost in smallest currency unit
- `tax_amount` (INTEGER) - Tax amount in smallest currency unit
- `total_amount` (INTEGER) - Total amount in smallest currency unit
- `currency` (TEXT) - Currency code (e.g., "GBP")
- `stripe_checkout_session_id` (TEXT, UNIQUE) - Stripe Checkout Session ID
- `stripe_payment_intent_id` (TEXT) - Stripe Payment Intent ID
- `inkthreadable_order_id` (TEXT, UNIQUE) - Inkthreadable order ID for POD fulfillment
- `inkthreadable_status` (TEXT) - Current status from Inkthreadable
- `tracking_number` (TEXT) - Shipping tracking number
- `carrier` (TEXT) - Shipping carrier
- `metadata` (JSONB) - Additional order data

**Enum: `order_status`**
- `pending_payment` - Order created, awaiting payment
- `paid` - Payment confirmed by Stripe
- `in_production` - Order sent to Inkthreadable for fulfillment
- `shipped` - Order shipped by Inkthreadable
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled
- `refunded` - Payment refunded

**Indexes:**
- `idx_orders_brand_id` on `brand_id`
- `idx_orders_customer_id` on `customer_id`
- `idx_orders_status` on `status`
- `idx_orders_stripe_checkout_session_id` on `stripe_checkout_session_id` (where not null)
- `idx_orders_inkthreadable_order_id` on `inkthreadable_order_id` (where not null)
- `idx_orders_created_at` on `created_at DESC`

**RLS Policies:**
- Service role has full access
- Future: authenticated users can view their own orders

---

### `order_items`

Line items within each order (snapshots product/variant details at time of order).

**Columns:**
- `id` (UUID, PK) - Unique order item identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `order_id` (UUID, FK → orders.id) - Order this item belongs to
- `product_id` (UUID, FK → products.id) - Product reference
- `product_variant_id` (UUID, FK → product_variants.id) - Variant reference
- `product_name` (TEXT) - Snapshot of product name at time of order
- `variant_name` (TEXT) - Snapshot of variant name at time of order
- `variant_sku` (TEXT) - Snapshot of variant SKU at time of order
- `inkthreadable_product_id` (TEXT) - Inkthreadable product ID
- `inkthreadable_variant_id` (TEXT) - Inkthreadable variant ID
- `unit_price_amount` (INTEGER) - Unit price in smallest currency unit at time of order
- `quantity` (INTEGER) - Quantity ordered (must be > 0)
- `total_amount` (INTEGER) - Total line item amount in smallest currency unit
- `currency` (TEXT) - Currency code (e.g., "GBP")
- `metadata` (JSONB) - Additional line item data

**Indexes:**
- `idx_order_items_order_id` on `order_id`
- `idx_order_items_product_id` on `product_id`
- `idx_order_items_product_variant_id` on `product_variant_id`

**RLS Policies:**
- Service role has full access
- Future: authenticated users can view items of their own orders

---

## Relationships

```
brands
  ↓ 1:N
  products
    ↓ 1:N
    product_variants

customers
  ↓ 1:N
  addresses

brands + customers
  ↓ N:1 + N:1
  orders
    ↓ 1:N
    order_items
      ↓ N:1
      products + product_variants
```

---

## Key Design Patterns

### Multi-tenancy
All brand-specific data tables include a `brand_id` foreign key to `brands.id`. This allows:
- Multiple brands to share the same database
- Complete data isolation via RLS policies
- Efficient brand-based queries via indexes

### Snapshot Pattern
Orders and order_items store **snapshots** of customer and product data at the time of purchase. This ensures:
- Historical orders remain accurate even if products/prices change
- Customer address changes don't affect past orders
- Audit trail for pricing and product details

### Price Storage
All monetary amounts are stored in the **smallest currency unit** (e.g., pence for GBP, cents for USD). This:
- Avoids floating-point precision issues
- Ensures accurate calculations
- Follows Stripe's pricing model

### RLS Security Model
- **Public access**: Read-only for active brands, products, and variants
- **Private access**: Orders, customers, and addresses require service role or authenticated user
- **Future**: Authenticated users can only access their own data via `auth.uid()` policies

---

## Migration Files

All schema changes are tracked in migrations:

1. `20250119000001_create_brands.sql` - Brands table and RLS
2. `20250119000002_create_products.sql` - Products and variants with RLS
3. `20250119000003_create_customers.sql` - Customers and addresses with RLS
4. `20250119000004_create_orders.sql` - Orders and order_items with RLS

---

## Environment Variables

Database access requires the following environment variables (defined in `.env.local`):

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key (safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (**server-only**, bypasses RLS)

---

## Future Enhancements

### Authentication Integration
- Link `customers.auth_user_id` to Supabase Auth `auth.users.id`
- Add RLS policies for authenticated users to view/edit their own data
- Implement social login (Google, Apple)

### Order History
- Add RLS policy: `auth.uid() = customers.auth_user_id` for order access
- Customer portal to view order history and tracking

### Webhooks
- Add table for tracking Inkthreadable webhook events
- Store status updates and tracking info from Inkthreadable
