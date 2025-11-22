import { notFound } from 'next/navigation';
import { getLawsonsStudioBrand } from '@/lib/brand/resolver';
import { getProductBySlug } from '@/lib/products/queries';
import { ProductDisplay } from '@/components/products/ProductDisplay';

// Revalidate every 60 seconds
export const revalidate = 60;

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

  if (activeVariants.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600">Currently out of stock</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <ProductDisplay product={product} variants={activeVariants} />
      </div>
    </main>
  );
}
