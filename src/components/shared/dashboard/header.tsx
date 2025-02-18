/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/semi */
'use client'

import { Fragment, useEffect, useState } from 'react'
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from 'next/navigation'
import { ArrowRightToBracket, Bell, Logo } from '../svgs'
import Link from 'next/link'
import routes from '@/lib/routes'

function capitalizeFirstLetter (text: string) {
  return text.replace(/\b\w/g, function (char) {
    return char.toUpperCase()
  })
}

const useBreadcrumb = () => {
  const path = usePathname()
  const params = useParams()
  const segments = useSelectedLayoutSegments()

  const dr = routes.dashboard
  const client = dr.clientManagement
  const project = dr.projectManagement
  const payment = dr.invoiceAndPayment

  const isClientLayout = path.includes(client.path)
  const isProjectLayout = path.includes(project.path)
  const isPaymentLayout = path.includes(payment.path)
  const hasId = !!params.id

  if (!segments.length) return 'Dashboard'

  return (
    segments.map((sgt, index) => {
      const isLast = index === segments.length - 1

      const href = dr.entry.path + `/${segments.slice(0, index + 1).join('/')}`

      if (isLast && isClientLayout && hasId) return <span key={sgt}>Client Page</span>
      if (isLast && isProjectLayout && hasId) return <span key={sgt}>Project Page</span>
      if (isLast && isPaymentLayout && hasId) return <span key={sgt}>Payment Page</span>

      if (isLast) return <span key={sgt}>{capitalizeFirstLetter(sgt).replace('-', ' ')}</span>

      return (
        <Fragment key={sgt}>
          <Link href={href}>
            <span>{capitalizeFirstLetter(sgt).replace('-', ' ')}</span>
          </Link>

          {!isLast && <span> / </span>}
        </Fragment>
      )
    })
  )

  // let title = 'Dashboard'

  // if (segments.length) {
  //   const sgt = segments[0]

  //   title = capitalizeFirstLetter(sgt).replace('-', ' ')

  //   if (title === 'Invoice And-Payment') {
  //     title = 'Invoice & Payment'
  //   }
  //   if (title === 'Get Started') {
  //     title = 'Get started guide'
  //   }

  //   if (segments[1] === 'personal-project') {
  //     title = 'Personal Project';
  //   }
  //   if (segments[1] === 'client-project') {
  //     title = 'Client Project';
  //   }

  //   return <span>{title}</span>
  // }

  // return <span>{title}</span>
}

export function Header () {
  const bread = useBreadcrumb()
  const pt = usePathname()
  // const rt = useRouter()

  const [, setOpen] = useState(false)

  // Show back arrow only for the specific route pattern
  // const showBackArrow = pt.startsWith('/dashboard/project-management/')

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
        </div>
      </Link>

      <div className="app_dash_main__hdr__title flex space-x-5 justify-center items-center">
        {/* {showBackArrow && (
          <button
            onClick={() => { rt.back(); }}
            className="flex items-center gap-2 text-primary hover:text-primary-dark"
          >
            <ArrowLeft />
          </button>
        )} */}
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
