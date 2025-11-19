'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart/useCart';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear cart on successful checkout
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/20 mb-6">
          <svg
            className="h-12 w-12 text-brand-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="font-heading text-4xl font-bold text-white mb-4">
          Order Confirmed!
        </h1>

        <p className="text-lg text-gray-300 mb-2">
          Thank you for your order. We've received your payment and your order is now being processed.
        </p>

        <p className="text-gray-400 mb-8">
          You'll receive an email confirmation shortly with your order details and tracking information.
        </p>

        {sessionId && (
          <div className="rounded-lg border border-white/10 bg-brand-dark-surface p-4 mb-8">
            <p className="text-sm text-gray-400">Order Reference</p>
            <p className="font-mono text-sm text-white">{sessionId}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="rounded-lg bg-brand-primary px-8 py-3 font-medium text-brand-dark transition-colors hover:bg-brand-primary/90"
          >
            Continue Shopping
          </Link>

          <Link
            href="/customer/orders"
            className="rounded-lg border border-white/10 px-8 py-3 font-medium text-white transition-colors hover:bg-white/5"
          >
            View Orders
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 border-t border-white/10 pt-8 text-left">
          <h2 className="font-heading text-xl font-semibold text-white mb-4">
            What happens next?
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Your order will be printed and prepared for shipping</span>
            </li>
            <li className="flex gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>You'll receive a dispatch notification with tracking information</span>
            </li>
            <li className="flex gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Delivery typically takes 3-5 business days within the UK</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
