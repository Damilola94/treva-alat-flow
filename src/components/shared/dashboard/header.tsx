import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegments
} from 'next/navigation'
import { ArrowCircleRight, ArrowRightToBracket, Bell } from '../svgs'
import Link from 'next/link'
import routes from '@/lib/routes'
import logos from '@/lib/assets/logos'

function capitalizeFirstLetter (text: string) {
  return text.replace(/\b\w/g, function (char) {
    return char.toUpperCase()
  })
}

const useBreadcrumb = () => {
  const rt = useRouter()
  const segments = useSelectedLayoutSegments()

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

    return <span>{capitalizeFirstLetter(sgt).replace('-', ' ')}</span>
  }

  return <span>Dashboard</span>
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
        <Image
          className="app_dash_main__aside__top__img"
          src={logos.logoDashboard}
          alt="logo"
        />
      </Link>

      <div className="app_dash_main__hdr__title">{bread}</div>

      <div className="app_dash_main__hdr__rgt">
        <div className="flex items-center gap-4">
          <Bell />

          <ArrowRightToBracket />
        </div>
      </div>
    </header>
  )
}
