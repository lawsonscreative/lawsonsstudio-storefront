/**
 * Admin Permission Checking Utilities
 *
 * Server-side utilities for checking admin permissions and brand access.
 * All admin API routes should use these functions to enforce permissions.
 */

import { createClient } from '@/lib/auth/supabase-server';
import type { AdminPermissions, AdminRoleKey, AdminUserWithRoles } from '@/types/admin';

/**
 * Get admin user record with roles for the current authenticated user
 */
export async function getAdminUser(authUserId: string): Promise<AdminUserWithRoles | null> {
  const supabase = await createClient();

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select(`
      *,
      admin_user_roles (
        *,
        admin_roles (*),
        brands (
          id,
          name,
          slug
        )
      )
    `)
    .eq('auth_user_id', authUserId)
    .eq('is_active', true)
    .single();

  return adminUser as AdminUserWithRoles | null;
}

/**
 * Get comprehensive admin permissions for a user
 */
export async function getAdminPermissions(authUserId: string): Promise<AdminPermissions> {
  const adminUser = await getAdminUser(authUserId);

  if (!adminUser) {
    return {
      isAdmin: false,
      isSuperAdmin: false,
      roles: [],
      accessibleBrandIds: [],
      canAccessBrand: () => false,
      hasRole: () => false,
    };
  }

  // Extract roles
  const roles = adminUser.admin_user_roles.map((ur) => ur.admin_roles.key);
  const isSuperAdmin = roles.includes('super_admin');

  // Extract accessible brand IDs
  const accessibleBrandIds: string[] = [];

  for (const userRole of adminUser.admin_user_roles) {
    if (userRole.admin_roles.key === 'super_admin' && userRole.brand_id === null) {
      // Super admin has access to all brands - we'll fetch them
      const supabase = await createClient();
      const { data: brands } = await supabase.from('brands').select('id');
      if (brands) {
        accessibleBrandIds.push(...brands.map((b) => b.id));
      }
    } else if (userRole.brand_id) {
      // Brand-scoped role
      accessibleBrandIds.push(userRole.brand_id);
    }
  }

  // Remove duplicates
  const uniqueBrandIds = [...new Set(accessibleBrandIds)];

  return {
    isAdmin: true,
    isSuperAdmin,
    roles,
    accessibleBrandIds: uniqueBrandIds,
    canAccessBrand: (brandId: string) => {
      return isSuperAdmin || uniqueBrandIds.includes(brandId);
    },
    hasRole: (role: AdminRoleKey) => roles.includes(role),
  };
}

/**
 * Check if user is an admin (any role)
 */
export async function isAdmin(authUserId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('auth_user_id', authUserId)
    .eq('is_active', true)
    .single();

  return !!data;
}

/**
 * Check if user has a specific role
 */
export async function hasAdminRole(authUserId: string, roleKey: AdminRoleKey): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('admin_users')
    .select(`
      admin_user_roles!inner (
        admin_roles!inner (
          key
        )
      )
    `)
    .eq('auth_user_id', authUserId)
    .eq('is_active', true)
    .eq('admin_user_roles.admin_roles.key', roleKey)
    .single();

  return !!data;
}

/**
 * Check if user has access to a specific brand
 */
export async function hasBrandAccess(authUserId: string, brandId: string): Promise<boolean> {
  const permissions = await getAdminPermissions(authUserId);
  return permissions.canAccessBrand(brandId);
}

/**
 * Require admin access or throw error
 * Use this at the start of admin API routes
 */
export async function requireAdmin(authUserId: string | undefined): Promise<AdminPermissions> {
  if (!authUserId) {
    throw new Error('Unauthorized: No user authenticated');
  }

  const permissions = await getAdminPermissions(authUserId);

  if (!permissions.isAdmin) {
    throw new Error('Forbidden: Admin access required');
  }

  return permissions;
}

/**
 * Require specific role or throw error
 */
export async function requireRole(authUserId: string | undefined, role: AdminRoleKey): Promise<AdminPermissions> {
  const permissions = await requireAdmin(authUserId);

  if (!permissions.hasRole(role)) {
    throw new Error(`Forbidden: ${role} role required`);
  }

  return permissions;
}

/**
 * Require brand access or throw error
 */
export async function requireBrandAccess(authUserId: string | undefined, brandId: string): Promise<AdminPermissions> {
  const permissions = await requireAdmin(authUserId);

  if (!permissions.canAccessBrand(brandId)) {
    throw new Error('Forbidden: No access to this brand');
  }

  return permissions;
}
