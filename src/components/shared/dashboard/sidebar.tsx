'use client'

import routes from '@/lib/routes'
import Image from 'next/image'
import Link from 'next/link'

import {
  Column,
  File,
  GlobeAlt,
  Grid,
  Like,
  Logo,
  Receipt,
  Reminder,
  Users
} from '..'
import dashboard from '@/lib/assets/dashboard'
import { useIsActive } from '@/hooks/use-active-route'

const dr = routes.dashboard

const menuItems = [
  { id: 1, label: 'Get started', href: dr.getStarted.path, icon: <GlobeAlt /> },
  {
    id: 2,
    label: 'Dashboard',
    icon: <Grid />,
    href: dr.entry.path
  },
  {
    id: 3,
    label: 'Project Management',
    icon: <Column />,
    href: dr.projectManagement.path
  },
  {
    id: 4,
    label: 'Client Management',
    icon: <Users />,
    href: '#'
  },
  {
    id: 5,
    label: 'Invoice & Payment',
    icon: <Receipt />,
    href: dr.invoiceAndPayment.path
  },

  {
    id: 6,
    label: 'Contracts',
    icon: <File />,
    href: '#'
  },
  {
    id: 7,
    label: 'Reminders and Notification',
    icon: <Reminder />,
    href: '#'
  },

  {
    id: 8,
    label: 'Reviews and Feedback',
    icon: <Like />,
    href: '#'
  }
].filter((item) => item.href !== '#')

interface ISidebarItem {
  item: {
    label: string
    href: string
    icon: JSX.Element
  }
}

const SidebarItem = (props: ISidebarItem) => {
  const { item } = props
  const { isActive } = useIsActive()

  const activeCN = isActive(item?.href) ? 'active' : ''

  return (
    <div className={`app_dash_main__aside__links__item ${activeCN}`}>
      <Link
        className={`app_dash_main__aside__links__item__a ${''}`}
        href={item?.href}
      >
        <div className="app_dash_main__aside__links__item__ctt">
          {item?.icon}

          <p className="app_dash_main__aside__links__item__ctt__p">
            {item?.label}
          </p>
        </div>
      </Link>
    </div>
  )
}

export function Sidebar ({ mobile = false }) {
  return (
    <aside
      className={`app_dash_main__aside app_dash_main__aside--${
        mobile && 'mobile'
      }`}
      style={{ backgroundImage: `url('${dashboard.dashBg.src}')` }}
    >
      <div className="app_dash_main__aside__top">
        <div className="w-full px-6">
          <Link href={routes.dashboard.entry.path}>
            <div className="flex items-center gap-3">
              <Logo />
              <h2 className="app_auth_login_container__header__logo__title">
                Creathrivity
              </h2>
            </div>
          </Link>
        </div>

        <div className="app_dash_main__aside__links">
          {menuItems.map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="app_dash_main__aside__btm">
        <div className="app_dash_main__aside__btm__avi">
          <Image src={dashboard.avi} alt="avi" className="w-full" />
        </div>

        <div className="flex-1">
          <p className="app_dash_main__aside__btm__name">Moyinoluwa</p>
          <p className="app_dash_main__aside__btm__email">
            moyinoluwa@gmail.com
          </p>
        </div>
      </div>
    </aside>
  )
}
