'use client'

import { useEffect, useState } from 'react'
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegments
} from 'next/navigation'
import { ArrowCircleRight, ArrowRightToBracket, Bell, Logo } from '../svgs'
import Link from 'next/link'
import routes from '@/lib/routes'

function capitalizeFirstLetter (text: string) {
  return text.replace(/\b\w/g, function (char) {
    return char.toUpperCase()
  })
}

const useBreadcrumb = () => {
  const rt = useRouter()
  const segments = useSelectedLayoutSegments()

  let title = 'Dashboard'

  if (segments.length) {
    const sgt = segments[0]
    const hasChildren = segments.length > 1

    // eslint-disable-next-line no-constant-condition
    if (false && hasChildren) {
      return (
        <div className="flex items-center gap-2">
          <ArrowCircleRight
            className="cursor-pointer"
            onClick={() => {
              rt.back()
            }}
          />

          <span>{capitalizeFirstLetter(sgt).replace('-', ' ')}</span>
        </div>
      )
    }

    title = capitalizeFirstLetter(sgt).replace('-', ' ')

    if (title === 'Invoice And-Payment') {
      title = 'Invoice & Payment'
    }

    return <span>{title}</span>
  }

  return <span>{title}</span>
}

export function Header () {
  const bread = useBreadcrumb()
  const pt = usePathname()

  const [, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pt])

  return (
    <header className="app_dash_main__hdr">
      <Link
        className="app_dash_main__hdr__img_link"
        href={routes.dashboard.entry.path}
      >
        <div className="flex items-center gap-3">
          <Logo />
          <h2 className="app_auth_login_container__header__logo__title">
            Creathrivity
          </h2>
        </div>
      </Link>

      <div className="app_dash_main__hdr__title">{bread}</div>

      <div className="app_dash_main__hdr__rgt">
        <div className="flex items-center gap-4">
          <Bell />

          <Link href={routes.auth.signOut.path}>
            <ArrowRightToBracket />
          </Link>
        </div>
      </div>
    </header>
  )
}
