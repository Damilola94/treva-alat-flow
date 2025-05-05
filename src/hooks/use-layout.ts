import routes from '@/lib/routes'
import { usePathname } from 'next/navigation'

export function useLayout () {
  const pathname = usePathname()
  const client = pathname.includes(routes.client.dashboard.entry.path)

  return { client }
}
