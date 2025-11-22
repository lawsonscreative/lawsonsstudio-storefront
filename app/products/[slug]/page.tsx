import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getLawsonsStudioBrand } from '@/lib/brand/resolver';
import { getProductBySlug } from '@/lib/products/queries';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { formatPrice } from '@/lib/utils/format';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const brand = await getLawsonsStudioBrand();

  if (!brand) {
    notFound();
  }

  const product = await getProductBySlug(brand.id, params.slug);

  if (!product) {
    notFound();
  }

  const activeVariants = product.variants.filter((v) => v.is_active && v.is_in_stock);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm">
              {product.primary_image_url || (product.image_urls && product.image_urls[0]) ? (
                <Image
                  src={product.primary_image_url || product.image_urls[0]}
                  alt={product.name}
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

            {/* Thumbnail strip */}
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.image_urls.slice(0, 4).map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-lg bg-white border border-gray-200"
                  >
                    <Image src={url} alt={`${product.name} ${i + 1}`} fill className="object-contain p-2" unoptimized />
                  </div>
                ))}
              </div>
            )}
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

            {/* Variants */}
            {activeVariants.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                    Select Size
                  </h2>
                  <span className="text-xs text-gray-500">({activeVariants.length} options)</span>
                </div>
                <div className="space-y-3">
                  {activeVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className="group relative flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-brand-accent hover:shadow-md"
                    >
                      {variant.image_url && (
                        <div className="h-16 w-16 flex-shrink-0 mr-4">
                          <div className="relative h-16 w-16 rounded bg-gray-100">
                            <Image
                              src={variant.image_url}
                              alt={variant.name}
                              fill
                              className="object-cover rounded"
                              unoptimized
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{variant.name}</div>
                        {variant.sku && (
                          <div className="mt-1 text-xs text-gray-500">SKU: {variant.sku}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-heading text-2xl font-bold text-brand-primary">
                            {formatPrice(variant.price_amount, variant.currency)}
                          </div>
                        </div>
                        <AddToCartButton product={product} variant={variant} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeVariants.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-600">Currently out of stock</p>
              </div>
            )}

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
      </div>
    </main>
  );
}
