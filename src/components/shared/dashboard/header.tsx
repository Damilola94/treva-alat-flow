/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/semi */
'use client';

import { useEffect, useState } from 'react';
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegments,
} from 'next/navigation';
import { ArrowLeft, ArrowRightToBracket, Bell, Logo } from '../svgs';
import Link from 'next/link';
import routes from '@/lib/routes';
// import { useNotifications } from '@/hooks/Chat';
import { useAppSelector } from '@/store';
import { handleLogoutRedirect } from '@/utils';
import { useNotificationContext } from '@/contexts/NotificationProvider';

interface HeaderProps {
  showBackArrow?: boolean;
}

function capitalizeFirstLetter(text: string) {
  return text.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

const useBreadcrumb = () => {
  const segments = useSelectedLayoutSegments();

  let title = 'Dashboard';
  let secondLevel = '';

  if (segments.length) {
    const sgt = segments[0];
    title = capitalizeFirstLetter(sgt).replace('-', ' ');

    if (segments.length > 1) {
      const second = segments[1];

      // UUID regex check
      const isUUID =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
          second,
        );

      if (!isUUID) {
        secondLevel = capitalizeFirstLetter(second).replace('-', ' ');
      }
    }

    if (title === 'Payment') title = 'Invoice & Payment';
    if (title === 'Get Started') title = 'Complete Onboarding';

    if (title === 'Hiring Management') {
      return `${title}${secondLevel ? ` / ${secondLevel}` : ''}`;
    }

    return <span>{title}</span>;
  }

  return <span>{title}</span>;
};

export function Header({ showBackArrow = false }: HeaderProps) {
  const { role } = useAppSelector((state) => state?.auth);
  const bread = useBreadcrumb();
  const pt = usePathname();
  const rt = useRouter();

  const [, setOpen] = useState(false);
  // const { notificationCount } = useNotifications();
  const { unreadCount } = useNotificationContext();

  // const notificationCountData = useMemo(() => {
  //   if (!notificationCount?.isSuccess) return null;
  //   return notificationCount?.data ?? 0;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [notificationCount?.data]);

  const handleNotification = () => {
    if (role?.includes('Client')) {
      rt.push(routes.client.dashboard.notifications.path);
    } else {
      rt.push(routes.creatives.dashboard.notifications.path);
    }
  };

  // Show back arrow only for the specific route pattern
  // const showBackArrow = pt.startsWith('/client/dashboard/project-management/')

  useEffect(() => {
    setOpen(false);
  }, [pt]);

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

      <div className="app_dash_main__hdr__title flex gap-3 space-x-5 justify-center items-center">
        {showBackArrow && (
          <button
            onClick={() => {
              rt.back();
            }}
            className="flex items-center gap-2 text-primary hover:text-primary-dark"
          >
            <ArrowLeft />
          </button>
        )}
        {bread}
      </div>

      <div className="app_dash_main__hdr__rgt">
        <div className="flex items-center gap-4">
          <div onClick={handleNotification} className="relative cursor-pointer">
            <Bell />
            {/* {(notificationCountData as number) > 0 && (
              <span className="absolute top-3 -right-2 w-5 h-5 text-white text-center bg-red-800 p-1 text-[8px] rounded-full">
                {notificationCountData}
              </span>
            )} */}
            {unreadCount > 0 && (
              <span className="absolute top-3 -right-2 w-5 h-5 text-white text-center bg-red-800 p-1 text-[8px] rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>

          <button onClick={handleLogoutRedirect}>
            <ArrowRightToBracket />
          </button>
        </div>
      </div>
    </header>
  );
}
