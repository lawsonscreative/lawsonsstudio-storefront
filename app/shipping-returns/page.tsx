import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Returns | Lawsons Studio',
  description: 'Information about delivery times, shipping costs, and our returns policy',
};

export default function ShippingReturnsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
          Shipping & Returns
        </h1>
        <p className="text-gray-600 mb-8">
          Everything you need to know about delivery and returns
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
          {/* Shipping */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Shipping Information
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Delivery Times</h3>
                <p className="text-gray-700 mb-2">
                  All Lawsons Studio products are made to order to reduce waste and ensure you receive a fresh,
                  quality product. Here's what to expect:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Production:</strong> 3-7 business days</li>
                    <li><strong>UK Delivery:</strong> 3-5 business days after production</li>
                    <li><strong>Total Time:</strong> 6-12 business days from order placement</li>
                  </ul>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  Please note: These are estimates and not guaranteed delivery times. Delays may occur during
                  busy periods or due to circumstances beyond our control.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Delivery Areas</h3>
                <p className="text-gray-700">
                  We currently deliver within the <strong>United Kingdom only</strong>. International shipping
                  may be available in the future – please check back or contact us for updates.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Shipping Costs</h3>
                <p className="text-gray-700 mb-2">
                  Shipping costs are calculated at checkout based on your delivery location and order size.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Standard UK delivery starts from £3.95</li>
                  <li>Free delivery may be offered on orders over a certain value</li>
                  <li>Any special offers will be displayed at checkout</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Order Tracking</h3>
                <p className="text-gray-700">
                  Once your order is dispatched, you'll receive:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                  <li>Email notification with tracking number</li>
                  <li>Link to track your parcel with the courier</li>
                  <li>Updates in your{' '}
                    <Link href="/customer/orders" className="text-brand-primary hover:underline">
                      account dashboard
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Delivery Issues</h3>
                <p className="text-gray-700 mb-2">
                  If you experience any issues with delivery:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Check the tracking information for updates</li>
                  <li>Contact the courier directly using the tracking number</li>
                  <li>If the issue persists, email us at{' '}
                    <a href="mailto:info@lawsonsstudio.co.uk" className="text-brand-primary hover:underline">
                      info@lawsonsstudio.co.uk
                    </a>
                  </li>
                </ul>
                <p className="text-gray-700 mt-2">
                  Please inspect your order upon delivery and report any damage or missing items within 48 hours.
                </p>
              </div>
            </div>
          </section>

          {/* Returns */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Returns Policy
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Your Right to Return</h3>
                <p className="text-gray-700">
                  Under the UK Consumer Contracts Regulations 2013, you have the right to cancel your order and
                  return items within <strong>14 days of receiving your goods</strong> without giving any reason.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Return Conditions</h3>
                <p className="text-gray-700 mb-2">To be eligible for a return, items must be:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Unworn and unwashed</li>
                  <li>In original condition with all tags attached</li>
                  <li>In original packaging where possible</li>
                  <li>Free from damage, marks, or odours</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Items That Cannot Be Returned</h3>
                <p className="text-gray-700 mb-2">
                  Due to the custom, made-to-order nature of our products, the following cannot be returned
                  unless faulty:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Products customized to your specification</li>
                  <li>Products showing signs of wear or damage</li>
                  <li>Products without original tags and packaging</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">How to Return an Item</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>
                      Email us at{' '}
                      <a href="mailto:info@lawsonsstudio.co.uk" className="text-brand-primary hover:underline">
                        info@lawsonsstudio.co.uk
                      </a>{' '}
                      with:
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>Your order number</li>
                        <li>Item(s) you wish to return</li>
                        <li>Reason for return</li>
                      </ul>
                    </li>
                    <li>We'll send you return instructions and a returns address</li>
                    <li>Package the item securely in its original packaging</li>
                    <li>Send the item back using a tracked postal service</li>
                    <li>Keep your proof of postage until the return is processed</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Return Shipping Costs</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>You are responsible for return shipping costs for change-of-mind returns</li>
                  <li>We recommend using a tracked service as we cannot be held responsible for items lost in return transit</li>
                  <li>For faulty or damaged items, we will cover return postage costs</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Refund Process</h3>
                <p className="text-gray-700 mb-2">Once we receive your return:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>We'll inspect the item to ensure it meets return conditions</li>
                  <li>Refunds will be processed within 14 days of receiving the returned item</li>
                  <li>Refunds will be made to the original payment method</li>
                  <li>We may deduct reasonable costs if the item has been used or damaged</li>
                  <li>Original delivery charges are non-refundable (unless the item is faulty)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Faulty or Damaged Items */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Faulty or Damaged Items
            </h2>

            <div className="space-y-4">
              <p className="text-gray-700">
                We take pride in our quality control, but if you receive a faulty or damaged item, we'll make it right.
              </p>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">What to Do</h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Contact us within <strong>48 hours of delivery</strong></li>
                  <li>Email{' '}
                    <a href="mailto:info@lawsonsstudio.co.uk" className="text-brand-primary hover:underline">
                      info@lawsonsstudio.co.uk
                    </a>{' '}
                    with:
                    <ul className="list-disc pl-6 mt-1 space-y-1">
                      <li>Your order number</li>
                      <li>Description of the fault or damage</li>
                      <li>Clear photos showing the issue</li>
                    </ul>
                  </li>
                  <li>We'll assess the issue and respond within 48 hours</li>
                  <li>We'll arrange a replacement or full refund (your choice)</li>
                  <li>We'll cover all return postage costs for faulty items</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-900">
                  <strong>Quality Guarantee:</strong> We stand behind the quality of our products. If something
                  isn't right, we'll fix it – no questions asked.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Questions?
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                If you have any questions about shipping or returns, please get in touch:
              </p>
              <p><strong>Email:</strong>{' '}
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
