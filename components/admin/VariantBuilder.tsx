'use client';

import { useState } from 'react';

interface GeneratedVariant {
  name: string;
  sku: string;
  price_amount: number;
  currency: string;
  is_active: boolean;
  is_in_stock: boolean;
  inkthreadable_sku?: string;
  image_url?: string;
}

interface VariantBuilderProps {
  skuPrefix: string; // e.g., "LS-VEST-EMP"
  inkthreadableBaseCode: string; // e.g., "JC015"
  defaultPrice: number;
  onGenerate: (variants: GeneratedVariant[]) => void;
}

// Standard size options
const STANDARD_SIZES = [
  { name: 'XS', code: 'XS' },
  { name: 'Small', code: 'S' },
  { name: 'Medium', code: 'M' },
  { name: 'Large', code: 'L' },
  { name: 'XL', code: 'XL' },
  { name: 'XXL', code: 'XXL' },
  { name: '3XL', code: '3XL' },
  { name: '4XL', code: '4XL' },
  { name: '5XL', code: '5XL' },
];

export function VariantBuilder({
  skuPrefix,
  inkthreadableBaseCode,
  defaultPrice,
  onGenerate
}: VariantBuilderProps) {
  const [colorName, setColorName] = useState('');
  const [colorCode, setColorCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set(['S', 'M', 'L']));
  const [price, setPrice] = useState(defaultPrice);

  const toggleSize = (sizeCode: string) => {
    const newSizes = new Set(selectedSizes);
    if (newSizes.has(sizeCode)) {
      newSizes.delete(sizeCode);
    } else {
      newSizes.add(sizeCode);
    }
    setSelectedSizes(newSizes);
  };

  const generateVariants = () => {
    if (!colorName || !colorCode) {
      alert('Please enter color name and code');
      return;
    }

    if (selectedSizes.size === 0) {
      alert('Please select at least one size');
      return;
    }

    const variants: GeneratedVariant[] = [];

    // Generate variants for each selected size
    for (const sizeCode of Array.from(selectedSizes)) {
      const size = STANDARD_SIZES.find(s => s.code === sizeCode);
      if (!size) continue;

      variants.push({
        name: `${size.name} - ${colorName}`,
        sku: `${skuPrefix}-${colorCode}-${sizeCode}`,
        price_amount: price,
        currency: 'GBP',
        is_active: true,
        is_in_stock: true,
        inkthreadable_sku: `${inkthreadableBaseCode}-${colorCode}-${sizeCode}`,
        image_url: imageUrl || undefined,
      });
    }

    onGenerate(variants);

    // Reset form
    setColorName('');
    setColorCode('');
    setImageUrl('');
  };

  const previewCount = selectedSizes.size;

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Quick Add Color Variants</h3>
        <span className="text-sm text-gray-500">
          Will generate {previewCount} variant{previewCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Color Configuration */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">
          Color Details
        </h4>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Charcoal, Jet Black, Navy Blue"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Code * (for SKUs)
            </label>
            <input
              type="text"
              placeholder="e.g., CHA, JBK, NVY"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 font-mono focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
            <p className="mt-1 text-xs text-gray-500">Short code used in SKUs (usually 2-3 letters)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              placeholder="/products/my-product/cha-front.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
            <p className="mt-1 text-xs text-gray-500">Image for this color (used for all sizes)</p>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price (£)
        </label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          placeholder="29.99"
        />
        <p className="mt-1 text-xs text-gray-500">Price for all sizes of this color</p>
      </div>

      {/* Size Selection */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">
          Select Sizes *
        </h4>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {STANDARD_SIZES.map((size) => (
            <button
              key={size.code}
              type="button"
              onClick={() => toggleSize(size.code)}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                selectedSizes.has(size.code)
                  ? 'border-brand-primary bg-brand-primary text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-brand-primary/50'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {previewCount > 0 && colorName && colorCode && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-blue-900">Preview</h4>
          <div className="space-y-1 text-xs text-blue-800">
            {Array.from(selectedSizes).slice(0, 3).map((sizeCode) => {
              const size = STANDARD_SIZES.find(s => s.code === sizeCode);
              return (
                <div key={sizeCode} className="font-mono">
                  {size?.name} - {colorName} | SKU: {skuPrefix}-{colorCode}-{sizeCode} | Ink: {inkthreadableBaseCode}-{colorCode}-{sizeCode}
                </div>
              );
            })}
            {previewCount > 3 && (
              <div className="text-blue-600">... and {previewCount - 3} more</div>
            )}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        type="button"
        onClick={generateVariants}
        disabled={!colorName || !colorCode || previewCount === 0}
        className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add {previewCount} {colorName || 'Color'} Variant{previewCount !== 1 ? 's' : ''}
      </button>
    </div>
  );
}
