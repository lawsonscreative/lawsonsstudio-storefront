-- =====================================================
-- CREATE FIRST SUPER ADMIN
-- =====================================================
-- This migration automatically creates the first super admin
-- for andy@lawsonsenterprises.com
-- =====================================================

DO $$
DECLARE
  v_auth_user_id UUID;
  v_admin_user_id UUID;
  v_super_admin_role_id UUID;
BEGIN
  -- 1. Get the auth user ID for andy@lawsonsenterprises.com
  SELECT id INTO v_auth_user_id
  FROM auth.users
  WHERE email = 'andy@lawsonsenterprises.com';

  -- Only proceed if the user exists
  IF v_auth_user_id IS NOT NULL THEN
    -- 2. Create admin user (or get existing)
    INSERT INTO admin_users (auth_user_id, email, is_active)
    VALUES (v_auth_user_id, 'andy@lawsonsenterprises.com', true)
    ON CONFLICT (auth_user_id)
    DO UPDATE SET is_active = true
    RETURNING id INTO v_admin_user_id;

    -- 3. Get the super_admin role ID
    SELECT id INTO v_super_admin_role_id
    FROM admin_roles
    WHERE key = 'super_admin';

    -- 4. Assign super_admin role (if not already assigned)
    INSERT INTO admin_user_roles (admin_user_id, role_id, brand_id)
    VALUES (v_admin_user_id, v_super_admin_role_id, NULL)
    ON CONFLICT (admin_user_id, role_id, brand_id) DO NOTHING;

    RAISE NOTICE 'Super admin created successfully for andy@lawsonsenterprises.com';
  ELSE
    RAISE NOTICE 'Auth user not found for andy@lawsonsenterprises.com - please create the Supabase Auth user first, then run this migration again';
  END IF;
END $$;
