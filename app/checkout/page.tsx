'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/lib/cart/CartContext';
import { formatPrice } from '@/lib/utils/format';
import { AddressAutocomplete } from '@/components/checkout/AddressAutocomplete';
import { useAuth } from '@/lib/auth/useAuth';
import { ensureCustomerRecord } from '@/lib/auth/ensure-customer-record';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user, supabase } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Customer details
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Shipping address
  const [recipientName, setRecipientName] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [postcode, setPostcode] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);

  // Voucher/discount code
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);

  const [showLoginPrompt, setShowLoginPrompt] = useState(true);

  // Load user data if logged in
  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        setShowLoginPrompt(true);
        return;
      }

      try {
        setShowLoginPrompt(false);
        // Set email from auth
        setEmail(user.email || '');

        // Ensure customer record exists
        await ensureCustomerRecord(user, supabase);

        // Try to load customer data
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('first_name, last_name, phone')
          .eq('auth_user_id', user.id)
          .single();

        console.log('Customer query result:', { customer, customerError, userId: user.id });

        if (customerError) {
          console.error('Error loading customer record:', customerError);
          // Customer record might not exist yet, which is okay
          return;
        }

        if (customer) {
          console.log('Setting customer data:', customer);
          setFirstName(customer.first_name || '');
          setLastName(customer.last_name || '');
          setPhone(customer.phone || '');
        } else {
          console.warn('Customer data is null even though no error occurred');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    loadUserData();
  }, [user, supabase]);

  const handleApplyVoucher = async () => {
    setVoucherError('');

    if (!voucherCode.trim()) {
      setVoucherError('Please enter a voucher code');
      return;
    }

    // TODO: Replace with actual API call to validate voucher
    // For now, this is a placeholder that shows the UI
    setVoucherError('Voucher system not yet implemented. Please check back soon!');

    /* Future implementation:
    try {
      const response = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode, subtotal: total }),
      });

      const data = await response.json();

      if (response.ok) {
        setVoucherDiscount(data.discount_amount);
        setVoucherApplied(true);
      } else {
        setVoucherError(data.error || 'Invalid voucher code');
      }
    } catch (err) {
      setVoucherError('Failed to apply voucher');
    }
    */
  };

  const handleRemoveVoucher = () => {
    setVoucherCode('');
    setVoucherDiscount(0);
    setVoucherApplied(false);
    setVoucherError('');
  };

  const finalTotal = total - voucherDiscount;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-gray-600">Add some items to your cart to checkout</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 rounded-lg bg-brand-accent px-6 py-3 font-medium text-white hover:bg-brand-accent-light transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            product_variant_id: item.product_variant_id,
            quantity: item.quantity,
          })),
          customer: {
            email,
            first_name: firstName,
            last_name: lastName,
            phone,
          },
          shipping: {
            recipient_name: recipientName || `${firstName} ${lastName}`,
            line1,
            line2,
            city,
            county,
            postcode,
            country: 'GB',
            phone,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Login Prompt for Guest Users */}
              {!user && showLoginPrompt && (
                <div className="rounded-lg border border-brand-accent bg-brand-accent/5 p-4">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-brand-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Already have an account?</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Sign in to use saved addresses and track your orders.
                      </p>
                      <div className="mt-3 flex gap-3">
                        <button
                          type="button"
                          onClick={() => router.push('/auth/login?redirect=/checkout')}
                          className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent-light"
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLoginPrompt(false)}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          Continue as guest
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Details */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="+44"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Name (leave blank to use your name)
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="For gifts to someone else"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <AddressAutocomplete
                      value={line1}
                      onChange={setLine1}
                      onAddressSelect={(address) => {
                        setLine1(address.line_1);
                        setLine2(address.line_2 || '');
                        setCity(address.town_or_city || address.locality);
                        setCounty(address.county || '');
                        setPostcode(address.postcode);
                      }}
                      placeholder="Start typing your address..."
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Start typing your address and select from suggestions
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City/Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        County
                      </label>
                      <input
                        type="text"
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      required
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-5 w-5 cursor-pointer rounded border-2 border-gray-300 text-brand-accent focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 checked:bg-brand-accent checked:border-brand-accent"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  I accept the{' '}
                  <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-accent underline hover:text-brand-accent-light"
                    onClick={(e) => e.stopPropagation()}
                  >
                    terms and conditions
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-accent underline hover:text-brand-accent-light"
                    onClick={(e) => e.stopPropagation()}
                  >
                    privacy policy
                  </a>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-lg bg-brand-accent py-4 font-heading text-lg font-semibold text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product_variant_id} className="rounded-lg border border-gray-100 p-3">
                    <div className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                        {item.product.primary_image_url || item.product.image_urls[0] ? (
                          <Image
                            src={item.product.primary_image_url || item.product.image_urls[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{item.product.name}</div>
                        <div className="text-sm text-gray-600">{item.variant.name}</div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_variant_id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_variant_id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product_variant_id)}
                            className="ml-auto text-xs text-gray-500 hover:text-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-brand-accent font-semibold text-right">
                        {formatPrice(item.variant.price_amount * item.quantity, item.variant.currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher Code */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    disabled={voucherApplied}
                    placeholder="Enter code"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:bg-gray-50"
                  />
                  {voucherApplied ? (
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {voucherError && (
                  <p className="mt-1 text-xs text-red-600">{voucherError}</p>
                )}
                {voucherApplied && (
                  <p className="mt-1 text-xs text-green-600">Voucher applied successfully!</p>
                )}
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(total, items[0]?.variant.currency || 'GBP')}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(voucherDiscount, items[0]?.variant.currency || 'GBP')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-heading text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-brand-accent">
                    {formatPrice(finalTotal, items[0]?.variant.currency || 'GBP')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
