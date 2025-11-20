'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/format';

type TimeRange = 'today' | '7days' | '30days' | 'all';

type DashboardStats = {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
  ordersByStatus: {
    paid: number;
    pending_payment: number;
    in_production: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    refunded: number;
  };
  recentOrders: any[];
  systemHealth: {
    lastWebhookSuccess: string | null;
    lastOrderDate: string | null;
  };
};

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/dashboard?range=${timeRange}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [timeRange]);

  if (loading || !stats) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'in_production':
      case 'shipped':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'today':
        return 'Today';
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case 'all':
        return 'All Time';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header with Time Range Filter */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Overview for {getTimeRangeLabel()}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === 'today'
                  ? 'bg-brand-primary text-brand-dark'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === '7days'
                  ? 'bg-brand-primary text-brand-dark'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === '30days'
                  ? 'bg-brand-primary text-brand-dark'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === 'all'
                  ? 'bg-brand-primary text-brand-dark'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* System Health Strip */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-900">System Status: Operational</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div>
                <span className="font-medium">Last Webhook:</span>{' '}
                {stats.systemHealth.lastWebhookSuccess
                  ? new Date(stats.systemHealth.lastWebhookSuccess).toLocaleString('en-GB')
                  : 'Never'}
              </div>
              <div>
                <span className="font-medium">Last Order:</span>{' '}
                {stats.systemHealth.lastOrderDate
                  ? new Date(stats.systemHealth.lastOrderDate).toLocaleString('en-GB')
                  : 'No orders yet'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Now Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Customers */}
          <Link
            href="/admin/customers"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-brand-primary hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <div className="bg-blue-100 group-hover:bg-blue-200 p-3 rounded-lg transition-colors">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Click to view all customers</p>
          </Link>

          {/* Total Orders */}
          <Link
            href="/admin/orders"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-brand-primary hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="bg-green-100 group-hover:bg-green-200 p-3 rounded-lg transition-colors">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Click to view all orders</p>
          </Link>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.totalRevenue, 'GBP')}</p>
              </div>
              <div className="bg-brand-primary/20 p-3 rounded-lg">
                <svg className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Excluding cancelled & pending</p>
          </div>

          {/* Active Products */}
          <Link
            href="/admin/products"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-brand-primary hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
              <div className="bg-purple-100 group-hover:bg-purple-200 p-3 rounded-lg transition-colors">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Click to manage products</p>
          </Link>
        </div>

        {/* Orders by Status Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
            Orders by Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{stats.ordersByStatus.paid}</div>
              <div className="text-xs text-green-600 mt-1">Paid</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">{stats.ordersByStatus.pending_payment}</div>
              <div className="text-xs text-yellow-600 mt-1">Pending Payment</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{stats.ordersByStatus.in_production}</div>
              <div className="text-xs text-blue-600 mt-1">In Production</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-700">{stats.ordersByStatus.shipped}</div>
              <div className="text-xs text-indigo-600 mt-1">Shipped</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-700">{stats.ordersByStatus.delivered}</div>
              <div className="text-xs text-emerald-600 mt-1">Delivered</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">{stats.ordersByStatus.cancelled}</div>
              <div className="text-xs text-gray-600 mt-1">Cancelled</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{stats.ordersByStatus.refunded}</div>
              <div className="text-xs text-red-600 mt-1">Refunded</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/products/add"
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-brand-primary/30 hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
            >
              <div className="bg-brand-primary/20 group-hover:bg-brand-primary/30 p-2 rounded-lg transition-colors">
                <svg className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Product</p>
                <p className="text-sm text-gray-600">Add new product</p>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
            >
              <div className="bg-gray-100 group-hover:bg-brand-primary/20 p-2 rounded-lg transition-colors">
                <svg className="h-5 w-5 text-gray-600 group-hover:text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Products</p>
                <p className="text-sm text-gray-600">Edit or remove products</p>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
            >
              <div className="bg-gray-100 group-hover:bg-brand-primary/20 p-2 rounded-lg transition-colors">
                <svg className="h-5 w-5 text-gray-600 group-hover:text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Orders</p>
                <p className="text-sm text-gray-600">View and update orders</p>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
            >
              <div className="bg-gray-100 group-hover:bg-brand-primary/20 p-2 rounded-lg transition-colors">
                <svg className="h-5 w-5 text-gray-600 group-hover:text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Admin Users</p>
                <p className="text-sm text-gray-600">Manage admin access</p>
              </div>
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
            >
              <div className="bg-gray-100 group-hover:bg-brand-primary/20 p-2 rounded-lg transition-colors">
                <svg className="h-5 w-5 text-gray-600 group-hover:text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">View Customers</p>
                <p className="text-sm text-gray-600">Customer information</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
              >
                View All →
              </Link>
            </div>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentOrders.map((order: any) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => window.location.href = `/admin/orders/${order.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-gray-500">{order.customer_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(order.total_amount, 'GBP')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
