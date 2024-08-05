'use client'

import logos from '@/lib/assets/logos'
import routes from '@/lib/routes'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { Devices, Hashtag, Login, People } from '..'
import dashboard from '@/lib/assets/dashboard'
import { Profile } from './profile'
import externalLinks from '@/lib/external-links'
import { useIsActive } from '@/hooks/use-active-route'

const dr = routes.dashboard

const menuItems = [
  { label: 'Dashboard', href: dr.entry.path, icon: <Hashtag /> },
  {
    label: 'Customer Information',
    icon: <People />,
    href: dr.customerInformation.path
  },
  {
    label: 'Account Management',
    icon: <Devices />,
    href: dr.accountManagement.path
  }
]

const logoutItem = {
  label: 'Sign out',
  href: routes.auth.signOut.path,
  icon: <Login />
}

export function Sidebar ({ mobile = false }) {
  const router = useRouter()

  const { isActive } = useIsActive()

  const handleLogout = () => {
    router.push(logoutItem.href)
  }

  return (
    <aside
      className={`app_dash_main__aside app_dash_main__aside--${
        mobile && 'mobile'
      }`}
      style={{ backgroundImage: `url('${dashboard.dashBg.src}')` }}
    >
      <div className="app_dash_main__aside__top">
        <Link href={routes.dashboard.entry.path}>
          <Image
            className="app_dash_main__aside__top__img"
            src={logos.logoDashboard}
            alt="logo"
          />
        </Link>

        <ul className="app_dash_main__aside__ul">
          {menuItems.map((item) => (
            <li className="app_dash_main__aside__ul__li" key={item.label}>
              <Link
                className={`app_dash_main__aside__ul__li__a ${
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  isActive(item.href) ? 'active' : ''
                }`}
                href={item?.href ?? ''}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="app_dash_main__aside__btm">
        <span className="app_dash_main__aside__btm__spn_bg" />

        <ul className="app_dash_main__aside__ul">
          <li className="app_dash_main__aside__ul__li">
            <Link href={'#'}>
              <Profile />
            </Link>
          </li>

          <li className="app_dash_main__aside__ul__li app_dash_main__aside__ul__li--idea-x">
            <a
              href={externalLinks.IDEA_X}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={logos.ideaX} alt="" />

              <div>
                Powered by <span>IDEAx Labs</span>
              </div>
            </a>
          </li>

          <li className={['app_dash_main__aside__ul__li'].join(' ')}>
            <a
              className={'app_dash_main__aside__ul__li__a cursor-pointer'}
              onClick={handleLogout}
            >
              {logoutItem.icon}
              {logoutItem.label}
            </a>
          </li>
        </ul>
      </div>
    </aside>
  )
}
