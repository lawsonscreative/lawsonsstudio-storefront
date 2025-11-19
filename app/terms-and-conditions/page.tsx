import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-8">
            Terms and Conditions
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to Lawsons Studio. These terms and conditions outline the rules and regulations
                for the use of our website and the purchase of products from our online store.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Orders and Payment</h2>
              <p className="text-gray-700 mb-3">
                By placing an order through our website, you agree to provide current, complete, and
                accurate purchase and account information.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All prices are in GBP (£) and include VAT where applicable</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Payment is processed securely through Stripe</li>
                <li>Orders are subject to availability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Shipping and Delivery</h2>
              <p className="text-gray-700">
                We aim to dispatch orders within 3-5 business days. Delivery times may vary depending
                on your location and the shipping method selected.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Returns and Refunds</h2>
              <p className="text-gray-700 mb-3">
                You have the right to return products within 14 days of receipt for a full refund,
                provided they are in their original condition with all tags attached.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Custom or personalized items cannot be returned unless faulty</li>
                <li>Return shipping costs are the responsibility of the customer</li>
                <li>Refunds will be processed within 7-10 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700">
                All content on this website, including designs, logos, and images, is the property of
                Lawsons Studio and is protected by copyright and trademark laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700">
                Lawsons Studio shall not be liable for any indirect, incidental, special, consequential,
                or punitive damages resulting from your use of our website or products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-700">
                For any questions regarding these terms and conditions, please contact us through our
                website or email.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-brand-accent hover:text-brand-accent-light font-medium"
            >
              ← Back to shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
