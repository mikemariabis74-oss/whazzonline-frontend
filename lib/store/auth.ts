import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  access_token: string | null
  refresh_token: string | null
  setAuth: (user: User, access_token: string, refresh_token: string) => void
  clearAuth: () => void
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      access_token: null,
      refresh_token: null,

      setAuth: (user, access_token, refresh_token) =>
        set({ user, access_token, refresh_token }),

      clearAuth: () =>
        set({ user: null, access_token: null, refresh_token: null }),

      get isAuthenticated() {
        return !!get().access_token
      },
    }),
    {
      name: 'whazzonline-auth',
      storage: createJSONStorage(() => {
        // Safe localStorage access (SSR guard)
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
