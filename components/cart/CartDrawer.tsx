'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';
import { formatPrice } from '@/lib/utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - lower z-index */}
      <div
        className="fixed inset-0 z-[90] bg-black/60"
        onClick={onClose}
      />

      {/* Drawer - higher z-index, solid white background */}
      <div
        className="fixed right-0 top-0 z-[100] h-screen w-full max-w-md shadow-2xl flex flex-col"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-white">
          <h2 className="font-heading text-2xl font-bold text-gray-900">
            Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close cart"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <svg
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="mt-4 text-lg text-gray-600">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 rounded-lg bg-brand-accent px-6 py-2 font-medium text-white transition-colors hover:bg-brand-accent-light"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product_variant_id}
                  className="flex gap-4 rounded-lg border-2 border-gray-300 bg-white p-4 shadow-sm"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-200">
                    {item.product.primary_image_url || item.product.image_urls[0] ? (
                      <Image
                        src={item.product.primary_image_url || item.product.image_urls[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.variant.name}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_variant_id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_variant_id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatPrice(item.variant.price_amount * item.quantity, item.variant.currency)}
                        </div>
                        <button
                          onClick={() => removeItem(item.product_variant_id)}
                          className="text-xs text-gray-600 hover:text-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-gray-900">Subtotal</span>
              <span className="font-heading font-bold text-gray-900">
                {formatPrice(total, items[0]?.variant.currency || 'GBP')}
              </span>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-lg bg-brand-accent py-3 text-center font-semibold text-white transition-colors hover:bg-brand-accent-light"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={onClose}
              className="block w-full text-center text-sm text-gray-600 hover:text-gray-900"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
