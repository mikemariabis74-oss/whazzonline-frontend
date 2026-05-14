import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Syne } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Providers } from '@/lib/providers'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })
const syne    = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' })

export const metadata: Metadata = {
  title: 'Whazzonline — Shop Everything',
  description: 'Connecting vendors and buyers across Nigeria',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${syne.variable}`}>
      <body className="font-sans bg-stone-50 text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100 transition-colors duration-300">
        <Navbar />
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
