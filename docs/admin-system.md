# Admin System Documentation

This document describes the multi-tenant admin user management system for Lawsons Commerce Platform.

## Overview

The admin system provides role-based access control (RBAC) for administrative users, with brand-scoped permissions. This allows multiple brands to have their own admins while also supporting super admins who can manage all brands.

## Architecture

### Database Tables

#### `admin_users`
Stores admin user identities, linked to Supabase Auth users.

**Columns:**
- `id` (UUID, PK) - Unique admin user identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)
- `auth_user_id` (UUID, UNIQUE) - Link to Supabase Auth user
- `email` (TEXT, UNIQUE) - Admin email address
- `first_name` (TEXT) - Admin first name
- `last_name` (TEXT) - Admin last name
- `is_active` (BOOLEAN) - Whether the admin is currently active
- `metadata` (JSONB) - Additional admin data

#### `admin_roles`
Predefined role definitions with different permission levels.

**Columns:**
- `id` (UUID, PK) - Unique role identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `key` (TEXT, UNIQUE) - Role key (super_admin, brand_admin, support, viewer)
- `name` (TEXT) - Human-readable role name
- `description` (TEXT) - Role description
- `permissions` (JSONB) - Role permissions structure
- `metadata` (JSONB) - Additional role data

**Seeded Roles:**
1. **super_admin** - Full cross-brand access to all admin features and data
2. **brand_admin** - Full access to admin features for a specific brand
3. **support** - Read access plus limited actions (e.g., resend emails, update order notes)
4. **viewer** - Read-only access to brand data

#### `admin_user_roles`
Junction table linking admin users to roles, optionally scoped by brand.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `admin_user_id` (UUID, FK → admin_users.id) - Admin user reference
- `role_id` (UUID, FK → admin_roles.id) - Role reference
- `brand_id` (UUID, FK → brands.id, NULLABLE) - Brand scope (NULL = cross-brand)

**Key Concept:**
- `brand_id = NULL` → Cross-brand role (e.g., super_admin)
- `brand_id = <uuid>` → Brand-scoped role (e.g., brand_admin for Brand X)

### Permission Model

#### Permission Hierarchy

```
super_admin (brand_id = NULL)
  └─ Access to ALL brands
     └─ Full CRUD on all resources
        └─ Can manage other admins

brand_admin (brand_id = <uuid>)
  └─ Access to ONE specific brand
     └─ Full CRUD on brand resources
        └─ Cannot access other brands

support (brand_id = <uuid>)
  └─ Access to ONE specific brand
     └─ Read-only + limited actions
        └─ Cannot modify critical data

viewer (brand_id = <uuid>)
  └─ Access to ONE specific brand
     └─ Read-only access
        └─ Cannot modify anything
```

#### Brand Scoping

All admin API routes enforce brand scoping:

1. **Dashboard, Orders, Customers, Products** - Automatically filtered by accessible brands
2. **Super Admins** - See data from all brands
3. **Brand Admins** - See data only from their assigned brand(s)
4. **Support/Viewer** - Limited to their assigned brand(s)

## Setup

### 1. Run the Migration

Apply the admin system migration to your Supabase database:

```bash
# Using Supabase CLI
supabase db push

# Or run the migration file directly in Supabase SQL Editor
# File: supabase/migrations/20250120000001_create_admin_system.sql
```

This will:
- Create the admin tables
- Seed the predefined roles
- Set up RLS policies
- Create helper functions

### 2. Create Your First Admin

You have two options:

#### Option A: Using the CLI Script (Recommended)

1. First, create a Supabase Auth user (if not already exists):
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User" and create an account with your email

2. Run the admin creation script:

```bash
# Install dependencies first if needed
npm install

# Create a super admin
npm run create-admin -- --email your@email.com --role super_admin

# Or create a brand admin for a specific brand
npm run create-admin -- --email admin@brand.com --role brand_admin --brand-slug lawsons-studio
```

The script will:
- Find the Supabase Auth user by email
- Create an `admin_users` record
- Assign the specified role
- Link to the brand (if applicable)

#### Option B: Using SQL

```sql
-- 1. Get the auth user ID
SELECT id, email FROM auth.users WHERE email = 'your@email.com';

-- 2. Create admin_users record
INSERT INTO admin_users (auth_user_id, email, is_active)
VALUES ('auth-user-id-here', 'your@email.com', true)
RETURNING id;

-- 3. Get the role ID
SELECT id FROM admin_roles WHERE key = 'super_admin';

-- 4. Assign the role
INSERT INTO admin_user_roles (admin_user_id, role_id, brand_id)
VALUES ('admin-user-id-here', 'role-id-here', NULL); -- NULL = all brands
```

### 3. Test Admin Access

1. Sign in to the application with your admin email
2. You should see "Admin Dashboard" in the account dropdown
3. Click it to access the admin portal

## Usage

### Checking Admin Permissions (Server-Side)

In your API routes, use the permission utilities:

```typescript
import { requireAdmin, requireBrandAccess, requireRole } from '@/lib/auth/admin-permissions';

// Require any admin access
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const permissions = await requireAdmin(user?.id);
  // ... proceed with admin logic
}

// Require specific brand access
export async function GET(request: Request) {
  const brandId = 'some-brand-id';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await requireBrandAccess(user?.id, brandId);
  // ... proceed with brand-scoped logic
}

// Require specific role
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await requireRole(user?.id, 'super_admin');
  // ... proceed with super admin logic
}
```

