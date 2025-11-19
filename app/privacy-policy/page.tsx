import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Lawsons Studio',
  description: 'Privacy policy for Lawsons Studio - how we collect, use, and protect your personal data',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
          Privacy Policy
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
                Lawsons Studio ("we", "us", "our") is committed to protecting and respecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
                visit our website and make purchases.
              </p>
              <p>
                We are the data controller responsible for your personal data. We comply with the UK General Data
                Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <div className="text-gray-700 space-y-3">
              <h3 className="font-medium text-gray-900 mt-4">2.1 Information You Provide</h3>
              <p>When you use our website, we may collect the following personal data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> First name, last name, username</li>
                <li><strong>Contact Data:</strong> Email address, phone number, delivery address</li>
                <li><strong>Financial Data:</strong> Payment card details (processed securely by Stripe)</li>
                <li><strong>Transaction Data:</strong> Details of purchases and payments</li>
                <li><strong>Profile Data:</strong> Your preferences, feedback, and survey responses</li>
                <li><strong>Marketing Data:</strong> Your preferences for receiving marketing communications</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">2.2 Information We Collect Automatically</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                <li><strong>Usage Data:</strong> How you use our website, products you view, pages visited</li>
                <li><strong>Location Data:</strong> Approximate location based on IP address</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">2.3 Cookies and Tracking Technologies</h3>
              <p>
                We use cookies and similar tracking technologies to enhance your experience. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential cookies:</strong> Required for the website to function (e.g., shopping cart)</li>
                <li><strong>Analytics cookies:</strong> Help us understand how you use our website</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>We use your personal data for the following purposes:</p>

              <h3 className="font-medium text-gray-900 mt-4">3.1 To Fulfill Your Orders</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and deliver your orders</li>
                <li>Manage payments and refunds</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Legal basis: Contract performance and legitimate interests</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">3.2 To Provide Customer Support</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respond to your questions and requests</li>
                <li>Handle returns and complaints</li>
                <li>Legal basis: Contract performance and legitimate interests</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">3.3 To Improve Our Services</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analyze website usage to improve user experience</li>
                <li>Develop new products and features</li>
                <li>Legal basis: Legitimate interests</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">3.4 For Marketing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send you marketing emails about new products and offers</li>
                <li>You can opt out at any time via the unsubscribe link in emails</li>
                <li>Legal basis: Consent or legitimate interests</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">3.5 For Legal Compliance</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and protect our rights</li>
                <li>Legal basis: Legal obligation and legitimate interests</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              4. How We Share Your Information
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>We do not sell your personal data. We may share your information with:</p>

              <h3 className="font-medium text-gray-900 mt-4">4.1 Service Providers</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Payment Processors:</strong> Stripe (for secure payment processing)</li>
                <li><strong>Fulfillment Partners:</strong> Inkthreadable (for product manufacturing and delivery)</li>
                <li><strong>Email Services:</strong> For sending transactional and marketing emails</li>
                <li><strong>Hosting Providers:</strong> Vercel and Supabase (for website and database hosting)</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">4.2 Legal Requirements</h3>
              <p>We may disclose your information if required by law or to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comply with legal processes or court orders</li>
                <li>Protect our rights, property, or safety</li>
                <li>Prevent fraud or security threats</li>
              </ul>

              <h3 className="font-medium text-gray-900 mt-4">4.3 Business Transfers</h3>
              <p>
                If we are involved in a merger, acquisition, or asset sale, your personal data may be transferred.
                We will provide notice before your personal data is transferred and becomes subject to a different
                Privacy Policy.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>We implement appropriate technical and organizational measures to protect your personal data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure payment processing through PCI-DSS compliant providers</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure.
                While we strive to protect your personal data, we cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>We retain your personal data only for as long as necessary:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Order Data:</strong> 7 years (for tax and accounting purposes)</li>
                <li><strong>Account Data:</strong> Until you request deletion or close your account</li>
                <li><strong>Marketing Data:</strong> Until you unsubscribe or request deletion</li>
                <li><strong>Website Analytics:</strong> 26 months maximum</li>
              </ul>
              <p className="mt-3">
                When we no longer need your personal data, we will securely delete or anonymize it.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              7. Your Rights
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>Under UK GDPR, you have the following rights regarding your personal data:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Right to Restriction:</strong> Request limitation of processing in certain circumstances</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for marketing</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (where consent is the legal basis)</li>
              </ul>

              <p className="mt-4">
                To exercise any of these rights, please contact us using the details in Section 12.
                We will respond to your request within one month.
              </p>

              <p className="mt-3">
                You also have the right to lodge a complaint with the Information Commissioner's Office (ICO)
                if you believe we have not handled your personal data properly.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              8. Children's Privacy
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Our website is not intended for children under the age of 13. We do not knowingly collect
                personal data from children under 13.
              </p>
              <p>
                If you are a parent or guardian and believe your child has provided us with personal data,
                please contact us immediately. We will delete such information from our systems.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              9. International Data Transfers
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Your personal data may be transferred to and processed in countries outside the UK.
                When we transfer data internationally, we ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Standard Contractual Clauses approved by the UK authorities</li>
                <li>Adequacy decisions confirming adequate protection</li>
                <li>Certification schemes (e.g., Privacy Shield successors)</li>
              </ul>
            </div>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              10. Third-Party Websites
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy
                practices of these websites. We encourage you to read the privacy policies of any website you visit.
              </p>
            </div>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for
                legal, operational, or regulatory reasons.
              </p>
              <p>
                We will notify you of any material changes by posting the new Privacy Policy on this page and
                updating the "Last updated" date. We may also notify you via email or a notice on our website.
              </p>
              <p>
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect
                your personal data.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your rights,
                please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p><strong>Lawsons Studio</strong></p>
                <p>Email: privacy@lawsonsstudio.co.uk</p>
                <p>General enquiries: info@lawsonsstudio.co.uk</p>
                <p className="mt-3 text-sm text-gray-600">
                  We aim to respond to all data protection enquiries within 30 days
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                <p className="font-medium text-blue-900">Information Commissioner's Office (ICO)</p>
                <p className="text-blue-800 text-sm mt-2">
                  If you are not satisfied with our response, you can lodge a complaint with the ICO:
                </p>
                <p className="text-blue-800 text-sm mt-1">
                  Website:{' '}
                  <a href="https://ico.org.uk" className="underline hover:text-blue-900" target="_blank" rel="noopener noreferrer">
                    ico.org.uk
                  </a>
                </p>
                <p className="text-blue-800 text-sm">
                  Helpline: 0303 123 1113
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
