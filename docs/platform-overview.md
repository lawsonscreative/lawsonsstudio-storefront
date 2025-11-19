# Lawsons Commerce Platform – Platform Overview

## 1. Context & Goals

This repo defines **Lawsons Commerce Platform v1** – a multi-brand e-commerce platform under **Lawsons Enterprises Ltd**.

Key characteristics:

- **Multi-brand / multi-tenant** from day one.
- **Lawsons Studio** is the first live brand/tenant.
- **Print-on-demand (POD)** via Inkthreadable.
- **Payments** via Stripe.
- **Primary datastore** via Supabase.

The goal is to avoid building a one-off shop.  
Instead, this is a reusable engine where future brands (e.g. FORM ATHLETIC) can be added with minimal extra work.

---

## 2. Architecture Overview

High level:

- **Frontend app** (e.g. Next.js)  
  - Resolves the current **brand** from the domain/host.
  - Renders a brand-aware storefront (logo, colours, products).
  - Handles cart, checkout initiation and customer portal UI.

- **Supabase**
  - Single database instance for **all brands**.
  - Holds brands, products, variants, customers, addresses, orders, order items, and non-secret config.
  - Acts as the **source of truth** for commerce data.

- **Stripe**
  - Handles card payments via **Stripe Checkout**.
  - Sends webhooks on successful payment.
  - Metadata is used to link Stripe events to Supabase orders and brands.

- **Inkthreadable**
  - Receives orders **after** Stripe confirms payment.
  - Handles POD fulfilment.
  - Sends back IDs/status that are mirrored into Supabase.

All brand-specific data (products, orders, etc.) is scoped by a `brand_id`.  
Everything in the system must be **brand-aware**.

---

## 3. Environment Variables

Values are **never** committed to Git. Only the names are documented here.

### 3.1 Stripe

The platform expects the following Stripe-related environment variables:

- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Notes:

- Publishable key is used in the frontend.
- Secret key and webhook secret are **server-side only**.

### 3.2 Supabase

The platform expects the following Supabase-related environment variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Notes:

- `SUPABASE_URL` and `SUPABASE_ANON_KEY` may be used in the frontend but must still come from env.
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only** and must never be exposed to the client.

### 3.3 Inkthreadable

The platform expects the following Inkthreadable-related environment variables:

- `INKTHREADABLE_API_KEY`
- `INKTHREADABLE_BASE_URL` (optional – only if the client requires it)
- `INKTHREADABLE_WEBHOOK_SECRET` (optional – only if webhooks are used later)

All Inkthreadable secrets are **server-only**.

---

## 4. Supabase

Supabase is the primary data store for the platform.

### 4.1 Project

- Supabase project name: `lawsonsstudio-storefront`
- Supabase account: `platform@lawsonsenterprises.com`

Supabase is the **source of truth** for:

- Brands
- Products and variants
- Customers and addresses
- Orders and order items
- Any non-secret configuration

### 4.2 Environment Variables

(See section 3.2 for names.)

The expectation is:

- Local development: values set in `.env.local` (not committed).
- Production: values configured in the hosting environment.

### 4.3 Data Model (High-Level)

The core tables in Supabase will be:

- `brands`  
  - Defines each brand/tenant (e.g. Lawsons Studio, FORM ATHLETIC).  
  - Holds theme + config for each brand.

- `products`  
  - Product catalogue, scoped by `brand_id`.

- `product_variants`  
  - Size/colour/etc variants, scoped by `brand_id` and `product_id`.

- `customers`  
  - Customer identities (can later link to Supabase auth users).

- `addresses`  
  - Saved addresses for customers.

- `orders`  
  - Orders placed, including Stripe and Inkthreadable references.

- `order_items`  
  - Line items within each order.

All brand-specific data must be linked via `brand_id`, so the platform can support multiple brands from day one.

### 4.4 Security / RLS

- **Public (unauthenticated) access:**
  - Can read **only** active `products` and `product_variants` for active brands.

- **Orders and order items:**
  - All writes are performed via server-side code using the Supabase service role key.
  - RLS protects order data from being read or written by unauthorised clients.

- **Future customer accounts:**
  - RLS will be extended so authenticated users can only see their own orders and addresses.

### 4.5 Database Ownership & Workflow

The Supabase project is already created.

From this point onwards, **all database work must be done by the code assistant (Claude) via migrations and SQL/scripts**, not manually in the Supabase UI.

Requirements:

- **Schema definition & changes**
  - Claude is responsible for:
    - Creating all tables (`brands`, `products`, `product_variants`, `customers`, `addresses`, `orders`, `order_items`, etc.).
    - Adding/changing columns, indexes, constraints and enums.
    - Defining and updating RLS policies.
  - All changes must be done via:
    - SQL migration files, or
    - Whatever migration mechanism the chosen stack uses,
    **not** ad-hoc edits in the Supabase dashboard.

