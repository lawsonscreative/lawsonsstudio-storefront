import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { requireAdmin } from '@/lib/auth/admin-permissions';

/**
 * GET /api/brands
 * List all brands (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only admins can view brands list
    await requireAdmin(user?.id);

    const { data: brands, error } = await supabase
      .from('brands')
      .select('id, name, slug, is_active')
      .order('name');

    if (error) {
      console.error('Failed to fetch brands:', error);
      return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
    }

    return NextResponse.json(brands || []);
  } catch (error: any) {
    console.error('Get brands error:', error);
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}
