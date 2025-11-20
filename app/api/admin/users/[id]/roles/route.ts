import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { requireRole } from '@/lib/auth/admin-permissions';

/**
 * POST /api/admin/users/[id]/roles
 * Add a role to an admin user
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only super admins can manage roles
    await requireRole(user?.id, 'super_admin');

    const body = await request.json();
    const { role_key, brand_id } = body;

    if (!role_key) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Get role ID
    const { data: role } = await supabase.from('admin_roles').select('id').eq('key', role_key).single();

    if (!role) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if role assignment already exists
    const { data: existingRole } = await supabase
      .from('admin_user_roles')
      .select('id')
      .eq('admin_user_id', params.id)
      .eq('role_id', role.id)
      .eq('brand_id', brand_id || null)
      .single();

    if (existingRole) {
      return NextResponse.json({ error: 'Role already assigned' }, { status: 400 });
    }

    // Assign role
    const { error } = await supabase.from('admin_user_roles').insert({
      admin_user_id: params.id,
      role_id: role.id,
      brand_id: brand_id || null,
    });

    if (error) {
      console.error('Failed to assign role:', error);
      return NextResponse.json({ error: 'Failed to assign role' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Add role error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

/**
 * DELETE /api/admin/users/[id]/roles/[roleAssignmentId]
 * Remove a role from an admin user
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only super admins can manage roles
    await requireRole(user?.id, 'super_admin');

    const { searchParams } = new URL(request.url);
    const roleAssignmentId = searchParams.get('assignment_id');

    if (!roleAssignmentId) {
      return NextResponse.json({ error: 'Role assignment ID is required' }, { status: 400 });
    }

    const { error } = await supabase.from('admin_user_roles').delete().eq('id', roleAssignmentId);

    if (error) {
      console.error('Failed to remove role:', error);
      return NextResponse.json({ error: 'Failed to remove role' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Remove role error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}
