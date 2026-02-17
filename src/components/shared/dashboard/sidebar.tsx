'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

import { Avatar } from '../avatar';
import { getAvatar, getFullName } from '@/lib/utils';
import dashboard from '@/lib/assets/dashboard';
import { useIsActive } from '@/hooks/use-active-route';
import useClickOutsideBox from '@/hooks/use-click-outside-box';
import type { JSX } from 'react/jsx-runtime';
import { Logo } from '../svgs';
import { useAppSelector } from '@/store';

type Location = {
  id: string;
  name: string;
};

type Country = Location & {
  code: string;
  flagUrl: string;
};

type UserAddress = {
  id: string | null;
  addressType: 'Home' | 'Work' | 'Other'; // you can extend as needed
  houseNumber: string | null;
  street: string | null;
  city: Location;
  state: Location;
  country: Country;
  userId: string | null;
};

type User = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  profilePicture: string;
  bio: string;
  phoneNumber: string;
  userAddresses: UserAddress[];
};

interface ISidebarItem {
  label: string;
  href: string;
  icon?: JSX.Element;
}

interface SidebarProps {
  menuItems: ISidebarItem[];
  logoHref: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData?: User | any;
}

// const SidebarItem = ({
//   item,
//   toggleMenu,
// }: {
//   item: ISidebarItem;
//   toggleMenu?: () => void;
// }) => {
//   const { isActive } = useIsActive();
//   const activeCN = isActive(item?.href, item.label === 'Dashboard')
//     ? 'active'
//     : '';

//   return (
//     <div className={`app_dash_main__aside__links__item ${activeCN}`}>
//       <Link
//         className="app_dash_main__aside__links__item__a"
//         href={item.href}
//         onClick={toggleMenu}
//       >
//         <div className="app_dash_main__aside__links__item__ctt">
//           {item.icon}
//           <p className="app_dash_main__aside__links__item__ctt__p">
//             {item.label}
//           </p>
//         </div>
//       </Link>
//     </div>
//   );
// };

const SidebarItem = ({
  item,
  toggleMenu,
}: {
  item: ISidebarItem & { disabled?: boolean };
  toggleMenu?: () => void;
}) => {
  const { isActive } = useIsActive();
  const activeCN = isActive(item?.href, item.label === 'Dashboard')
    ? 'active'
    : '';

  if (item.disabled) {
    return (
      <div
        className={`app_dash_main__aside__links__item cursor-not-allowed !text-gray-400`}
      >
        <div className="app_dash_main__aside__links__item__ctt !text-gray-400">
          {item.icon}
          <p className="app_dash_main__aside__links__item__ctt__p !text-gray-400">
            {item.label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app_dash_main__aside__links__item ${activeCN}`}>
      <Link
        className="app_dash_main__aside__links__item__a"
        href={item.href}
        onClick={toggleMenu}
      >
        <div className="app_dash_main__aside__links__item__ctt">
          {item.icon}
          <p className="app_dash_main__aside__links__item__ctt__p">
            {item.label}
          </p>
        </div>
      </Link>
    </div>
  );
};

export function Sidebar({ menuItems, logoHref, userData }: SidebarProps) {
  const { email } = useAppSelector((state) => state?.auth);
  const wrapperRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  useClickOutsideBox(wrapperRef, () => {
    setShowMenu(false);
  });

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
      {!showMenu && (
        <div className="fixed cursor-pointer top-2 left-6 z-50 lg:hidden">
          <FiMenu
            onClick={toggleMenu}
            className="transition bg-treva-purple-500 w-10 h-auto p-1.5 border rounded-md text-primary hover:bg-primary/20 z-50"
          />
        </div>
      )}

      <aside
        className={`app_dash_main__aside fixed z-30 min-h-screen overflow-auto hide-scroll ${
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
            <Link href={logoHref}>
              <div className="flex items-center gap-3">
                <Logo />
              </div>
            </Link>
          </div>

          <div className="app_dash_main__aside__links">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                toggleMenu={toggleMenu}
              />
            ))}
          </div>
        </div>

        <div className="app_dash_main__aside__btm">
          <Avatar
            src={getAvatar({
              name: userData ? getFullName(userData) : '',
              length: 2,
            })}
          />
          <div className="flex-1">
            <p className="app_dash_main__aside__btm__name">
              {userData?.firstName}
            </p>
            <p className="app_dash_main__aside__btm__email">{email}</p>
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
