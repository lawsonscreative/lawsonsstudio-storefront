import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Lawsons Studio',
  description: 'Learn about how Lawsons Studio uses cookies',
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
          Cookie Policy
        </h1>
        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              1. What Are Cookies?
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used
                to make websites work more efficiently and provide information to website owners.
              </p>
              <p>
                This Cookie Policy explains how Lawsons Studio uses cookies and similar technologies on our website.
              </p>
            </div>
          </section>

          {/* Cookies We Use */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              2. Cookies We Use
            </h2>
            <div className="text-gray-700 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">2.1 Strictly Necessary Cookies</h3>
                <p className="mb-2">
                  These cookies are essential for our website to function properly. They enable basic functions like
                  page navigation, access to secure areas, and shopping cart functionality.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Cart Session:</strong> Remembers items in your shopping cart</li>
                  <li><strong>Authentication:</strong> Keeps you logged in during your session</li>
                  <li><strong>Security:</strong> Protects against fraudulent activity</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">2.2 Analytics Cookies</h3>
                <p className="mb-2">
                  We use analytics cookies to understand how visitors interact with our website. This helps us improve
                  the user experience and our services.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Usage Statistics:</strong> Track page views, bounce rates, and time spent on site</li>
                  <li><strong>Performance:</strong> Identify technical issues and improve website speed</li>
                  <li><strong>Source Tracking:</strong> Understand how users find our website</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">2.3 Payment Processing Cookies</h3>
                <p>
                  We use Stripe for secure payment processing. Stripe sets cookies to:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Detect and prevent fraud</li>
                  <li>Process payments securely</li>
                  <li>Remember your payment preferences</li>
                </ul>
                <p className="mt-2">
                  For more information, see{' '}
                  <a
                    href="https://stripe.com/cookies-policy/legal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    Stripe's Cookie Policy
                  </a>.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              3. Third-Party Services
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                We use the following third-party services that may set cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Stripe:</strong> Payment processing and fraud detection
                </li>
                <li>
                  <strong>Vercel Analytics:</strong> Website performance and usage analytics
                </li>
              </ul>
              <p>
                These third parties have their own privacy and cookie policies. We recommend reviewing them:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    Stripe Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    Vercel Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              4. Managing Cookies
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>View and delete cookies that are already on your device</li>
                <li>Block all cookies from being set</li>
                <li>Block third-party cookies only</li>
                <li>Clear all cookies when you close your browser</li>
              </ul>
              <p className="font-medium mt-4">Browser-Specific Instructions:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                <p className="text-yellow-900 text-sm">
                  <strong>Please note:</strong> If you disable cookies, some features of our website may not function properly,
                  particularly the shopping cart and checkout process.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Duration */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              5. Cookie Duration
            </h2>
            <div className="text-gray-700 space-y-3">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Session Cookies</h3>
                <p>
                  These are temporary cookies that expire when you close your browser. They are used for essential
                  functions like maintaining your shopping cart during a session.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Persistent Cookies</h3>
                <p>
                  These remain on your device for a set period or until you delete them. They are used to remember
                  your preferences and improve your experience on return visits.
                </p>
              </div>
            </div>
          </section>

          {/* Updates to Policy */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              6. Updates to This Policy
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal
                or regulatory reasons. The updated policy will be posted on this page with a revised date.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              7. Contact Us
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p><strong>Lawsons Studio</strong></p>
                <p>Email: <a href="mailto:info@lawsonsstudio.co.uk" className="text-brand-primary hover:underline">info@lawsonsstudio.co.uk</a></p>
              </div>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block rounded-lg bg-brand-primary px-6 py-3 font-medium text-brand-dark transition-colors hover:bg-brand-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
