# Lawsons Studio Storefront

**Multi-tenant e-commerce platform for print-on-demand merchandise**

Built with Next.js 14, Supabase, Stripe, and Inkthreadable.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000
```

---

## 📋 Prerequisites

1. **Node.js** 18+ installed
2. **Supabase project** created and migrations run
3. **Stripe account** (test mode keys)
4. **Inkthreadable account** (API credentials)

---

## ⚙️ Environment Setup

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Inkthreadable
INKTHREADABLE_APP_ID=APP-...
INKTHREADABLE_SECRET_KEY=...
INKTHREADABLE_MODE=dry-run  # or 'live'
```

---

## 📚 Documentation

- **[Platform Overview](docs/platform-overview.md)** – Architecture and requirements
- **[Brand Guidelines](docs/brand-lawsons-studio.md)** – Lawsons Studio branding
- **[Database Schema](docs/database-schema.md)** – Complete schema documentation
- **[MVP Complete](docs/MVP-COMPLETE.md)** – ✅ **START HERE** – What's built and how to test

---

## 🎯 Features

### ✅ Implemented

- **Multi-tenant architecture** (ready for multiple brands)
- **Product catalog** with variants
- **Shopping cart** with localStorage persistence
- **Checkout flow** with address forms
- **Stripe payment integration**
- **Inkthreadable POD fulfillment** (with dry-run mode)
- **Order management** via webhooks
- **Brand-aware theming**
- **Customer & admin portal stubs**

### 🔜 Coming Soon

- Customer authentication (login/signup)
- UK address autocomplete
- Email notifications
- Shipping & tax calculation
- Order tracking
- Admin authentication

---

## 🗂️ Project Structure

```
lawsonsstudio-storefront/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── products/[slug]/          # Product detail pages
│   ├── checkout/                 # Checkout flow
│   ├── customer/orders/          # Customer portal
│   ├── admin/orders/             # Admin portal
│   └── api/                      # API routes
│       ├── checkout/create-session/  # Stripe checkout
│       └── stripe/webhook/       # Stripe webhooks
├── components/                   # React components
│   ├── brand/                    # Brand components
│   ├── cart/                     # Cart components
│   ├── layout/                   # Layout components
│   └── products/                 # Product components
├── lib/                          # Utilities
│   ├── brand/                    # Brand resolution
│   ├── cart/                     # Cart state management
│   ├── inkthreadable/            # Inkthreadable API client
│   ├── products/                 # Product queries
│   ├── supabase/                 # Supabase clients
│   └── utils/                    # Helpers
├── types/                        # TypeScript types
├── supabase/migrations/          # Database migrations
└── docs/                         # Documentation
```

---

## 🏃‍♂️ Running the Platform

### Development

```bash
npm run dev
```

Server runs on http://localhost:3000 (or 3001 if 3000 is in use)

### Build

```bash
npm run build
npm start
```

---

## 📦 Adding Products

### Option 1: Supabase UI

1. Go to Supabase → Table Editor
2. Insert into `products` table
3. Insert into `product_variants` table with pricing

### Option 2: SQL (example)

```sql
-- Get brand ID
SELECT id FROM brands WHERE slug = 'lawsons-studio';

-- Insert product
INSERT INTO products (brand_id, name, slug, description, is_active, primary_image_url, inkthreadable_product_id)
VALUES ('brand-uuid', 'Logo T-Shirt', 'logo-tshirt', 'Classic tee', true, '/images/tshirt.jpg', 'INK123');

-- Insert variant
INSERT INTO product_variants (product_id, name, price_amount, currency, is_active, is_in_stock, size, color, inkthreadable_variant_id)
VALUES ('product-uuid', 'Medium - Black', 2499, 'GBP', true, true, 'M', 'Black', 'VAR123');
```

---

## 🧪 Testing

### Test Cards (Stripe)

- **Success**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0027 6000 3184`
- **Declined**: `4000 0000 0000 0002`

### Dry-Run Mode

Set `INKTHREADABLE_MODE=dry-run` to test without placing real orders.

### Full Checkout Flow

1. Add test products (see above)
2. Browse homepage → Click product
3. Select variant → Add to cart
4. Click cart icon → Proceed to checkout
5. Fill form → Proceed to payment
6. Use test card → Complete payment
7. Check Supabase orders table
8. Check console logs for Inkthreadable dry-run output

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

Compatible with any Node.js hosting:
- Railway
- Render
- Fly.io
- AWS Amplify

---

## 🔒 Security

- ✅ RLS policies on all database tables
- ✅ Stripe webhook signature verification
- ✅ Inkthreadable SHA1 signatures
- ✅ Server-side cart validation
- ✅ Service role for privileged operations
- ✅ No secrets exposed to client

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: Create a GitHub issue
- **Email**: platform@lawsonsenterprises.com

---

## 📄 License

Proprietary – Lawsons Enterprises Ltd

---

## 🙏 Built With

- [Next.js](https://nextjs.org/) – React framework
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [Supabase](https://supabase.com/) – Database & auth
- [Stripe](https://stripe.com/) – Payments
- [Inkthreadable](https://inkthreadable.co.uk/) – Print-on-demand

---

**Status**: ✅ MVP Complete – Ready for testing
**Version**: 1.0.0
**Last Updated**: 19 November 2025
