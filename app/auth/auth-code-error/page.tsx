import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            The email verification link is invalid or has expired. Please try signing up again or contact support if the problem persists.
          </p>
          <div className="flex gap-4">
            <Link
              href="/auth/signup"
              className="flex-1 rounded-lg bg-brand-primary px-6 py-3 font-medium text-brand-dark hover:bg-brand-primary/90 transition-colors text-center"
            >
              Sign Up Again
            </Link>
            <Link
              href="/auth/login"
              className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
