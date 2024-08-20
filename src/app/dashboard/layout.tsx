'use client'

import { Suspense, useEffect, useState } from 'react'
import { Header, Sidebar } from '@/components/shared/dashboard'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

function Main ({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="app_dash_main flex-1">
      <Sidebar />

      <div className="app_dash_main__ctt">
        <Header />

        <div className="app_dash_main__ctt__mn">
          <div className="app_dashboard_page">{children}</div>
        </div>
      </div>
    </main>
  )
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={inter.className}
        id="app_dashboard_body"
      >
        <Suspense fallback={null}>
          <Main>{children}</Main>
        </Suspense>
      </body>
    </html>
  )
}
