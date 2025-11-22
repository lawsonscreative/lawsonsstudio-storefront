'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import type { ProductWithVariants, ProductVariant } from '@/types/database';
import { formatPrice } from '@/lib/utils/format';
import { useCart } from '@/lib/cart/CartContext';

interface ProductDisplayProps {
  product: ProductWithVariants;
  variants: ProductVariant[];
}

interface ParsedVariant {
  variant: ProductVariant;
  size: string;
  color: string;
}

export function ProductDisplay({ product, variants }: ProductDisplayProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Parse all variants and extract size/color information
  const parsedVariants = useMemo<ParsedVariant[]>(() => {
    return variants.map((v) => {
      // Extract size and color from variant name (e.g., "Medium - Jet Black")
      const parts = v.name.split(' - ');
      const size = parts.length > 0 ? parts[0].trim() : '';
      const color = parts.length > 1 ? parts[1].trim() : '';
      return { variant: v, size, color };
    });
  }, [variants]);

  // Extract unique colors and sizes
  const colors = useMemo(() => {
    const colorSet = new Set<string>();
    parsedVariants.forEach((pv) => {
      if (pv.color) colorSet.add(pv.color);
    });
    return Array.from(colorSet);
  }, [parsedVariants]);

  const sizes = useMemo(() => {
    const sizeSet = new Set<string>();
    parsedVariants.forEach((pv) => {
      if (pv.size) sizeSet.add(pv.size);
    });
    return Array.from(sizeSet);
  }, [parsedVariants]);

  // Initialize with first variant's attributes
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Set initial state once parsed variants are ready
  useEffect(() => {
    if (parsedVariants.length > 0 && !selectedColor && !selectedSize) {
      setSelectedColor(parsedVariants[0].color);
      setSelectedSize(parsedVariants[0].size);
    }
  }, [parsedVariants, selectedColor, selectedSize]);

  // Get available sizes for the selected color
  const availableSizes = useMemo(() => {
    if (!selectedColor) return sizes;
    return parsedVariants
      .filter((pv) => pv.color === selectedColor)
      .map((pv) => pv.size);
  }, [selectedColor, sizes, parsedVariants]);

  // Get available colors for the selected size
  const availableColors = useMemo(() => {
    if (!selectedSize) return colors;
    return parsedVariants
      .filter((pv) => pv.size === selectedSize)
      .map((pv) => pv.color);
  }, [selectedSize, colors, parsedVariants]);

  // Find the current variant based on exact size and color match
  const selectedVariant = useMemo(() => {
    const match = parsedVariants.find(
      (pv) => pv.size === selectedSize && pv.color === selectedColor
    );
    return match?.variant || variants[0];
  }, [parsedVariants, selectedSize, selectedColor, variants]);

  // Get the image to display (variant-specific or product primary)
  const displayImage = useMemo(() => {
    if (selectedVariant?.image_url) {
      return selectedVariant.image_url;
    }
    return product.primary_image_url || (product.image_urls && product.image_urls[0]) || null;
  }, [selectedVariant, product]);

  // Handle color change - keep size if available, otherwise switch to first available
  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    // Check if current size is available with new color
    const sizeAvailable = parsedVariants.some(
      (pv) => pv.color === newColor && pv.size === selectedSize
    );
    if (!sizeAvailable) {
      // Switch to first available size for this color
      const firstAvailableSize = parsedVariants.find((pv) => pv.color === newColor)?.size;
      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize);
      }
    }
  };

  // Handle size change - keep color if available, otherwise switch to first available
  const handleSizeChange = (newSize: string) => {
    setSelectedSize(newSize);
    // Check if current color is available with new size
    const colorAvailable = parsedVariants.some(
      (pv) => pv.size === newSize && pv.color === selectedColor
    );
    if (!colorAvailable) {
      // Switch to first available color for this size
      const firstAvailableColor = parsedVariants.find((pv) => pv.size === newSize)?.color;
      if (firstAvailableColor) {
        setSelectedColor(firstAvailableColor);
      }
    }
  };

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
          {colors.length > 0 && (
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Color
              </label>
              <select
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
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
          {sizes.length > 0 && (
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => handleSizeChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 font-medium focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
              >
                {sizes.map((size) => (
                  <option
                    key={size}
                    value={size}
                    disabled={!availableSizes.includes(size)}
                  >
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
