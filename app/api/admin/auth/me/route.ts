import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getAdminPermissions } from '@/lib/auth/admin-permissions';

/**
 * GET /api/admin/auth/me
 *
 * Returns the current user's admin status and permissions.
 * Used by the frontend to check if the user is an admin and what they can access.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          isAdmin: false,
          isSuperAdmin: false,
          roles: [],
          accessibleBrandIds: [],
        },
        { status: 200 }
      );
    }

    // Get admin permissions
    const permissions = await getAdminPermissions(user.id);

    return NextResponse.json({
      isAdmin: permissions.isAdmin,
      isSuperAdmin: permissions.isSuperAdmin,
      roles: permissions.roles,
      accessibleBrandIds: permissions.accessibleBrandIds,
    });
  } catch (error) {
    console.error('Get admin status error:', error);
    return NextResponse.json(
      {
        isAdmin: false,
        isSuperAdmin: false,
        roles: [],
        accessibleBrandIds: [],
      },
      { status: 200 }
    );
  }
}
