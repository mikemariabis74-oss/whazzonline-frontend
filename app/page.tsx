import Link from 'next/link'
import { Suspense } from 'react'
import ProductCard from '@/components/ProductCard'
import SearchFilter from '@/components/SearchFilter'
import { productsApi } from '@/lib/api'
import { Product } from '@/types'

interface PageProps {
  searchParams: { q?: string; category?: string; sort?: string; page?: string }
}

async function getProducts(params: PageProps['searchParams'] & { limit?: string }): Promise<{
  products: Product[]
  total: number
  page: number
  limit: number
}> {
  try {
    const data = await productsApi.list(params)
    return data
  } catch (err) {
    console.error('Failed to fetch products:', err)
    return { products: [], total: 0, page: 1, limit: 10 }
  }
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="aspect-square bg-stone-200" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-stone-200 rounded w-16" />
            <div className="h-4 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function HomePage({ searchParams }: PageProps) {
  const limit = 10
  const page = Number(searchParams.page || '1') >= 1 ? Number(searchParams.page || '1') : 1
  const data = await getProducts({ ...searchParams, page: String(page), limit: String(limit) })
  const products = data.products
  const total = data.total
  const pageNumber = data.page
  const pageLimit = data.limit
  const totalPages = Math.max(1, Math.ceil(total / pageLimit))
  const hasFilters = searchParams.q || (searchParams.category && searchParams.category !== 'all')

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams()
    if (searchParams.q) params.set('q', searchParams.q)
    if (searchParams.category && searchParams.category !== 'all') params.set('category', searchParams.category)
    if (searchParams.sort && searchParams.sort !== 'newest') params.set('sort', searchParams.sort)
    if (newPage > 1) params.set('page', String(newPage))
    return params.toString() ? `/?${params.toString()}` : '/'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      {!hasFilters && (
        <section className="mb-10 bg-gradient-to-r from-brand-600 to-brand-700 rounded-3xl
                            p-8 sm:p-12 text-white overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-brand-200 text-sm font-medium uppercase tracking-widest mb-2">
              Blawdigital Commerce
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
              Everything you need,<br />one place to shop.
            </h1>
            <p className="text-brand-100 max-w-md mb-6">
              Connecting vendors and buyers across Nigeria. Discover thousands of products from verified sellers.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full" />
        </section>
      )}

      {/* Search + Filter */}
      <Suspense>
        <div className="mb-6"><SearchFilter /></div>
      </Suspense>

      {/* Results count */}
      <p className="text-sm text-stone-500 mb-4">
        {products.length === 0
          ? 'No products found'
          : `${products.length} product${products.length !== 1 ? 's' : ''}`}
      </p>

      {/* Grid */}
      <Suspense fallback={<ProductGridSkeleton />}>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-medium text-stone-800 mb-2">No products found</h3>
            <p className="text-sm text-stone-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-stone-500">
                Showing {(pageNumber - 1) * pageLimit + 1} - {Math.min(pageNumber * pageLimit, total)} of {total} products
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={buildPageUrl(pageNumber - 1)}
                  className={`btn-secondary px-4 py-2 text-sm ${pageNumber === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  Previous
                </Link>
                <span className="text-sm text-stone-500">Page {pageNumber} of {totalPages}</span>
                <Link
                  href={buildPageUrl(pageNumber + 1)}
                  className={`btn-secondary px-4 py-2 text-sm ${pageNumber === totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  Next
                </Link>
              </div>
            </div>
          </>
        )}
      </Suspense>
    </div>
  )
}
