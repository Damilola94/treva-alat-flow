import { rootColors } from '@/lib/colors'
import Image from 'next/image'
import { usePathname, useRouter, useSelectedLayoutSegments } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import { ArrowCircleRight, Menu, Notification } from '../svgs'
import Link from 'next/link'
import routes from '@/lib/routes'
import logos from '@/lib/assets/logos'
import { Sidebar } from './sidebar'
import { Profile } from './profile'
import { useEffect, useState } from 'react'

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
          <ArrowCircleRight className="cursor-pointer" onClick={() => { rt.back() }} />

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

  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pt])

  return (
    <header className="app_dash_main__hdr">
      <Link className="app_dash_main__hdr__img_link" href={routes.dashboard.entry.path}>
        <Image
          className="app_dash_main__aside__top__img"
          src={logos.logoDashboard}
          alt="logo"
        />
      </Link>

      <div className="app_dash_main__hdr__title">{bread}</div>

      <div className="app_dash_main__hdr__rgt">
        <Notification fill={rootColors['wema-purple']} />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <Menu className="app_dash_main__hdr__rgt__menu" />
          </SheetTrigger>

          <SheetContent className="app_sheet__ctt" side="left">
            <Sidebar mobile />
          </SheetContent>
        </Sheet>

        <Profile />
      </div>
    </header>
  )
}
