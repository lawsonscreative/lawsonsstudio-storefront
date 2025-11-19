'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import type { Product, ProductVariant } from '@/types/database';

interface AddToCartButtonProps {
  product: Product;
  variant: ProductVariant;
}

export function AddToCartButton({ product, variant }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    addItem({
      product_id: product.id,
      product_variant_id: variant.id,
      quantity: 1,
      product,
      variant,
    });

    setIsAdded(true);

    // Reset after showing confirmation
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`rounded-lg px-6 py-2 font-semibold transition-all ${
        isAdded
          ? 'bg-green-500 text-white'
          : 'bg-brand-accent text-white hover:bg-brand-accent-light'
      } disabled:cursor-not-allowed shadow-sm`}
    >
      {isAdded ? (
        <span className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart!
        </span>
      ) : (
        'Add to Cart'
      )}
    </button>
  );
}
