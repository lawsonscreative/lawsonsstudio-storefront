import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { requireAdmin } from '@/lib/auth/admin-permissions';

/**
 * GET /api/admin/roles
 * List all available admin roles
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Any admin can view roles
    await requireAdmin(user?.id);

    const { data: roles, error } = await supabase
      .from('admin_roles')
      .select('*')
      .order('key');

    if (error) {
      console.error('Failed to fetch roles:', error);
      return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }

    return NextResponse.json(roles || []);
  } catch (error: any) {
    console.error('Get roles error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}
