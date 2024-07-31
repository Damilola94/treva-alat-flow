import routes from '@/lib/routes'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'

const dr = routes.dashboard

export function useIsActive () {
  const pathname = usePathname()

  const isActive = useCallback(
    (route = '') => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!route) return false

      if (route === dr.entry.path && pathname !== route) return false

      return pathname.includes(route)
    },
    [pathname]
  )

  return { isActive }
}
