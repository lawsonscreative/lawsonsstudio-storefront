import { getLawsonsStudioBrand } from '@/lib/brand/resolver';
import { getProducts } from '@/lib/products/queries';
import { ProductGrid } from '@/components/products/ProductGrid';

export default async function HomePage() {
  const brand = await getLawsonsStudioBrand();

  if (!brand) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Error loading brand</p>
      </main>
    );
  }

  const products = await getProducts(brand.id);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Bold.{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Creative.
              </span>{' '}
              Colourful.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4">
              Fitness apparel designed in Kent, UK – made for real training sessions.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-500">
              Hoodies, tees and vests built for actual training, not just mirror selfies.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-gray-900">
              Shop All
            </h2>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}
