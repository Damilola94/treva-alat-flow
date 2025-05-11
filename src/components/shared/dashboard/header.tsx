/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/semi */
'use client'

import { useEffect, useState } from 'react'
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegments,
} from 'next/navigation'
import { ArrowLeft, ArrowRightToBracket, Bell, Logo } from '../svgs'
import Link from 'next/link'
import routes from '@/lib/routes'

interface HeaderProps {
  showBackArrow?: boolean
}

function capitalizeFirstLetter (text: string) {
  return text.replace(/\b\w/g, function (char) {
    return char.toUpperCase()
  })
}

const useBreadcrumb = () => {
  const segments = useSelectedLayoutSegments()

  let title = 'Dashboard'

  if (segments.length) {
    const sgt = segments[0]

    title = capitalizeFirstLetter(sgt).replace('-', ' ')

    if (title === 'Payment') {
      title = 'Invoice & Payment'
    }
    if (title === 'Get Started') {
      title = 'Complete Onboarding'
    }

    return <span>{title}</span>
  }

  return <span>{title}</span>
}

export function Header ({ showBackArrow = false }: HeaderProps) {
  const bread = useBreadcrumb()
  const pt = usePathname()
  const rt = useRouter()

  const [, setOpen] = useState(false)

  // Show back arrow only for the specific route pattern
  // const showBackArrow = pt.startsWith('/client/dashboard/project-management/')

  useEffect(() => {
    setOpen(false)
  }, [pt])

  return (
    <header className="app_dash_main__hdr">
      <Link
        className="app_dash_main__hdr__img_link"
        href={routes.creatives.dashboard.entry.path}
      >
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Logo />
        </div>
      </Link>

      <div className="app_dash_main__hdr__title flex space-x-5 justify-center items-center">
        {showBackArrow && (
          <button
            onClick={() => { rt.back(); }}
            className="flex items-center gap-2 text-primary hover:text-primary-dark"
          >
            <ArrowLeft />
          </button>
        )}
        {bread}
      </div>

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
