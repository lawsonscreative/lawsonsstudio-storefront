'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils/format';

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  currency: string;
  order_number: string | null;
  customer_name: string | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_county: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  billing_address_line1: string | null;
  billing_address_line2: string | null;
  billing_city: string | null;
  billing_county: string | null;
  billing_postal_code: string | null;
  billing_country: string | null;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  inkthreadable_order_id: string | null;
  tracking_number: string | null;
  carrier: string | null;
  order_items: {
    id: string;
    product_name: string;
    variant_name: string;
    quantity: number;
    unit_price_amount: number;
  }[];
};

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

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/admin/orders/${params.id}`);

        if (response.status === 404) {
          setError('Order not found');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="text-sm text-brand-primary hover:text-brand-primary/80 mb-4 inline-flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          <h1 className="font-heading text-3xl font-bold text-gray-900 mt-4">Loading...</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="text-sm text-brand-primary hover:text-brand-primary/80 mb-4 inline-flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          <h1 className="font-heading text-3xl font-bold text-gray-900 mt-4">Order Not Found</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">{error || 'The order you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  const subtotal = order.order_items?.reduce(
    (sum: number, item: any) => sum + item.unit_price_amount * item.quantity,
    0
  ) || 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="text-sm text-brand-primary hover:text-brand-primary/80 mb-4 inline-flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Order #{order.order_number || order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="mt-2 text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={`/api/admin/orders/${order.id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Invoice (PDF)
            </a>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
              {formatStatus(order.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-heading text-xl font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                    <p className="text-sm text-gray-500">{item.variant_name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.unit_price_amount * item.quantity, order.currency)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.unit_price_amount, order.currency)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(subtotal, order.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{formatPrice(order.shipping_amount || 0, order.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatPrice(order.tax_amount || 0, order.currency)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(order.total_amount, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-heading text-xl font-semibold text-gray-900">Payment Details</h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Payment Method</span>
                  <p className="font-medium text-gray-900">Stripe</p>
                </div>
                <div>
                  <span className="text-gray-600">Payment Status</span>
                  <p className="font-medium text-gray-900">{formatStatus(order.status)}</p>
                </div>
              </div>
              {order.stripe_payment_intent_id && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Stripe Payment Intent</span>
                  <p className="font-mono text-xs text-gray-900 mt-1">{order.stripe_payment_intent_id}</p>
                  <a
                    href={`https://dashboard.stripe.com/payments/${order.stripe_payment_intent_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-primary hover:text-brand-primary/80 mt-2 inline-block"
                  >
                    View in Stripe Dashboard →
                  </a>
                </div>
              )}
              {order.stripe_checkout_session_id && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Stripe Checkout Session</span>
                  <p className="font-mono text-xs text-gray-900 mt-1">{order.stripe_checkout_session_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fulfillment Details */}
          {(order.inkthreadable_order_id || order.tracking_number) && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-heading text-xl font-semibold text-gray-900">Fulfillment Details</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                {order.inkthreadable_order_id && (
                  <div>
                    <span className="text-sm text-gray-600">Inkthreadable Order ID</span>
                    <p className="font-mono text-sm text-gray-900 mt-1">{order.inkthreadable_order_id}</p>
                  </div>
                )}
                {order.tracking_number && (
                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Tracking Number</span>
                    <p className="font-medium text-gray-900 mt-1">{order.tracking_number}</p>
                    {order.carrier && (
                      <p className="text-sm text-gray-500">Carrier: {order.carrier}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-heading text-xl font-semibold text-gray-900">Customer</h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <span className="text-sm text-gray-600">Name</span>
                <p className="font-medium text-gray-900">
                  {order.customer_name || `${order.customer_first_name} ${order.customer_last_name}`}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email</span>
                <p className="text-sm text-gray-900">
                  <a href={`mailto:${order.customer_email}`} className="text-brand-primary hover:text-brand-primary/80">
                    {order.customer_email}
                  </a>
                </p>
              </div>
              {order.customer_phone && (
                <div>
                  <span className="text-sm text-gray-600">Phone</span>
                  <p className="text-sm text-gray-900">{order.customer_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address_line1 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-heading text-xl font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="px-6 py-4">
                <address className="text-sm text-gray-900 not-italic space-y-1">
                  <p>{order.shipping_address_line1}</p>
                  {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                  <p>
                    {order.shipping_city}, {order.shipping_postal_code}
                  </p>
                  {order.shipping_county && <p>{order.shipping_county}</p>}
                  <p>{order.shipping_country}</p>
                </address>
              </div>
            </div>
          )}

          {/* Billing Address */}
          {order.billing_address_line1 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-heading text-xl font-semibold text-gray-900">Billing Address</h2>
              </div>
              <div className="px-6 py-4">
                <address className="text-sm text-gray-900 not-italic space-y-1">
                  <p>{order.billing_address_line1}</p>
                  {order.billing_address_line2 && <p>{order.billing_address_line2}</p>}
                  <p>
                    {order.billing_city}, {order.billing_postal_code}
                  </p>
                  {order.billing_county && <p>{order.billing_county}</p>}
                  <p>{order.billing_country}</p>
                </address>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
