import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Lawsons Studio',
  description: 'Terms and conditions for purchasing from Lawsons Studio',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Welcome to Lawsons Studio. These Terms and Conditions govern your use of our website and the purchase of products from us.
                By accessing our website or making a purchase, you agree to be bound by these terms.
              </p>
              <p>
                Lawsons Studio is operated by Lawsons Creative, registered in England and Wales. Our registered address is available upon request.
              </p>
            </div>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              2. Definitions
            </h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>"We", "Us", "Our"</strong> refers to Lawsons Studio / Lawsons Creative</p>
              <p><strong>"You", "Your"</strong> refers to the customer or website visitor</p>
              <p><strong>"Products"</strong> refers to all merchandise available for purchase on our website</p>
              <p><strong>"Order"</strong> refers to your request to purchase products from us</p>
            </div>
          </section>

          {/* Orders and Payment */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              3. Orders and Payment
            </h2>
            <div className="text-gray-700 space-y-3">
              <h3 className="font-medium text-gray-900 mt-4">3.1 Order Process</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>When you place an order, you are making an offer to purchase products from us</li>
                <li>We will send you an order confirmation email acknowledging receipt of your order</li>
                <li>Our acceptance of your order occurs when we dispatch the products to you</li>
                <li>We reserve the right to refuse any order at our discretion</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">3.2 Payment</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All prices are in British Pounds (GBP) and include VAT where applicable</li>
                <li>Payment must be made in full at the time of ordering</li>
                <li>We accept payment via credit/debit card processed securely through Stripe</li>
                <li>Payment is taken immediately upon order confirmation</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">3.3 Pricing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All prices are correct at the time of publication but may change</li>
                <li>We reserve the right to alter prices without notice</li>
                <li>Price changes will not affect orders already placed and confirmed</li>
                <li>If a product is listed at an incorrect price due to an error, we will contact you</li>
              </ul>
            </div>
          </section>

          {/* Product Information */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              4. Product Information
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                We make every effort to ensure product descriptions and images are accurate. However:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Colors may vary slightly due to screen settings and printing processes</li>
                <li>Sizes may vary slightly due to the handmade nature of print-on-demand products</li>
                <li>All products are made to order and may take 3-7 business days to produce</li>
                <li>We cannot guarantee exact color matches between screen displays and physical products</li>
              </ul>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              5. Delivery
            </h2>
            <div className="text-gray-700 space-y-3">
              <h3 className="font-medium text-gray-900 mt-4">5.1 Delivery Times</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Products are made to order and typically take 3-7 business days to produce</li>
                <li>Delivery within the UK typically takes 3-5 business days after production</li>
                <li>Total delivery time is usually 6-12 business days from order placement</li>
                <li>Delivery times are estimates and not guaranteed</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">5.2 Delivery Costs</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery costs are calculated at checkout based on your location</li>
                <li>We currently deliver within the United Kingdom only</li>
                <li>Free delivery may be offered on orders over a certain value</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">5.3 Delivery Issues</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Risk of loss passes to you upon delivery</li>
                <li>Please inspect your order upon delivery</li>
                <li>Report any damage or missing items within 48 hours of delivery</li>
                <li>We are not liable for delays caused by courier services or circumstances beyond our control</li>
              </ul>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              6. Returns and Refunds
            </h2>
            <div className="text-gray-700 space-y-3">
              <h3 className="font-medium text-gray-900 mt-4">6.1 Your Right to Cancel</h3>
              <p>
                Under the Consumer Contracts Regulations 2013, you have the right to cancel your order within 14 days
                of receiving your goods without giving any reason.
              </p>

              <h3 className="font-medium text-gray-900 mt-4">6.2 Exceptions</h3>
              <p>Due to the custom, made-to-order nature of our products:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Products customized to your specification cannot be returned unless faulty</li>
                <li>Products showing signs of wear or damage cannot be returned</li>
                <li>Products without original tags and packaging cannot be returned</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">6.3 Faulty or Damaged Goods</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will replace or refund faulty or damaged products</li>
                <li>Please contact us within 48 hours of receiving a faulty product</li>
                <li>Photos of the fault or damage may be required</li>
                <li>We will cover return postage costs for faulty items</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">6.4 Refund Process</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds will be processed within 14 days of receiving the returned item</li>
                <li>Refunds will be made to the original payment method</li>
                <li>We may deduct reasonable costs if the item has been used or damaged</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <div className="text-gray-700 space-y-3">
              <ul className="list-disc pl-6 space-y-2">
                <li>All designs, logos, and content on this website are owned by Lawsons Studio</li>
                <li>You may not reproduce, distribute, or create derivative works without our permission</li>
                <li>Product images may not be used for any purpose other than making a purchase decision</li>
                <li>Unauthorized use of our intellectual property may result in legal action</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                To the extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are not liable for indirect, special, or consequential damages</li>
                <li>Our total liability shall not exceed the purchase price of the product</li>
                <li>Nothing in these terms limits our liability for death or personal injury caused by negligence</li>
                <li>Nothing in these terms limits our liability for fraud or fraudulent misrepresentation</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              9. Privacy and Data Protection
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                We are committed to protecting your privacy. Please read our{' '}
                <Link href="/privacy-policy" className="text-brand-primary hover:underline font-medium">
                  Privacy Policy
                </Link>{' '}
                to understand how we collect, use, and protect your personal information.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              10. Changes to These Terms
            </h2>
            <div className="text-gray-700 space-y-3">
              <ul className="list-disc pl-6 space-y-2">
                <li>We may update these terms from time to time</li>
                <li>Changes will be posted on this page with an updated revision date</li>
                <li>Continued use of our website after changes constitutes acceptance</li>
                <li>Material changes will be communicated via email where possible</li>
              </ul>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              11. Governing Law and Jurisdiction
            </h2>
            <div className="text-gray-700 space-y-3">
              <ul className="list-disc pl-6 space-y-2">
                <li>These terms are governed by the laws of England and Wales</li>
                <li>Any disputes will be subject to the exclusive jurisdiction of the English courts</li>
                <li>Nothing in this clause affects your statutory rights as a consumer</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p><strong>Lawsons Studio</strong></p>
                <p>Email: info@lawsonsstudio.co.uk</p>
                <p className="mt-2 text-sm text-gray-600">
                  We aim to respond to all enquiries within 48 hours
                </p>
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
