import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { requireRole } from '@/lib/auth/admin-permissions';

/**
 * PATCH /api/admin/users/[id]
 * Update an admin user (activate/deactivate, update details)
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only super admins can update admin users
    await requireRole(user?.id, 'super_admin');

    const body = await request.json();
    const { is_active, first_name, last_name } = body;

    const updateData: any = {};
    if (typeof is_active === 'boolean') updateData.is_active = is_active;
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;

    const { data, error } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        admin_user_roles (
          id,
          brand_id,
          admin_roles (
            id,
            key,
            name,
            description
          ),
          brands (
            id,
            name,
            slug
          )
        )
      `)
      .single();

    if (error) {
      console.error('Failed to update admin user:', error);
      return NextResponse.json({ error: 'Failed to update admin user' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Update admin user error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete an admin user (removes admin access but keeps auth user)
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only super admins can delete admin users
    await requireRole(user?.id, 'super_admin');

    // Don't allow deleting yourself
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('auth_user_id')
      .eq('id', params.id)
      .single();

    if (adminUser?.auth_user_id === user?.id) {
      return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 });
    }

    const { error } = await supabase.from('admin_users').delete().eq('id', params.id);

    if (error) {
      console.error('Failed to delete admin user:', error);
      return NextResponse.json({ error: 'Failed to delete admin user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete admin user error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}