- **Schema documentation**
  - Claude must maintain a separate database schema document:
    - File: `docs/database-schema.md`
  - That file should describe:
    - Each table and its columns (name, type, nullable, default).
    - Relationships (FKs) and important indexes.
    - Any enums and RLS policies at a high level.

- **Connection details**
  - DB access must always use:
    - `SUPABASE_URL`
    - `SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY` (server only)
  - No hard-coded URLs or keys.

- **Single source of truth**
  - Supabase is the single source of truth for:
    - Brands
    - Products and variants
    - Customers and addresses
    - Orders and order items
  - Stripe and Inkthreadable are external systems; the database should always have enough data to reconstruct order history and status.

---

## 5. Stripe (Payments)

Stripe is used to handle all customer payments via **Stripe Checkout**.

### 5.1 Design Principles

- Supabase is the **catalogue** and pricing source of truth, **not** Stripe Products/Prices.
- Stripe is a **“money pipe”**:
  - Processes payments.
  - Provides secure checkout.
  - Emits webhooks to confirm payment.
- All Stripe calls must be **brand-aware**.

### 5.2 Environment Variables

(See section 3.1.)

### 5.3 Checkout Flow

1. User builds a cart for a given brand.
2. User clicks "Checkout".
3. Frontend calls a backend endpoint (e.g. `/api/checkout/create-session`) with:
   - Cart contents (product/variant IDs + quantities).
   - Brand context (if not inferred from domain).
   - Customer email (if available at this stage).

4. Backend:
   - Resolves the current `brand` from the domain/host.
   - Validates cart items against Supabase:
     - Products exist.
     - Variants exist.
     - Items belong to the current brand.
     - Prices and currency are correct.
   - Creates a draft `order` in Supabase:
     - `status = 'pending_payment'`
     - Stores customer email and shipping details (if provided).
     - Creates associated `order_items`.

   - Creates a **Stripe Checkout Session** with:
     - Line items based on Supabase data (no price trust in the client).
     - Metadata including:
       - `brand_id`
       - `order_id`

   - Returns the Checkout Session URL to the frontend.

5. Frontend redirects the user to Stripe Checkout.

6. After payment, Stripe redirects the user back to success/cancel URLs on the same brand domain.

### 5.4 Webhooks

- A webhook endpoint (e.g. `/api/stripe/webhook`) must:
  - Verify the event using `STRIPE_WEBHOOK_SECRET`.
  - Handle at minimum `checkout.session.completed`.

- On `checkout.session.completed`:
  - Read `brand_id` and `order_id` from `event.data.object.metadata`.
  - Lookup the relevant order in Supabase.
  - Update the order:
    - `status = 'paid'`
    - Save `stripe_checkout_session_id`.
    - Save `stripe_payment_intent_id` where applicable.

  - Trigger Inkthreadable order creation for that order (see next section).

Webhooks must always respect the brand context via `brand_id`.

---

## 6. Inkthreadable (Print-on-Demand Fulfilment)

Inkthreadable is the POD provider.  
Once Stripe confirms payment, the system must automatically create the corresponding order in Inkthreadable via their API.

### 6.1 Environment Variables

(See section 3.3 for names.)

Values are set per environment and used only in server-side code.

### 6.2 Brand-Level Configuration

Per brand, Inkthreadable configuration must be supported and stored in `brands` or a related config table, for example:

- Store/profile identifier.
- Branding/packing options (where supported).
- Default shipping method (if required).
- Currency (should match Stripe and the brand).

All Inkthreadable calls for a given order must use the configuration associated with that order’s `brand_id`.

### 6.3 Order Flow with Inkthreadable

1. Stripe marks payment as successful and sends `checkout.session.completed`.
2. The Stripe webhook handler:
   - Verifies the event.
   - Resolves `brand_id` and `order_id` from metadata.
   - Updates the order in Supabase to `status = 'paid'`.

3. The backend then:
   - Loads full order details from Supabase, including:
     - Customer and shipping details (snapshot on the order).
     - Line items from `order_items`.
     - For each line item, associated:
       - `inkthreadable_product_id`
       - `inkthreadable_variant_id` from `products` / `product_variants`.

   - Loads brand-specific Inkthreadable config for the order’s `brand_id`.

   - Builds an Inkthreadable order payload:
     - Recipient name and shipping address.
     - Line items (product + variant IDs, quantities).
     - Any branding/packing options from brand config.

   - Sends this payload to Inkthreadable’s API using `INKTHREADABLE_API_KEY`.

