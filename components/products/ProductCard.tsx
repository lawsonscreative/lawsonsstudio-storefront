import Link from 'next/link';
import Image from 'next/image';
import type { ProductWithVariants } from '@/types/database';
import { formatPrice } from '@/lib/utils/format';

interface ProductCardProps {
  product: ProductWithVariants;
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map((v) => v.price_amount));
  const hasMultiplePrices =
    product.variants.length > 1 &&
    product.variants.some((v) => v.price_amount !== minPrice);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-white/10 bg-brand-dark-surface transition-all hover:border-brand-primary/50 hover:shadow-lg hover:shadow-brand-primary/10"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-900">
        {product.primary_image_url || product.image_urls[0] ? (
          <Image
            src={product.primary_image_url || product.image_urls[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-600">
            No image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-white group-hover:text-brand-primary transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-400">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-1">
          {hasMultiplePrices && (
            <span className="text-sm text-gray-400">from</span>
          )}
          <span className="font-heading text-xl font-bold text-brand-primary">
            {formatPrice(minPrice, product.variants[0]?.currency || 'GBP')}
          </span>
        </div>
      </div>
    </Link>
  );
}
