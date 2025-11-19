import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & FAQ | Lawsons Studio',
  description: 'Frequently asked questions about Lawsons Studio products, orders, and delivery',
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
          Help & FAQ
        </h1>
        <p className="text-gray-600 mb-8">
          Find answers to common questions about our products and services
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
          {/* Orders */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Orders
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How do I place an order?</h3>
                <p className="text-gray-700">
                  Simply browse our products, select your size and colour, add items to your cart, and proceed to checkout.
                  We accept all major credit and debit cards via secure Stripe payment processing.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Can I modify or cancel my order?</h3>
                <p className="text-gray-700">
                  Once an order is placed, it goes into production immediately. Please contact us at{' '}
                  <a href="mailto:info@lawsonsstudio.co.uk" className="text-brand-primary hover:underline">
                    info@lawsonsstudio.co.uk
                  </a>{' '}
                  as soon as possible if you need to make changes.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How can I track my order?</h3>
                <p className="text-gray-700">
                  You'll receive a tracking number via email once your order has been dispatched.
                  You can also view your order status in your{' '}
                  <Link href="/customer/orders" className="text-brand-primary hover:underline">
                    account dashboard
                  </Link>.
                </p>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Delivery
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How long does delivery take?</h3>
                <p className="text-gray-700">
                  All our products are made to order. Production typically takes 3-7 business days, followed by
                  3-5 business days for UK delivery. Total delivery time is usually 6-12 business days.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Do you deliver outside the UK?</h3>
                <p className="text-gray-700">
                  Currently, we only deliver within the United Kingdom. International shipping may be available in the future.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How much does delivery cost?</h3>
                <p className="text-gray-700">
                  Delivery costs are calculated at checkout based on your location. We may offer free delivery on orders over a certain value.
                </p>
              </div>
            </div>
          </section>

          {/* Products */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Products
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">What sizes do you offer?</h3>
                <p className="text-gray-700">
                  We offer a range of sizes from S to XXL. Detailed size guides are available on each product page.
                  If you're unsure about sizing, please contact us for advice.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How do I care for my Lawsons Studio apparel?</h3>
                <p className="text-gray-700">
                  For best results, wash inside out in cold water and hang dry. Avoid tumble drying and ironing directly on printed areas.
                  Detailed care instructions are included with each item.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Are your products eco-friendly?</h3>
                <p className="text-gray-700">
                  Yes! Our made-to-order model means we don't hold excess inventory, reducing waste. We work with suppliers
                  who use ethical production methods and sustainable materials where possible.
                </p>
              </div>
            </div>
          </section>

          {/* Returns & Refunds */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Returns & Refunds
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">What is your returns policy?</h3>
                <p className="text-gray-700">
                  You have 14 days from receiving your order to return items for a refund, in accordance with UK consumer rights.
                  Items must be unworn, unwashed, and with original tags attached. See our{' '}
                  <Link href="/terms-and-conditions" className="text-brand-primary hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  for full details.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">What if my item is faulty or damaged?</h3>
                <p className="text-gray-700">
                  We'll replace or refund any faulty or damaged items. Please contact us within 48 hours of delivery
                  with photos of the issue. We'll cover return postage costs for faulty items.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How do I return an item?</h3>
                <p className="text-gray-700">
                  Email us at{' '}
                  <a href="mailto:info@lawsonsstudio.co.uk" className="text-brand-primary hover:underline">
                    info@lawsonsstudio.co.uk
                  </a>{' '}
                  with your order number and reason for return. We'll provide you with return instructions.
                </p>
              </div>
            </div>
          </section>

          {/* Payment & Security */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Payment & Security
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Is my payment information secure?</h3>
                <p className="text-gray-700">
                  Absolutely. We use Stripe for payment processing, which is one of the most secure payment platforms in the world.
                  We never store your card details on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-700">
                  We accept all major credit and debit cards including Visa, Mastercard, and American Express.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                If you can't find the answer you're looking for, please get in touch:
              </p>
              <p className="font-medium">Email:</p>
              <p>
                <a href="mailto:info@lawsonsstudio.co.uk" className="text-brand-primary hover:underline">
                  info@lawsonsstudio.co.uk
                </a>
              </p>
              <p className="mt-2 text-sm text-gray-600">We aim to respond within 48 hours.</p>
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