4. On successful creation at Inkthreadable:
   - Store `inkthreadable_order_id` on the Supabase `orders` row.
   - Set `status = 'in_production'` (or equivalent enum).
   - Optionally store an initial `inkthreadable_status`.

### 6.4 Status Updates (Future)

The schema should include fields such as:

- `inkthreadable_status`
- `tracking_number`
- `carrier`

A future job or webhook can:

- Poll Inkthreadable or receive webhooks.
- Update these fields so that the customer portal can show live order status and tracking.

### 6.5 Responsibilities

- **Supabase**: Master record of orders and fulfilment status.
- **Stripe**: Confirms that money has been successfully taken.
- **Inkthreadable**: Prints and ships; its IDs/status are mirrored into Supabase.

Claude is responsible for:

- Implementing a reusable Inkthreadable client module (server-side only).
- Wiring the Stripe webhook to trigger Inkthreadable order creation.
- Ensuring orders are not sent to Inkthreadable unless payment has succeeded.

---

## 7. Customer Accounts, Addresses & Login

### 7.1 Address Autocomplete / Postcode Lookup

- At checkout, the shipping address form must support **address autocomplete** to reduce invalid addresses.

**Behaviour:**

- As the customer starts typing (e.g. `11 Octavian W` or a postcode), show a dropdown of address suggestions from a 3rd-party address lookup service.
- On selection, automatically populate address fields:
  - Line 1
  - Line 2
  - Town/city
  - Postcode
  - Country

**Implementation notes:**

- Use a UK-focused address lookup / autocomplete provider.
- Frontend must be able to:
  - Handle free-typed addresses if lookup fails.
  - Store both:
    - The structured, validated address.
    - The original text the user entered (for debugging/support).

### 7.2 Customer Portal

The platform must include a **customer portal** (per brand) with:

- **Order history**
  - List of previous orders for the logged-in customer.
  - Per-order view:
    - Status
    - Line items
    - Totals
    - Shipping address
    - Tracking info (when available).

- **Profile & contact details**
  - Ability to update:
    - Email address
    - Mobile number
    - Default shipping and billing addresses.

- **Addresses**
  - Customers can maintain multiple saved addresses (Home, Work, etc.).
  - One default shipping address and one default billing address.
  - Orders must store a snapshot of address details at the time of purchase, so changing an address later does **not** change historical orders.

### 7.3 Shipping to Someone Else (Gifting / Surprise Shipping)

- Checkout must support **shipping to a different recipient** than the account holder.

**Requirements:**

- Separate fields for:
  - “Your details” (customer account: email, name, billing address).
  - “Shipping details” (recipient name and address).

- It must be possible to:
  - Use the customer’s default address, **or**
  - Enter a completely different shipping address (e.g. a friend’s address for a surprise gift).

- The order record should clearly distinguish:
  - Customer (who paid).
  - Shipping recipient (who receives the parcel).

- Email & notifications:
  - Order confirmations go to the **customer’s email**, not automatically to the shipping recipient (to preserve surprises).

### 7.4 Sign-Up and Login

The platform should support a modern login system, with:

- **Email + password sign-up**.
- **Social / federated login options**, e.g.:
  - Sign in with Apple
  - Sign in with Google
  - (Optionally) other providers later.

Auth requirements:

- Auth screens should be **brand-themed** (logo/colours for the current brand).
- Under the hood, there should be a shared user identity model, so one person **could** (later) have orders across multiple brands.

### 7.5 Scope Notes

For the initial MVP:

- It is acceptable to **defer** full customer accounts and the portal UI, as long as:
  - The data model (`customers`, `addresses`, `orders`) is designed with these features in mind.
  - Checkout and order creation are structured so that:
    - Accounts and order history can be added later **without** redesigning the core tables.

Long-term target:

- Account-based checkout with saved addresses.
- Brand-aware customer portal with order history and profile management.

---

## 8. Responsibilities Summary (For Claude)

When building this platform, Claude must:

- Treat this document as the **source of truth** for:
  - Architecture
  - Env var names
  - Data model responsibilities
  - Brand-aware behaviour
  - Stripe + Inkthreadable flows

- Own:
  - All Supabase schema and migrations.
  - All RLS policies.
  - All backend integration with Stripe and Inkthreadable.
  - The creation and maintenance of `docs/database-schema.md`.

- Never:
  - Ask for manual table creation in the Supabase UI.
  - Hard-code any API keys or secrets.

This file describes what the platform is and how it should behave.  
Implementation details (framework choice, exact folder structure, etc.) are left to Claude, as long as they respect these constraints.