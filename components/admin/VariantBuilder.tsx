'use client';

import { useState } from 'react';

interface ColorVariant {
  name: string;
  code: string; // Short code like "JBK", "CHA"
  imageUrl: string;
}

interface SizeOption {
  name: string;
  code: string; // Short code like "S", "M", "L"
}

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

export function VariantBuilder({
  skuPrefix,
  inkthreadableBaseCode,
  defaultPrice,
  onGenerate
}: VariantBuilderProps) {
  const [colors, setColors] = useState<ColorVariant[]>([
    { name: '', code: '', imageUrl: '' }
  ]);
  const [sizes, setSizes] = useState<SizeOption[]>([
    { name: '', code: '' }
  ]);
  const [price, setPrice] = useState(defaultPrice);

  const addColor = () => {
    setColors([...colors, { name: '', code: '', imageUrl: '' }]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: keyof ColorVariant, value: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const addSize = () => {
    setSizes([...sizes, { name: '', code: '' }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: keyof SizeOption, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const generateVariants = () => {
    const variants: GeneratedVariant[] = [];

    // Filter out empty colors and sizes
    const validColors = colors.filter(c => c.name && c.code);
    const validSizes = sizes.filter(s => s.name && s.code);

    // Generate all combinations
    for (const color of validColors) {
      for (const size of validSizes) {
        variants.push({
          name: `${size.name} - ${color.name}`,
          sku: `${skuPrefix}-${color.code}-${size.code}`,
          price_amount: price,
          currency: 'GBP',
          is_active: true,
          is_in_stock: true,
          inkthreadable_sku: `${inkthreadableBaseCode}-${color.code}-${size.code}`,
          image_url: color.imageUrl,
        });
      }
    }

    onGenerate(variants);
  };

  const validColors = colors.filter(c => c.name && c.code);
  const validSizes = sizes.filter(s => s.name && s.code);
  const previewCount = validColors.length * validSizes.length;

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Variant Builder</h3>
        <span className="text-sm text-gray-500">
          Will generate {previewCount} variant{previewCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* SKU Configuration */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">
          SKU Configuration
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU Prefix
            </label>
            <input
              type="text"
              value={skuPrefix}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
            />
            <p className="mt-1 text-xs text-gray-500">Your product SKU prefix</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inkthreadable Base Code
            </label>
            <input
              type="text"
              value={inkthreadableBaseCode}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
            />
            <p className="mt-1 text-xs text-gray-500">Inkthreadable product code</p>
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
        <p className="mt-1 text-xs text-gray-500">Price for all variants</p>
      </div>

      {/* Colors */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
            Colors
          </h4>
          <button
            type="button"
            onClick={addColor}
            className="rounded-lg bg-brand-primary px-3 py-1 text-xs font-semibold text-white hover:bg-brand-primary-dark"
          >
            + Add Color
          </button>
        </div>
        <div className="space-y-3">
          {colors.map((color, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[1fr_120px_2fr_auto]">
              <input
                type="text"
                placeholder="Color name (e.g., Jet Black)"
                value={color.name}
                onChange={(e) => updateColor(index, 'name', e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Code (JBK)"
                value={color.code}
                onChange={(e) => updateColor(index, 'code', e.target.value.toUpperCase())}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
              />
              <input
                type="text"
                placeholder="/products/my-product/jbk-front.png"
                value={color.imageUrl}
                onChange={(e) => updateColor(index, 'imageUrl', e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
            Sizes
          </h4>
          <button
            type="button"
            onClick={addSize}
            className="rounded-lg bg-brand-primary px-3 py-1 text-xs font-semibold text-white hover:bg-brand-primary-dark"
          >
            + Add Size
          </button>
        </div>
        <div className="space-y-3">
          {sizes.map((size, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
              <input
                type="text"
                placeholder="Size name (e.g., Small)"
                value={size.name}
                onChange={(e) => updateSize(index, 'name', e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Code (S)"
                value={size.code}
                onChange={(e) => updateSize(index, 'code', e.target.value.toUpperCase())}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
              />
              {sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      {previewCount > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-blue-900">Preview</h4>
          <div className="space-y-1 text-xs text-blue-800">
            {validColors.slice(0, 2).map((color) =>
              validSizes.slice(0, 2).map((size) => (
                <div key={`${color.code}-${size.code}`} className="font-mono">
                  {size.name} - {color.name} | SKU: {skuPrefix}-{color.code}-{size.code} | Ink: {inkthreadableBaseCode}-{color.code}-{size.code}
                </div>
              ))
            )}
            {previewCount > 4 && (
              <div className="text-blue-600">... and {previewCount - 4} more</div>
            )}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        type="button"
        onClick={generateVariants}
        disabled={previewCount === 0}
        className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Generate {previewCount} Variant{previewCount !== 1 ? 's' : ''}
      </button>
    </div>
  );
}
