import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getLawsonsStudioBrand } from '@/lib/brand/resolver';

export async function GET(request: NextRequest) {
  try {
    const brand = await getLawsonsStudioBrand();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const supabase = await createClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        total_amount,
        currency,
        customer_email,
        customer_first_name,
        customer_last_name,
        tracking_number,
        carrier,
        inkthreadable_order_id,
        order_items (
          id,
          product_name,
          variant_name,
          quantity
        )
      `)
      .eq('brand_id', brand.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Failed to fetch orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
