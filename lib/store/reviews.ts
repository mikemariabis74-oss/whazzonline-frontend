import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  created_at: string
}

interface ReviewsStore {
  reviews: Record<string, Review[]>
  addReview: (productId: string, review: Omit<Review, 'id' | 'created_at'>) => void
  getReviews: (productId: string) => Review[]
}

export const useReviewsStore = create<ReviewsStore>()(
  persist(
    (set, get) => ({
      reviews: {},
      addReview: (productId, review) => {
        const nextReview = {
          ...review,
          id: `${productId}-${Date.now()}`,
          created_at: new Date().toISOString(),
        }
        set((state) => ({
          reviews: {
            ...state.reviews,
            [productId]: [nextReview, ...(state.reviews[productId] || [])],
          },
        }))
      },
      getReviews: (productId) => get().reviews[productId] || [],
    }),
    {
      name: 'whazzonline-reviews',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
    }
  )
)
