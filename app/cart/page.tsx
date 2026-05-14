'use client'

import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getCount } = useCartStore()
  const total = getTotal()
  const count = getCount()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-stone-300" />
        </div>
        <h2 className="font-display font-bold text-2xl text-stone-900 mb-2">Your cart is empty</h2>
        <p className="text-stone-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl text-stone-900">
          Cart ({count} {count === 1 ? 'item' : 'items'})
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 transition-colors">
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-4 p-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
                <Image
                  src={item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                  alt={item.name} fill className="object-cover" sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`}
                  className="text-sm font-medium text-stone-900 hover:text-brand-700 transition-colors line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-base font-bold text-stone-900 mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-stone-50 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-stone-50 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-stone-700">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({count} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span className="text-brand-600 font-medium">Calculated at checkout</span>
              </div>
              <hr className="border-stone-100" />
              <div className="flex justify-between font-bold text-base text-stone-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full text-center block mt-5">Checkout</Link>
            <Link href="/" className="btn-secondary w-full text-center block mt-2 text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
