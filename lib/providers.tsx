'use client'

import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import CartDrawer from '@/components/CartDrawer'
import { useThemeStore } from '@/lib/store/theme'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <CartDrawer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-jakarta)',
            fontSize: '14px',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
        }}
      />
    </ThemeProvider>
  )
}
