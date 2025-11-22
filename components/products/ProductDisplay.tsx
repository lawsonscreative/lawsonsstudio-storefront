'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import type { ProductWithVariants, ProductVariant } from '@/types/database';
import { formatPrice } from '@/lib/utils/format';
import { useCart } from '@/lib/cart/CartContext';

interface ProductDisplayProps {
  product: ProductWithVariants;
  variants: ProductVariant[];
}

export function ProductDisplay({ product, variants }: ProductDisplayProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Extract unique colors and sizes from variants
  const colors = useMemo(() => {
    const colorSet = new Set<string>();
    variants.forEach((v) => {
      // Extract color from variant name (e.g., "Medium - Jet Black" -> "Jet Black")
      const parts = v.name.split(' - ');
      if (parts.length > 1) {
        colorSet.add(parts[1].trim());
      }
    });
    return Array.from(colorSet);
  }, [variants]);

  const sizes = useMemo(() => {
    const sizeSet = new Set<string>();
    variants.forEach((v) => {
      // Extract size from variant name (e.g., "Medium - Jet Black" -> "Medium")
      const parts = v.name.split(' - ');
      if (parts.length > 0) {
        sizeSet.add(parts[0].trim());
      }
    });
    return Array.from(sizeSet);
  }, [variants]);

  // Set initial selections
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');

  // Find the current variant based on selections
  const selectedVariant = useMemo(() => {
    return variants.find((v) => {
      const variantName = v.name.toLowerCase();
      const colorMatch = selectedColor.toLowerCase();
      const sizeMatch = selectedSize.toLowerCase();
      return variantName.includes(colorMatch) && variantName.includes(sizeMatch);
    }) || variants[0];
  }, [variants, selectedColor, selectedSize]);

  // Get the image to display (variant-specific or product primary)
  const displayImage = useMemo(() => {
    if (selectedVariant?.image_url) {
      return selectedVariant.image_url;
    }
    return product.primary_image_url || (product.image_urls && product.image_urls[0]) || null;
  }, [selectedVariant, product]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      product_id: product.id,
      product_variant_id: selectedVariant.id,
      quantity: 1,
      product,
      variant: selectedVariant,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm">
          {displayImage ? (
            <Image
              key={displayImage}
              src={displayImage}
              alt={`${product.name} - ${selectedColor}`}
              fill
              className="object-contain p-8"
              priority
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-6 lg:py-4">
        <div className="space-y-4">
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
            {product.name}
          </h1>
          {product.description && (
            <p className="text-lg leading-relaxed text-gray-700">
              {product.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="border-t border-b border-gray-200 py-4">
          <div className="font-heading text-3xl font-bold text-brand-primary">
            {selectedVariant && formatPrice(selectedVariant.price_amount, selectedVariant.currency)}
          </div>
        </div>

        {/* Variant Selection */}
        <div className="space-y-4">
          {/* Color Selector */}
          {colors.length > 1 && (
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Color
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 font-medium focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Size Selector */}
          {sizes.length > 1 && (
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 font-medium focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* SKU Display */}
          {selectedVariant?.sku && (
            <div className="text-xs text-gray-500">
              SKU: {selectedVariant.sku}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded || !selectedVariant}
          className={`w-full rounded-lg px-8 py-4 font-heading text-lg font-bold transition-all shadow-md ${
            isAdded
              ? 'bg-green-500 text-white'
              : 'bg-brand-accent text-white hover:bg-brand-accent-light hover:shadow-lg'
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isAdded ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added to Cart!
            </span>
          ) : (
            'Add to Cart'
          )}
        </button>

        {/* Additional Info */}
        <div className="space-y-3 border-t border-gray-200 pt-8">
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg py-3 font-medium text-gray-900 transition-colors hover:text-brand-accent">
              <span className="text-sm uppercase tracking-wider">Product Details</span>
              <svg
                className="h-5 w-5 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="pb-4 pl-1 text-sm leading-relaxed text-gray-600">
              <p>High-quality print-on-demand merchandise produced exclusively for Lawsons Studio.</p>
              <p className="mt-2">Printed and shipped via Inkthreadable.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg py-3 font-medium text-gray-900 transition-colors hover:text-brand-accent">
              <span className="text-sm uppercase tracking-wider">Shipping & Returns</span>
              <svg
                className="h-5 w-5 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="pb-4 pl-1 text-sm leading-relaxed text-gray-600">
              <p>UK delivery typically 3-5 business days.</p>
              <p className="mt-2">Returns accepted within 30 days of delivery.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
