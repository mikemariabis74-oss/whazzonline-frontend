import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from '@/types'

interface WishlistStore {
  items: Product[]
  toggleItem: (product: Product) => void
  removeItem: (id: string) => void
  isWishlisted: (id: string) => boolean
  count: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const existing = get().items.find((item) => item.id === product.id)
        if (existing) {
          set((state) => ({ items: state.items.filter((item) => item.id !== product.id) }))
        } else {
          set((state) => ({ items: [...state.items, product] }))
        }
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      isWishlisted: (id) => get().items.some((item) => item.id === id),
      count: () => get().items.length,
    }),
    {
      name: 'whazzonline-wishlist',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ items: state.items }),
    }
  )
)
