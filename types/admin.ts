/**
 * Admin System Types
 *
 * Types for the multi-tenant admin user management system.
 */

export type AdminRoleKey = 'super_admin' | 'brand_admin' | 'support' | 'viewer';

export interface AdminUser {
  id: string;
  created_at: string;
  updated_at: string;
  auth_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  metadata: Record<string, any>;
}

export interface AdminRole {
  id: string;
  created_at: string;
  key: AdminRoleKey;
  name: string;
  description: string | null;
  permissions: Record<string, any>;
  metadata: Record<string, any>;
}

export interface AdminUserRole {
  id: string;
  created_at: string;
  admin_user_id: string;
  role_id: string;
  brand_id: string | null; // NULL = cross-brand (super_admin), Non-NULL = brand-scoped
}

// Extended types with relationships
export interface AdminUserWithRoles extends AdminUser {
  admin_user_roles: Array<AdminUserRole & {
    admin_roles: AdminRole;
    brands?: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

// Permission checking result
export interface AdminPermissions {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  roles: AdminRoleKey[];
  accessibleBrandIds: string[];
  canAccessBrand: (brandId: string) => boolean;
  hasRole: (role: AdminRoleKey) => boolean;
}
