import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/auth/supabase-server';

export default async function CustomerLayout({
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <nav className="space-y-1 bg-white rounded-lg border border-gray-200 p-4">
              <Link
                href="/customer/orders"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Order History
              </Link>
              <Link
                href="/customer/profile"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/customer/addresses"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Addresses
              </Link>
              <hr className="my-2 border-gray-200" />
              <Link
                href="/"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Back to Shop
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
