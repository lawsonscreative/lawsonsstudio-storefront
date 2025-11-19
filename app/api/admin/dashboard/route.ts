import { NextRequest, NextResponse } from 'next/server';
import { getLawsonsStudioBrand } from '@/lib/brand/resolver';
import { getSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '30days';

    const brand = await getLawsonsStudioBrand();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const supabase = getSupabaseClient();

    // Calculate date range
    const now = new Date();
    let startDate: Date | null = null;

    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = null;
        break;
    }

    // Build query with optional date filter
    const ordersQuery = supabase
      .from('orders')
      .select('*')
      .eq('brand_id', brand.id);

    if (startDate) {
      ordersQuery.gte('created_at', startDate.toISOString());
    }

    const [
      ordersResult,
      productsResult,
    ] = await Promise.all([
      ordersQuery,
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('brand_id', brand.id)
        .eq('is_active', true),
    ]);

    const orders = ordersResult.data || [];

    // Calculate stats
    const uniqueCustomers = new Set(orders.map((o: any) => o.customer_email)).size;
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o: any) => o.status !== 'cancelled' && o.status !== 'pending_payment')
      .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const activeProducts = productsResult.count || 0;

    // Orders by status
    const ordersByStatus = {
      paid: orders.filter((o: any) => o.status === 'paid').length,
      pending_payment: orders.filter((o: any) => o.status === 'pending_payment').length,
      in_production: orders.filter((o: any) => o.status === 'in_production').length,
      shipped: orders.filter((o: any) => o.status === 'shipped').length,
      delivered: orders.filter((o: any) => o.status === 'delivered').length,
      cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
      refunded: orders.filter((o: any) => o.status === 'refunded').length,
    };

    // Recent orders (last 10)
    const recentOrders = orders
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    // System health
    const systemHealth = {
      lastWebhookSuccess: orders.find((o: any) => o.stripe_payment_intent_id)?.updated_at || null,
      lastOrderDate: orders.length > 0 ? orders[0].created_at : null,
    };

    return NextResponse.json({
      totalCustomers: uniqueCustomers,
      totalOrders,
      totalRevenue,
      activeProducts,
      ordersByStatus,
      recentOrders,
      systemHealth,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
