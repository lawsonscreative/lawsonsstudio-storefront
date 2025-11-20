import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { requireAdmin } from '@/lib/auth/admin-permissions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check admin permissions
    await requireAdmin(user?.id);

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          variant_name,
          quantity,
          unit_price_amount
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Failed to fetch order:', error);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}
