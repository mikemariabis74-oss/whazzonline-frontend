'use client'

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, getTotal, getCount } = useCartStore()
  const total = getTotal()
  const count = getCount()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 animate-fade-in" onClick={closeCart} aria-hidden="true" />
      <aside className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl animate-slide-in flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            <h2 className="font-display font-bold text-lg">Cart</h2>
            {count > 0 && (
              <span className="text-xs bg-brand-100 text-brand-700 font-medium px-2 py-0.5 rounded-full">
                {count} item{count !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors" aria-label="Close cart">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-stone-300" />
              </div>
              <div>
                <p className="font-medium text-stone-800 mb-1">Your cart is empty</p>
                <p className="text-sm text-stone-500">Add items to get started</p>
              </div>
              <button onClick={closeCart} className="btn-primary text-sm">Continue Shopping</button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 animate-slide-up">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
                    <Image
                      src={item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 line-clamp-2 leading-tight">{item.name}</p>
                    <p className="text-sm font-bold text-brand-700 mt-0.5">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)}
                        className="p-1 text-stone-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 px-5 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">Subtotal</span>
              <span className="font-bold text-lg">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-stone-400">Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center block text-sm">
              Proceed to Checkout
            </Link>
            <button onClick={closeCart} className="btn-secondary w-full text-sm">Continue Shopping</button>
          </div>
        )}
      </aside>
    </>
  )
}
