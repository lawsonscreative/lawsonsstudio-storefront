import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/auth/supabase-server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // TODO: Add admin role check here
  // For now, any logged-in user can access admin

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="font-heading text-xl font-bold text-gray-900">
              Admin Portal
            </h1>
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <nav className="space-y-1 bg-white rounded-lg border border-gray-200 p-4">
              <Link
                href="/admin/products"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/admin/customers"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Customers
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="mt-8 lg:col-span-9 lg:mt-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
