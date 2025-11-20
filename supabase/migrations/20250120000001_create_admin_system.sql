-- =====================================================
-- ADMIN SYSTEM MIGRATION
-- =====================================================
-- This migration creates the admin user management system
-- for multi-tenant brand administration.
--
-- Tables:
-- - admin_users: Admin user identities linked to Supabase Auth
-- - admin_roles: Role definitions (super_admin, brand_admin, support, viewer)
-- - admin_user_roles: Junction table linking users to roles per brand
-- =====================================================

-- =====================================================
-- 1. ADMIN USERS TABLE
-- =====================================================
-- Stores admin user identities, linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Link to Supabase Auth user
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Admin profile
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for quick lookups
CREATE INDEX idx_admin_users_auth_user_id ON admin_users(auth_user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active) WHERE is_active = true;

-- Auto-update updated_at timestamp
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. ADMIN ROLES TABLE
-- =====================================================
-- Predefined roles with different permission levels
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Role definition
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,

  -- Role hierarchy/permissions (for future use)
  permissions JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for role lookups
CREATE INDEX idx_admin_roles_key ON admin_roles(key);

-- =====================================================
-- 3. ADMIN USER ROLES TABLE (Junction)
-- =====================================================
-- Links admin users to roles, optionally scoped to a brand
-- NULL brand_id = cross-brand role (e.g., super_admin)
-- Non-NULL brand_id = brand-scoped role (e.g., brand_admin for Brand X)
CREATE TABLE IF NOT EXISTS admin_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- References
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,

  -- Prevent duplicate role assignments
  UNIQUE(admin_user_id, role_id, brand_id)
);

-- Indexes for quick permission lookups
CREATE INDEX idx_admin_user_roles_admin_user_id ON admin_user_roles(admin_user_id);
CREATE INDEX idx_admin_user_roles_brand_id ON admin_user_roles(brand_id) WHERE brand_id IS NOT NULL;
CREATE INDEX idx_admin_user_roles_lookup ON admin_user_roles(admin_user_id, brand_id);

-- =====================================================
-- 4. SEED ADMIN ROLES
-- =====================================================
-- Insert predefined admin roles
INSERT INTO admin_roles (key, name, description, permissions) VALUES
  (
    'super_admin',
    'Super Administrator',
    'Full cross-brand access to all admin features and data',
    '{"full_access": true, "manage_brands": true, "manage_admins": true}'::jsonb
  ),
  (
    'brand_admin',
    'Brand Administrator',
    'Full access to admin features for a specific brand',
    '{"brand_full_access": true, "manage_products": true, "manage_orders": true, "manage_customers": true}'::jsonb
  ),
  (
    'support',
    'Support Staff',
    'Read access plus limited actions (e.g., resend emails, update order notes)',
    '{"view_orders": true, "view_customers": true, "update_order_notes": true, "resend_emails": true}'::jsonb
  ),
  (
    'viewer',
    'Viewer',
    'Read-only access to brand data',
    '{"view_only": true, "view_orders": true, "view_customers": true, "view_products": true}'::jsonb
  )
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on all admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Service role has full access
-- These tables should only be accessed via service role or backend API
CREATE POLICY admin_users_service_role_all ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY admin_roles_service_role_all ON admin_roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY admin_user_roles_service_role_all ON admin_user_roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can view their own admin record (for UI display)
CREATE POLICY admin_users_view_own ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id AND is_active = true);

-- Authenticated users can view roles (read-only metadata)
CREATE POLICY admin_roles_view_all ON admin_roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can view their own role assignments
CREATE POLICY admin_user_roles_view_own ON admin_user_roles
  FOR SELECT
  TO authenticated
  USING (
    admin_user_id IN (
      SELECT id FROM admin_users WHERE auth_user_id = auth.uid()
    )
  );

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function to check if a user is an admin (any role)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_users au
    WHERE au.auth_user_id = user_id
      AND au.is_active = true
  );
$$;

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION has_admin_role(user_id UUID, role_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_users au
    JOIN admin_user_roles aur ON aur.admin_user_id = au.id
    JOIN admin_roles ar ON ar.id = aur.role_id
    WHERE au.auth_user_id = user_id
      AND au.is_active = true
      AND ar.key = role_key
  );
$$;

-- Function to check if a user has access to a specific brand
CREATE OR REPLACE FUNCTION has_brand_access(user_id UUID, target_brand_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_users au
    JOIN admin_user_roles aur ON aur.admin_user_id = au.id
    JOIN admin_roles ar ON ar.id = aur.role_id
    WHERE au.auth_user_id = user_id
      AND au.is_active = true
      AND (
        -- Super admin (brand_id is NULL = all brands)
        (ar.key = 'super_admin' AND aur.brand_id IS NULL)
        OR
        -- Brand-scoped role for this specific brand
        (aur.brand_id = target_brand_id)
      )
  );
$$;

-- Function to get all brands a user has access to
CREATE OR REPLACE FUNCTION get_admin_accessible_brands(user_id UUID)
RETURNS TABLE(brand_id UUID)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT DISTINCT
    CASE
      -- Super admins get all brands
      WHEN ar.key = 'super_admin' AND aur.brand_id IS NULL THEN b.id
      -- Brand-scoped admins get their specific brand
      ELSE aur.brand_id
    END AS brand_id
  FROM admin_users au
  JOIN admin_user_roles aur ON aur.admin_user_id = au.id
  JOIN admin_roles ar ON ar.id = aur.role_id
  CROSS JOIN brands b  -- For super admins to get all brands
  WHERE au.auth_user_id = user_id
    AND au.is_active = true
    AND (
      (ar.key = 'super_admin' AND aur.brand_id IS NULL)
      OR
      aur.brand_id IS NOT NULL
    );
$$;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE admin_users IS 'Admin user identities linked to Supabase Auth';
COMMENT ON TABLE admin_roles IS 'Predefined admin role definitions';
COMMENT ON TABLE admin_user_roles IS 'Junction table linking admin users to roles, optionally scoped by brand';
COMMENT ON COLUMN admin_user_roles.brand_id IS 'NULL = cross-brand role (super_admin), Non-NULL = brand-scoped role';
