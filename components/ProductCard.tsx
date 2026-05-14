'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock === 0) {
      toast.error('This item is out of stock')
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    })

    toast.success(`Added to cart`, { duration: 1800 })
  }

  return (
    <Link href={`/products/${product.id}`} className="card group block">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Image
          src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-stone-900 text-xs font-medium px-3 py-1 rounded-full">
              Out of stock
            </span>
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toast('Wishlist coming soon!', { icon: '🔖' }) }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0
                     group-hover:opacity-100 transition-all duration-200"
          aria-label="Add to wishlist"
        >
          <Heart className="w-3.5 h-3.5 text-stone-600" />
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-[11px] font-medium text-brand-600 uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-stone-900 line-clamp-2 leading-snug mb-2
                       group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-stone-900">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}
