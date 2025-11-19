import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { CartButton } from '../cart/CartButton';
import { AccountButton } from './AccountButton';
import type { Brand } from '@/types/database';

interface HeaderProps {
  brand: Brand;
}

export function Header({ brand }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo brand={brand} />

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Shop
          </Link>
          <Link
            href="/customer/orders"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Orders
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <AccountButton />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
