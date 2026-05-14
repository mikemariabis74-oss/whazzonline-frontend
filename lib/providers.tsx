'use client'

import { Toaster } from 'react-hot-toast'
import CartDrawer from '@/components/CartDrawer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  )
}
