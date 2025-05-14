'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Header,
  Sidebar,
  SubscribeToPlan,
  SubscribeToPlanLeft
} from '@/components/shared/dashboard';
import { Inter } from 'next/font/google';
import routes from '@/lib/routes';
import queries from '@/services/queries/profile';
import { Column, File, GlobeAlt, Grid, Like, Payment, Users } from '@/components/shared';
import { Notifications } from '@/app/assets/svgs';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

function Main ({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data } = queries.read();

  const creativeMenuItems = [
    { label: 'Get started', href: routes.creatives.dashboard.getStarted.path, icon: <GlobeAlt /> },
    { label: 'Dashboard', href: routes.creatives.dashboard.entry.path, icon: <Grid /> },
    { label: 'Client Management', href: routes.creatives.dashboard.clientManagement.path, icon: <Users /> },
    { label: 'Project Management', href: routes.creatives.dashboard.projectManagement.path, icon: <Column /> },
    { label: 'Payment', href: routes.creatives.dashboard.payment.path, icon: <Payment /> },
    { label: 'Contracts', href: '#', icon: <File /> },
    { label: 'Reminders and Notification', href: routes.creatives.dashboard.notifications.path, icon: <Notifications /> },
    { label: 'Reviews and Feedback', href: '#', icon: <Like /> },
  ].filter(item => item.href !== '#');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="app_dash_main flex-col">
      <div className="app_dash_main flex-1 relative">
      <div
          className="z-50 md:relative fixed top-0"
        >
         <Sidebar menuItems={creativeMenuItems} logoHref={routes.creatives.dashboard.entry.path} userData={data} />
        </div>
        <div className="app_dash_main__ctt">
          {pathname === '/dashboard/get-started'
            ? (
            <SubscribeToPlan />
              )
            : (
            <SubscribeToPlanLeft />
              )}
                   <Header showBackArrow={pathname.startsWith('/creatives/dashboard/project-management/')} />

          <div className="app_dash_main__ctt__mn w-full">
            <div className="app_dashboard_page">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={inter.className}
        id="app_dashboard_body"
      >
        <Suspense fallback={null}>
          <Main>{children}</Main>
        </Suspense>
      </body>
    </html>
  );
}
