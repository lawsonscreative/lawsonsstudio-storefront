'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import Link from 'next/link';
import { VariantBuilder } from '@/components/admin/VariantBuilder';

interface ProductVariant {
  name: string;
  sku: string;
  price_amount: number;
  currency: string;
  is_active: boolean;
  is_in_stock: boolean;
  inkthreadable_sku?: string;
  image_url?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Product fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [primaryImageUrl, setPrimaryImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [providerType, setProviderType] = useState<'inkthreadable' | 'other'>('inkthreadable');

  // Variant builder fields
  const [skuPrefix, setSkuPrefix] = useState('');
  const [inkthreadableBaseCode, setInkthreadableBaseCode] = useState('');
  const [useVariantBuilder, setUseVariantBuilder] = useState(false);

  // Variant fields
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      name: '',
      sku: '',
      price_amount: 0,
      currency: 'GBP',
      is_active: true,
      is_in_stock: true,
      inkthreadable_sku: '',
      image_url: '',
    },
  ]);

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        name: '',
        sku: '',
        price_amount: 0,
        currency: 'GBP',
        is_active: true,
        is_in_stock: true,
        inkthreadable_sku: '',
        image_url: '',
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugManuallyEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (!name || !slug) {
        throw new Error('Product name and slug are required');
      }

      if (variants.length === 0) {
        throw new Error('At least one variant is required');
      }

      for (const variant of variants) {
        if (!variant.name || !variant.sku || variant.price_amount <= 0) {
          throw new Error('All variant fields are required');
        }
      }

      // Get brand ID (hardcoded to Lawsons Studio for now)
      const { data: brandData } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', 'lawsons-studio')
        .single();

      if (!brandData) {
        throw new Error('Brand not found');
      }

      // Parse image URLs
      const imageUrlsArray = imageUrls
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url);

      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          brand_id: brandData.id,
          name,
          slug,
          description,
          primary_image_url: primaryImageUrl || null,
          image_urls: imageUrlsArray.length > 0 ? imageUrlsArray : null,
          is_active: isActive,
          provider_type: providerType,
        })
        .select()
        .single();

      if (productError) {
        console.error('Product creation error:', productError);
        throw productError;
      }

      // Create variants
      const variantsToInsert = variants.map((variant) => ({
        product_id: product.id,
        name: variant.name,
        sku: variant.sku,
        price_amount: Math.round(variant.price_amount * 100), // Convert pounds to pence
        currency: variant.currency,
        is_active: variant.is_active,
        is_in_stock: variant.is_in_stock,
        inkthreadable_sku: providerType === 'inkthreadable' ? variant.inkthreadable_sku : null,
        image_url: variant.image_url || null,
      }));

      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(variantsToInsert);

      if (variantsError) {
        console.error('Variants creation error:', variantsError);

        // Rollback: delete the product we just created
        await supabase.from('products').delete().eq('id', product.id);

        throw variantsError;
      }

      // Success - redirect to admin home
      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error('Error creating product:', err);

      // Extract detailed error message from Supabase error
      let errorMessage = 'Failed to create product';

      if (err && typeof err === 'object') {
        const supabaseError = err as any;

        // Check for duplicate slug error
        if (supabaseError.code === '23505' || supabaseError.message?.includes('unique')) {
          errorMessage = 'A product with this URL slug already exists. Please choose a different slug.';
        } else if (supabaseError.message) {
          errorMessage = supabaseError.message;
        } else if (supabaseError.hint) {
          errorMessage = `${supabaseError.message || 'Error'}: ${supabaseError.hint}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/admin/products"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            ← Back to Products
          </Link>
        </div>
        <h1 className="font-heading text-3xl font-bold text-gray-900">Add Product</h1>
        <p className="mt-2 text-gray-600">
          Create a new product with variants for your store
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-6">
            Product Details
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="e.g., Classic Logo T-Shirt"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="classic-logo-tshirt"
              />
              <p className="mt-1 text-xs text-gray-500">
                Will be used in the URL: /products/{slug}
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="Product description..."
              />
            </div>

            <div>
              <label htmlFor="primaryImage" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Image URL
              </label>
              <input
                id="primaryImage"
                type="text"
                value={primaryImageUrl}
                onChange={(e) => setPrimaryImageUrl(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="/products/my-product/front.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use relative URLs (e.g., /products/my-product/image.jpg) or full URLs (e.g., https://...)
              </p>
            </div>

            <div>
              <label htmlFor="imageUrls" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Images (one per line)
              </label>
              <textarea
                id="imageUrls"
                rows={3}
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="/products/my-product/back.jpg&#10;/products/my-product/detail.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">
                One URL per line. Use relative URLs for files in public/ folder
              </p>
            </div>

            <div>
              <label htmlFor="providerType" className="block text-sm font-medium text-gray-700 mb-1">
                Product Provider
              </label>
              <select
                id="providerType"
                value={providerType}
                onChange={(e) => setProviderType(e.target.value as 'inkthreadable' | 'other')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="inkthreadable">Inkthreadable (POD)</option>
                <option value="other">Other Provider</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Product is active (visible on storefront)
              </label>
            </div>
          </div>
        </div>

        {/* Variant Builder Configuration (only for Inkthreadable products) */}
        {providerType === 'inkthreadable' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
              Variant Builder Setup
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU Prefix
                </label>
                <input
                  type="text"
                  value={skuPrefix}
                  onChange={(e) => setSkuPrefix(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  placeholder="LS-VEST-EMP"
                />
                <p className="mt-1 text-xs text-gray-500">Your product SKU prefix (e.g., LS-VEST-EMP)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inkthreadable Base Code
                </label>
                <input
                  type="text"
                  value={inkthreadableBaseCode}
                  onChange={(e) => setInkthreadableBaseCode(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  placeholder="JC015"
                />
                <p className="mt-1 text-xs text-gray-500">Inkthreadable product code (e.g., JC015)</p>
              </div>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useVariantBuilder}
                onChange={(e) => setUseVariantBuilder(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Use Variant Builder (automatically generate variants from colors and sizes)
              </span>
            </label>
          </div>
        )}

        {/* Variant Builder */}
        {useVariantBuilder && skuPrefix && inkthreadableBaseCode && (
          <VariantBuilder
            skuPrefix={skuPrefix}
            inkthreadableBaseCode={inkthreadableBaseCode}
            defaultPrice={29.99}
            onGenerate={(generatedVariants) => {
              // Add to existing variants instead of replacing
              setVariants([...variants.filter(v => v.name), ...generatedVariants]);
              setUseVariantBuilder(false); // Hide builder after generation
            }}
          />
        )}

        {/* Manual Variants */}
        {!useVariantBuilder && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-xl font-semibold text-gray-900">
                  Product Variants {providerType === 'inkthreadable' && skuPrefix && inkthreadableBaseCode && (
                    <button
                      type="button"
                      onClick={() => setUseVariantBuilder(true)}
                      className="ml-3 text-sm font-normal text-brand-primary hover:text-brand-primary-dark"
                    >
                      Use Variant Builder
                    </button>
                  )}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {variants.length} variant{variants.length !== 1 ? 's' : ''} added
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                + Add Variant
              </button>
            </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Variant {index + 1}</h3>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="e.g., Small - White"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="TSHIRT-SM-WHT"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (£) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={variant.price_amount}
                      onChange={(e) => handleVariantChange(index, 'price_amount', parseFloat(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="24.99"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variant Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={variant.image_url || ''}
                      onChange={(e) => handleVariantChange(index, 'image_url', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="/products/my-product/color-variant.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional: Different image for this variant (e.g., different color)
                    </p>
                  </div>

                  {providerType === 'inkthreadable' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inkthreadable SKU
                      </label>
                      <input
                        type="text"
                        value={variant.inkthreadable_sku || ''}
                        onChange={(e) => handleVariantChange(index, 'inkthreadable_sku', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                        placeholder="INK-SKU-123"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.is_active}
                        onChange={(e) => handleVariantChange(index, 'is_active', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.is_in_stock}
                        onChange={(e) => handleVariantChange(index, 'is_in_stock', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">In Stock</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-primary px-6 py-3 font-medium text-brand-dark hover:bg-brand-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
