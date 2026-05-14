'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: 'all',         label: 'All' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion',     label: 'Fashion' },
  { value: 'home',        label: 'Home & Living' },
  { value: 'beauty',      label: 'Beauty' },
  { value: 'food',        label: 'Food' },
  { value: 'sports',      label: 'Sports' },
]

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Newest' },
  { value: 'price-asc',   label: 'Price: Low → High' },
  { value: 'price-desc',  label: 'Price: High → Low' },
]

export default function SearchFilter() {
  const router    = useRouter()
  const pathname  = usePathname()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const currentCategory = searchParams.get('category') || 'all'
  const currentSort     = searchParams.get('sort') || 'newest'
  const currentSearch   = searchParams.get('q') || ''

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === 'all' || value === 'newest') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="search"
            placeholder="Search products..."
            defaultValue={currentSearch}
            onChange={(e) => updateParam('q', e.target.value)}
            className="input-field pl-10 pr-9"
            aria-label="Search products"
          />
          {currentSearch && (
            <button onClick={() => updateParam('q', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn('btn-secondary flex items-center gap-2 text-sm',
            showFilters && 'bg-brand-50 border-brand-300 text-brand-700')}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      <div className={cn('space-y-3', !showFilters && 'hidden sm:block')}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateParam('category', cat.value)}
              className={cn(
                'flex-shrink-0 text-sm px-4 py-1.5 rounded-full border transition-all font-medium',
                currentCategory === cat.value
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">Sort by:</span>
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input-field py-1.5 text-sm w-auto"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
