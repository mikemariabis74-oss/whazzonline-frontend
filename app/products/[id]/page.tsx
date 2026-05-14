'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, Package, Heart, Star } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'
import { useReviewsStore } from '@/lib/store/reviews'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [rating, setRating] = useState(5)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const { addItem, openCart } = useCartStore()
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isWishlisted = useWishlistStore((state) => state.items.some((item) => item.id === product?.id))
  const addReview = useReviewsStore((state) => state.addReview)
  const reviews = useReviewsStore((state) => state.getReviews(product?.id ?? ''))

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

  const handleSubmitReview = () => {
    if (!product) return
    if (!name.trim() || !comment.trim()) {
      toast.error('Please add a name and a review comment')
      return
    }

    addReview(product.id, {
      name: name.trim(),
      rating,
      comment: comment.trim(),
    })

    setName('')
    setComment('')
    setRating(5)
    toast.success('Review submitted')
  }

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  }, [reviews])

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
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

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-stone-900 dark:text-stone-50">{formatPrice(product.price)}</span>
              <div className="flex items-center gap-1 text-sm text-amber-500">
                <Star className="w-4 h-4" />
                <span>{averageRating ? averageRating.toFixed(1) : 'New'}</span>
              </div>
            </div>
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                toggleWishlist(product)
                toast.success(`${product.name} ${isWishlisted ? 'removed from' : 'added to'} wishlist`)
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
                isWishlisted ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              {isWishlisted ? 'Wishlisted' : 'Add to wishlist'}
            </button>
          </div>

          <p className="text-stone-600 leading-relaxed text-sm">{product.description}</p>

          <hr className="border-stone-100 dark:border-stone-800" />

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

      <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-5 rounded-3xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Customer reviews</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {reviews.length ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : 'Be the first to review this product'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
              <Star className="w-4 h-4" />
              <span>{reviews.length ? averageRating.toFixed(1) : '0.0'}</span>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-200 bg-stone-50 p-6 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-400">
                No reviews yet. Share your experience with this product.
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-3xl border border-stone-100 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{review.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-semibold">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="space-y-5 rounded-3xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Write a review</h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Share what you liked and what other buyers should know.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-200 mb-2">Your name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field dark:bg-stone-950 dark:border-stone-800 dark:text-stone-100"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-200 mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setRating(step)}
                    className={`rounded-full px-3 py-1 transition-all duration-150 ${
                      step <= rating ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-200 mb-2">Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="input-field dark:bg-stone-950 dark:border-stone-800 dark:text-stone-100"
                placeholder="Tell other buyers what to expect"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmitReview}
              className="btn-primary w-full"
            >
              Submit review
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
