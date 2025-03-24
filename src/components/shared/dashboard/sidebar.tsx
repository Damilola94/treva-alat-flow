'use client';

import { useRef, useState, useEffect } from 'react';
import routes from '@/lib/routes';
import Image from 'next/image';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

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
} from '..';
import dashboard from '@/lib/assets/dashboard';
import { useIsActive } from '@/hooks/use-active-route';
import useClickOutsideBox from '@/hooks/use-click-outside-box';
import type { JSX } from 'react/jsx-runtime';

const dr = routes.dashboard;

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
    label: 'Client Management',
    icon: <Users />,
    href: dr.clientManagement.path
  },
  {
    id: 4,
    label: 'Project Management',
    icon: <Column />,
    href: dr.projectManagement.path
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
].filter((item) => item.href !== '#');

interface ISidebarItem {
  item: {
    label: string
    href: string
    icon: JSX.Element
  }
  toggleMenu?: () => void
}

const SidebarItem = (props: ISidebarItem) => {
  const { item, toggleMenu } = props;
  const { isActive } = useIsActive();

  const activeCN = isActive(item?.href) ? 'active' : '';

  return (
    <div className={`app_dash_main__aside__links__item ${activeCN}`}>
      <Link
        className={'app_dash_main__aside__links__item__a'}
        href={item?.href}
        onClick={toggleMenu}
      >
        <div className="app_dash_main__aside__links__item__ctt">
          {item?.icon}
          <p className="app_dash_main__aside__links__item__ctt__p">
            {item?.label}
          </p>
        </div>
      </Link>
    </div>
  );
};

export function Sidebar () {
  const wrapperRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  useClickOutsideBox(wrapperRef, () => { setShowMenu(false); });

  useEffect(() => {
    const handleRouteChange = () => {
      setShowMenu(false);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div ref={wrapperRef} className="sidebar-wrapper">
      <div
        className={`${
          showMenu ? 'hidden' : ''
        } fixed cursor-pointer top-2 left-6 z-50 lg:hidden`}
      >
        <FiMenu
          onClick={toggleMenu}
          className="transition bg-treva-purple-500 w-10 h-auto p-1.5 border rounded-md text-primary hover:bg-primary/20 z-50"
        />
      </div>

      <aside
        className={`app_dash_main__aside fixed z-30 h-screen overflow-auto hide-scroll ${
          showMenu ? 'show-mobile-menu' : 'hide-mobile-menu'
        } lg:relative lg:show-mobile-menu`}
        style={{ backgroundImage: `url('${dashboard.dashBg.src}')` }}
      >
        <div className="fixed cursor-pointer top-5 right-5 lg:hidden">
          <IoClose
            onClick={toggleMenu}
            className="transition w-10 h-auto p-1.5 rounded-md bg-white text-primary hover:bg-white/20"
          />
        </div>

        <div className="app_dash_main__aside__top">
          <div className="w-full px-6 py-5 h-20">
            <Link href={routes.dashboard.entry.path}>
              <div className="flex items-center gap-3">
                <Logo />
              </div>
            </Link>
          </div>

          <div className="app_dash_main__aside__links">
            {menuItems.map((item) => (
              <SidebarItem key={item.id} item={item} toggleMenu={toggleMenu} />
            ))}
          </div>
        </div>

        <div className="app_dash_main__aside__btm">
          <div className="app_dash_main__aside__btm__avi">
            <Image
              src={dashboard.avi || '/placeholder.svg'}
              alt="avi"
              className="w-full"
            />
          </div>

          <div className="flex-1">
            <p className="app_dash_main__aside__btm__name">Moyinoluwa</p>
            <p className="app_dash_main__aside__btm__email">
              moyinoluwa@gmail.com
            </p>
          </div>
        </div>
      </aside>

      {showMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
}
