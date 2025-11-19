'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');

    // TODO: Implement actual newsletter subscription
    // For now, just simulate success
    setTimeout(() => {
      setSubscribeStatus('success');
      setSubscribeMessage('Thanks for subscribing! Check your email to confirm.');
      setEmail('');
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About / Brand */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-brand-primary">
              Lawsons Studio
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Bold, creative, colourful fitness apparel designed for real training sessions.
              Stand out from the crowd.
            </p>
            <div className="text-gray-400 text-xs space-y-1 mb-4">
              <p>Lawsons Studio is a trading name of <strong className="text-gray-300">Lawsons Enterprises Ltd</strong></p>
              <p>Registered in England &amp; Wales</p>
              <p>Based in Kent, UK</p>
              <p>Company No: [TODO: Add from config]</p>
              <p>VAT No: [TODO: Add from config]</p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/lawsonsstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-primary transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/lawsonsstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-primary transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/lawsonsstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-primary transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-brand-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/?category=apparel" className="text-gray-300 hover:text-brand-primary transition-colors">
                  Apparel
                </Link>
              </li>
              <li>
                <Link href="/?category=accessories" className="text-gray-300 hover:text-brand-primary transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/?category=new" className="text-gray-300 hover:text-brand-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-brand-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Info */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Help & Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/customer/orders" className="text-gray-300 hover:text-brand-primary transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-brand-primary transition-colors">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="text-gray-300 hover:text-brand-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <a href="mailto:info@lawsonsstudio.co.uk" className="text-gray-300 hover:text-brand-primary transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest drops, exclusive offers, and training inspiration.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                className="w-full rounded-lg border border-gray-600 bg-brand-dark-surface px-4 py-2 text-white placeholder-gray-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                className="w-full rounded-lg bg-brand-primary px-4 py-2 font-medium text-brand-dark transition-colors hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : subscribeStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            {subscribeMessage && (
              <p className={`mt-2 text-xs ${subscribeStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {subscribeMessage}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} Lawsons Studio. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-brand-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="text-gray-400 hover:text-brand-primary transition-colors">
                Cookie Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-gray-400 hover:text-brand-primary transition-colors">
                Terms & Conditions
              </Link>
              <a href="mailto:info@lawsonsstudio.co.uk" className="text-gray-400 hover:text-brand-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            Site designed &amp; built by{' '}
            <a
              href="https://www.lawsonscreative.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-brand-primary transition-colors"
            >
              Lawsons Creative
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
