'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    productsApi.get(params.id as string)
      .then(({ product }) => setProduct(product))
      .catch(() => { toast.error('Product not found'); router.push('/') })
      .finally(() => setLoading(false))
  }, [params.id])

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1 })
    }
    toast.success(`${quantity}× ${product.name} added to cart`)
    openCart()
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-stone-200 rounded-3xl" />
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-stone-200 rounded w-20" />
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-24" />
            <div className="h-24 bg-stone-200 rounded" />
            <div className="h-12 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100">
          <Image
            src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-white text-stone-900 text-sm font-medium px-4 py-2 rounded-full">Out of stock</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-medium text-brand-600 uppercase tracking-wider">{product.category}</span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 mt-1 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-stone-900">{formatPrice(product.price)}</span>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2.5 py-1 rounded-full">
                Only {product.stock} left
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Package className={`w-4 h-4 ${product.stock > 0 ? 'text-brand-600' : 'text-stone-400'}`} />
            <span className={product.stock > 0 ? 'text-brand-700' : 'text-stone-400'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="text-stone-600 leading-relaxed text-sm">{product.description}</p>

          <hr className="border-stone-100" />

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-stone-700">Quantity</span>
              <div className="flex items-center gap-2 bg-stone-100 rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white font-bold hover:bg-stone-50 transition-colors">−</button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white font-bold hover:bg-stone-50 transition-colors">+</button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary flex items-center justify-center gap-2 py-3.5 text-base"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            {[
              ['🚚', 'Fast delivery nationwide'],
              ['🔒', 'Secure checkout'],
              ['↩️', '7-day returns'],
              ['✅', 'Verified vendor'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-2 text-xs text-stone-500">
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
