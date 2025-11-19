import Link from 'next/link';

export default function CheckoutCancelledPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        {/* Warning Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 mb-6">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="font-heading text-4xl font-bold text-white mb-4">
          Payment Cancelled
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          Your payment was cancelled. Your order has not been placed and no charges were made.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="rounded-lg bg-brand-primary px-8 py-3 font-medium text-brand-dark transition-colors hover:bg-brand-primary/90"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-white/10 px-8 py-3 font-medium text-white transition-colors hover:bg-white/5"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-gray-400">
            Need help? Contact us at{' '}
            <a
              href="mailto:support@lawsonsstudio.co.uk"
              className="text-brand-primary hover:underline"
            >
              support@lawsonsstudio.co.uk
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