### Getting Admin Permissions

```typescript
import { getAdminPermissions } from '@/lib/auth/admin-permissions';

const permissions = await getAdminPermissions(user.id);

// Check properties
permissions.isAdmin          // true if user is an admin
permissions.isSuperAdmin     // true if user is a super admin
permissions.roles            // Array of role keys
permissions.accessibleBrandIds  // Array of brand IDs user can access

// Check methods
permissions.canAccessBrand('brand-id')  // true if can access brand
permissions.hasRole('super_admin')      // true if has role
```

### Client-Side Admin Check

The frontend can check admin status via API:

```typescript
const response = await fetch('/api/admin/auth/me');
const data = await response.json();

if (data.isAdmin) {
  // Show admin UI
}
```

## Managing Admins

### Adding a New Admin

```bash
# Super admin (all brands)
npm run create-admin -- --email newadmin@example.com --role super_admin

# Brand admin (specific brand)
npm run create-admin -- --email brandadmin@example.com --role brand_admin --brand-slug lawsons-studio

# Support staff (specific brand, limited permissions)
npm run create-admin -- --email support@example.com --role support --brand-slug lawsons-studio

# Viewer (read-only)
npm run create-admin -- --email viewer@example.com --role viewer --brand-slug lawsons-studio
```

### Assigning Multiple Roles

An admin can have multiple role assignments (e.g., brand_admin for multiple brands):

```sql
-- Admin for Brand A
INSERT INTO admin_user_roles (admin_user_id, role_id, brand_id)
VALUES ('admin-id', 'brand-admin-role-id', 'brand-a-id');

-- Same admin for Brand B
INSERT INTO admin_user_roles (admin_user_id, role_id, brand_id)
VALUES ('admin-id', 'brand-admin-role-id', 'brand-b-id');
```

### Deactivating an Admin

```sql
UPDATE admin_users
SET is_active = false
WHERE email = 'admin@example.com';
```

### Removing a Role

```sql
DELETE FROM admin_user_roles
WHERE admin_user_id = 'admin-id'
  AND role_id = 'role-id'
  AND brand_id = 'brand-id'; -- or IS NULL for cross-brand roles
```

## Security

### Row Level Security (RLS)

All admin tables have RLS enabled:

- **Service role** - Full access (backend only)
- **Authenticated users** - Can view their own admin record and role assignments
- **Public** - No access

### API Security

All admin API routes check permissions:

```typescript
// All admin routes should start with this
const permissions = await requireAdmin(user?.id);

// Then check brand access if needed
if (!permissions.canAccessBrand(brandId)) {
  throw new Error('Forbidden: No access to this brand');
}
```

### Best Practices

1. **Never expose service role key** - Keep it server-side only
2. **Always check permissions** - Use `require*` functions at the start of API routes
3. **Scope by brand** - Always filter queries by accessible brand IDs
4. **Audit admin actions** - Log important admin operations
5. **Limit super admins** - Only create super admins when absolutely necessary

## Database Functions

The migration creates several helper functions:

```sql
-- Check if user is an admin
SELECT is_admin('auth-user-id');

-- Check if user has a specific role
SELECT has_admin_role('auth-user-id', 'super_admin');

-- Check if user has access to a brand
SELECT has_brand_access('auth-user-id', 'brand-id');

-- Get all brands a user can access
SELECT * FROM get_admin_accessible_brands('auth-user-id');
```

## Future Enhancements

### Planned Features

1. **Admin UI for User Management**
   - View all admins
   - Create/edit/deactivate admins
   - Assign/remove roles
   - View permission matrix

2. **Granular Permissions**
   - Per-resource permissions (orders, products, customers)
   - Action-level permissions (create, read, update, delete)
   - Custom permission sets

3. **Audit Logging**
   - Track all admin actions
   - View audit history
   - Export audit logs

4. **Invitation System**
   - Send email invitations to new admins
   - Self-service signup with approval
   - Temporary access links

## Troubleshooting

### "Unauthorized: No user authenticated"
- User is not signed in
- Check that the auth cookie is being sent

### "Forbidden: Admin access required"
- User is authenticated but not in `admin_users` table
- Run `npm run create-admin` to grant admin access

### "Forbidden: No access to this brand"
- User is an admin but not for this specific brand
- Check `admin_user_roles` to see their brand assignments
- Super admins should have `brand_id = NULL`

### Admin link not showing in UI
- Check that the user has an active `admin_users` record
- Verify `/api/admin/auth/me` returns `isAdmin: true`
- Check browser console for errors

## Migration Reference

**File:** `supabase/migrations/20250120000001_create_admin_system.sql`

**Tables Created:**
- `admin_users`
- `admin_roles`
- `admin_user_roles`

**Roles Seeded:**
- super_admin
- brand_admin
- support
- viewer

**Functions Created:**
- `is_admin(user_id UUID)`
- `has_admin_role(user_id UUID, role_key TEXT)`
- `has_brand_access(user_id UUID, brand_id UUID)`
- `get_admin_accessible_brands(user_id UUID)`
