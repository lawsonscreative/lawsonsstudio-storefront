'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';

export function AccountButton() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when route changes
  useEffect(() => {
    setShowDropdown(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  const handleSignOut = async () => {
    setShowDropdown(false);
    await signOut();
    router.push('/');
    router.refresh();
  };

  // Check if user is an admin (for now, check against environment variable)
  const isAdmin = user?.email && process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').includes(user.email);

  if (!user) {
    const loginUrl = `/auth/login${pathname !== '/' ? `?redirect=${pathname}` : ''}`;
    return (
      <Link
        href={loginUrl}
        className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="hidden sm:inline">Account</span>
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 z-20 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email}
              </p>
            </div>
            <div className="py-2">
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/5 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <div className="border-t border-gray-200 my-2" />
                </>
              )}
              <Link
                href="/customer/orders"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                Orders
              </Link>
              <Link
                href="/customer/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                Profile
              </Link>
              <Link
                href="/customer/addresses"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                Addresses
              </Link>
            </div>
            <div className="border-t border-gray-200 py-2">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
