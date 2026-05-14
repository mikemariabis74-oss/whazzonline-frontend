import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark'

interface ThemeStore {
  theme: ThemeMode
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: nextTheme })
      },
    }),
    {
      name: 'whazzonline-theme',
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
