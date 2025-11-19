import { createClient } from '@/lib/auth/supabase-server';
import { formatPrice } from '@/lib/utils/format';
import Link from 'next/link';

async function getCustomerOrders(userId: string) {
  const supabase = await createClient();

  // Get customer record
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('auth_user_id', userId)
    .single();

  if (!customer) {
    return [];
  }

  // Get orders for this customer
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      status,
      total_amount,
      currency,
      tracking_number,
      carrier,
      order_items (
        id,
        product_name,
        variant_name,
        quantity,
        unit_price_amount
      )
    `)
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false });

  return orders || [];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending_payment':
      return 'bg-yellow-100 text-yellow-800';
    case 'paid':
      return 'bg-blue-100 text-blue-800';
    case 'in_production':
      return 'bg-purple-100 text-purple-800';
    case 'shipped':
      return 'bg-green-100 text-green-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const orders = await getCustomerOrders(user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-900">Order History</h1>
        <p className="mt-2 text-gray-600">View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-brand-primary px-6 py-3 font-medium text-brand-dark hover:bg-brand-primary/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-heading text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-lg font-semibold text-gray-900">
                    {formatPrice(order.total_amount, order.currency)}
                  </p>
                  {order.tracking_number && (
                    <p className="text-sm text-gray-600 mt-1">
                      Tracking: {order.tracking_number}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-900">
                          {item.product_name} - {item.variant_name}
                        </p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {formatPrice(item.unit_price_amount * item.quantity, order.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
