import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { requireRole } from '@/lib/auth/admin-permissions';

/**
 * GET /api/admin/users
 * List all admin users with their roles
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only super admins can view admin users
    await requireRole(user?.id, 'super_admin');

    const { data: adminUsers, error } = await supabase
      .from('admin_users')
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch admin users:', error);
      return NextResponse.json({ error: 'Failed to fetch admin users' }, { status: 500 });
    }

    return NextResponse.json(adminUsers || []);
  } catch (error: any) {
    console.error('Get admin users error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

/**
 * POST /api/admin/users
 * Create a new admin user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only super admins can create admin users
    await requireRole(user?.id, 'super_admin');

    const body = await request.json();
    const { email, first_name, last_name, role_key, brand_id } = body;

    if (!email || !role_key) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    // Check if Supabase Auth user exists with this email
    const { data: authData } = await supabase.auth.admin.listUsers();
    const authUser = authData?.users.find((u) => u.email === email);

    if (!authUser) {
      return NextResponse.json(
        { error: 'No Supabase Auth user found with this email. User must sign up first.' },
        { status: 404 }
      );
    }

    // Check if admin user already exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('auth_user_id', authUser.id)
      .single();

    let adminUserId: string;

    if (existingAdmin) {
      adminUserId = existingAdmin.id;
      // Update existing admin
      await supabase
        .from('admin_users')
        .update({
          email,
          first_name: first_name || null,
          last_name: last_name || null,
          is_active: true,
        })
        .eq('id', adminUserId);
    } else {
      // Create new admin user
      const { data: newAdmin, error: createError } = await supabase
        .from('admin_users')
        .insert({
          auth_user_id: authUser.id,
          email,
          first_name: first_name || null,
          last_name: last_name || null,
          is_active: true,
        })
        .select()
        .single();

      if (createError || !newAdmin) {
        console.error('Failed to create admin user:', createError);
        return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
      }

      adminUserId = newAdmin.id;
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
      .eq('admin_user_id', adminUserId)
      .eq('role_id', role.id)
      .eq('brand_id', brand_id || null)
      .single();

    if (!existingRole) {
      // Assign role
      const { error: assignError } = await supabase.from('admin_user_roles').insert({
        admin_user_id: adminUserId,
        role_id: role.id,
        brand_id: brand_id || null,
      });

      if (assignError) {
        console.error('Failed to assign role:', assignError);
        return NextResponse.json({ error: 'Failed to assign role' }, { status: 500 });
      }
    }

    // Fetch the created/updated admin with roles
    const { data: adminUser } = await supabase
      .from('admin_users')
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
      .eq('id', adminUserId)
      .single();

    return NextResponse.json(adminUser);
  } catch (error: any) {
    console.error('Create admin user error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}
