import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useCreateQueryString () {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const pushQuery = (name: string, value: string) => {
    router.push(pathName + '?' + createQueryString(name, value), { scroll: false })
  }

  return { pathName, pushQuery, createQueryString }
}
