'use client'

import { Header, Sidebar } from '@/components/shared/dashboard'
import config from '@/lib/config'
import featureFlags from '@/lib/feature-flags'
import routes from '@/lib/routes'
import { decodeJwt } from '@/lib/utils'
import { getLocalStorage } from '@/services/helper'
import { Inter } from 'next/font/google'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

function Main ({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { push } = useRouter()
  const path = usePathname()
  const params = useSearchParams()
  const asPath = params.toString() ? `${path}?${params.toString()}` : path

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const token = getLocalStorage(config.tokenKey)
    const exp = decodeJwt(String(token?.accessToken)).exp * 1000
    const now = new Date().getTime()

    if (featureFlags.MOCK_DATA_ENABLED || (exp > now)) {
      setMounted(true)
    } else {
      toast.error('Token expired')
      push(`${routes.auth.signIn.path}?next=${asPath}`)
    }
  }, [asPath, push])

  if (!mounted) {
    return null
  }

  return (
    <main className="app_dash_main">
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
