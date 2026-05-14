'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, Moon, Sun, Heart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'
import { useThemeStore } from '@/lib/store/theme'
import { useAuthStore } from '@/lib/store/auth'
import { authApi } from '@/lib/api'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { openCart } = useCartStore()
  const { user, access_token, clearAuth } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const count = useCartStore((state) => state.items.length)
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  const handleSignOut = async () => {
    try {
      if (access_token) await authApi.logout(access_token)
    } catch (_) {
      // Token may be expired — clear locally regardless
    }
    clearAuth()
    toast.success('Signed out')
    router.push('/')
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-100 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">W</span>
            </div>
            <span className="font-display font-bold text-xl text-stone-900 tracking-tight">
              Whazzonline
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <Link href="/" className="hover:text-stone-900 transition-colors">Shop</Link>
            <Link href="/?category=electronics" className="hover:text-stone-900 transition-colors">Electronics</Link>
            <Link href="/?category=fashion" className="hover:text-stone-900 transition-colors">Fashion</Link>
            <Link href="/?category=home" className="hover:text-stone-900 transition-colors">Home</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-stone-700" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-600 rounded-full
                                 text-white text-[10px] font-bold flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            <button
              onClick={() => toast(`${wishlistCount} item${wishlistCount !== 1 ? 's' : ''} saved to wishlist`, { icon: '💜' })}
              className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-stone-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 rounded-full text-[10px] text-white flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                toggleTheme()
                toast.success(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`)
              }}
              className="p-2 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-stone-700" /> : <Moon className="w-5 h-5 text-stone-700" />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-stone-500 max-w-[140px] truncate">{user.email}</span>
                <button onClick={handleSignOut} className="btn-secondary text-sm py-1.5 px-3">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="btn-secondary text-sm py-1.5 px-3">Login</Link>
                <Link href="/signup" className="btn-primary text-sm py-1.5 px-3">Sign up</Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-xl hover:bg-stone-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-stone-100 animate-slide-up">
            <nav className="flex flex-col gap-3 text-sm font-medium pb-4">
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-stone-700">Shop</Link>
              <Link href="/?category=electronics" onClick={() => setMenuOpen(false)} className="text-stone-700">Electronics</Link>
              <Link href="/?category=fashion" onClick={() => setMenuOpen(false)} className="text-stone-700">Fashion</Link>
              <Link href="/?category=home" onClick={() => setMenuOpen(false)} className="text-stone-700">Home</Link>
            </nav>
            <div className="flex gap-2 pt-2 border-t border-stone-100">
              {user ? (
                <button onClick={handleSignOut} className="btn-secondary w-full text-sm">Sign out</button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 text-center text-sm">Login</Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center text-sm">Sign up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
