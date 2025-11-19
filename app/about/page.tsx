import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Lawsons Studio',
  description: 'Learn about Lawsons Studio - bold, creative, colourful fitness apparel from Kent, UK',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
          About Lawsons Studio
        </h1>
        <p className="text-gray-600 mb-8">
          Bold. Creative. Colourful.
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
          {/* Our Story */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Our Story
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Lawsons Studio is a fitness apparel brand based in Kent, UK, dedicated to creating
                bold, creative, and colourful training gear for people who train hard.
              </p>
              <p>
                We believe fitness apparel should be functional, comfortable, and make you stand out
                from the crowd. Our designs are made for real training sessions – not just mirror selfies.
              </p>
            </div>
          </section>

          {/* Our Mission */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Our Mission
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                To create premium fitness apparel that combines performance with personality.
                Every piece is designed to help you train better and express yourself.
              </p>
            </div>
          </section>

          {/* What We Offer */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              What We Offer
            </h2>
            <div className="text-gray-700 space-y-3">
              <ul className="list-disc pl-6 space-y-2">
                <li>Premium quality hoodies, t-shirts, and vests</li>
                <li>Bold, unique designs you won't find anywhere else</li>
                <li>Comfortable fabrics suitable for training and everyday wear</li>
                <li>Made to order – reducing waste and ensuring freshness</li>
                <li>Designed in Kent, UK</li>
              </ul>
            </div>
          </section>

          {/* Company Information */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Company Information
            </h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Trading Name:</strong> Lawsons Studio</p>
              <p><strong>Company Name:</strong> Lawsons Enterprises Ltd</p>
              <p><strong>Location:</strong> Kent, United Kingdom</p>
              <p><strong>Registration:</strong> Registered in England & Wales</p>
              <p><strong>Email:</strong> <a href="mailto:info@lawsonsstudio.co.uk" className="text-brand-primary hover:underline">info@lawsonsstudio.co.uk</a></p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Have questions? Want to collaborate? We'd love to hear from you.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Email us:</p>
                <p><a href="mailto:info@lawsonsstudio.co.uk" className="text-brand-primary hover:underline">info@lawsonsstudio.co.uk</a></p>
                <p className="mt-3 text-sm text-gray-600">We aim to respond within 48 hours.</p>
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
