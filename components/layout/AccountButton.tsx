'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';

interface AdminPermissions {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  roles: string[];
}

export function AccountButton() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminPerms, setAdminPerms] = useState<AdminPermissions>({
    isAdmin: false,
    isSuperAdmin: false,
    roles: [],
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is an admin via database
  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setAdminPerms({
          isAdmin: false,
          isSuperAdmin: false,
          roles: [],
        });
        return;
      }

      try {
        const response = await fetch('/api/admin/auth/me');
        const data = await response.json();
        setAdminPerms({
          isAdmin: data.isAdmin || false,
          isSuperAdmin: data.isSuperAdmin || false,
          roles: data.roles || [],
        });
      } catch (error) {
        console.error('Failed to check admin status:', error);
        setAdminPerms({
          isAdmin: false,
          isSuperAdmin: false,
          roles: [],
        });
      }
    }

    checkAdminStatus();
  }, [user]);

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
              {adminPerms.isAdmin && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {adminPerms.isSuperAdmin ? 'Super Admin' : 'Admin'}
                </div>
              )}
            </div>
            <div className="py-2">
              {adminPerms.isAdmin && (
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
