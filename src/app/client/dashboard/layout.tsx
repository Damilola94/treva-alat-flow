'use client';

import { Suspense, useEffect, useState } from 'react';
import { Footer, Header, Sidebar } from '@/components/shared/dashboard';
// import { Inter } from 'next/font/google';
import {
  Column,
  Users,
  GlobeAlt,
  Grid,
  Payment,
  Settings,
} from '@/components/shared';
import routes from '@/lib/routes';
// import queries from '@/services/queries/profile';
import { usePathname } from 'next/navigation';
import { ChatIcon, Notifications } from '@/app/assets/svgs';
import { useProfile } from '@/hooks/Users';
import { useAppSelector } from '@/store';

// const inter = Inter({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
// });

function Main({ children }: { children: React.ReactNode }) {
  const pt = usePathname();

  const shouldShowBackArrow =
    pt.startsWith('/client/dashboard/project-management/') ||
    pt.startsWith('/client/dashboard/hiring-management/') ||
    /^\/client\/dashboard\/payment\/[^/]+$/.test(pt);

  const [mounted, setMounted] = useState(false);
  // const { data } = queries.read();
  const { data } = useProfile();

  const isOnboardingCompleted = useAppSelector(
    (state) => state.auth.isOnboardingCompleted || data?.data?.isCompleted
  );

  const clientMenuItems = [
    // {
    //   label: 'Get Started',
    //   href: routes.client.dashboard.getStarted.path,
    //   icon: <GlobeAlt />,
    // },
    {
      label: 'Profile Onboarding',
      href: routes.client.dashboard.getStarted.path,
      icon: <GlobeAlt />,
    },
    {
      label: 'Dashboard',
      href: routes.client.dashboard.entry.path,
      icon: <Grid />,
    },
    {
      label: 'Hiring Management',
      href: routes.client.dashboard.hiringManagement.path,
      icon: <Users />,
    },
    {
      label: 'Project Management',
      href: routes.client.dashboard.projectManagement.path,
      icon: <Column />,
    },
    {
      label: 'Chat',
      href: routes.client.dashboard.chat.path,
      icon: <ChatIcon />,
    },
    {
      label: 'Payment',
      href: routes.client.dashboard.payment.path,
      icon: <Payment />,
    },
    {
      label: 'Reminders and Notification',
      href: routes.client.dashboard.notifications.path,
      icon: <Notifications />,
    },
    {
      label: 'Settings',
      href: routes.client.dashboard.settings.profile.path,
      icon: <Settings />,
    },
  ]
    .map((item) => ({
      ...item,
      disabled: !isOnboardingCompleted && item.label !== 'Profile Onboarding',
    }))
    .filter(
      (item) => !(isOnboardingCompleted && item.label === 'Profile Onboarding'),
    );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="app_dash_main flex-col !min-h-screen">
      <div className="app_dash_main flex-1 relative">
        <div className="z-50 md:relative fixed top-0">
          <Sidebar
            menuItems={clientMenuItems}
            logoHref={routes.client.dashboard.entry.path}
            userData={data?.data}
          />
        </div>
        <div className="app_dash_main__ctt">

          <Header showBackArrow={shouldShowBackArrow} />
          <div className="app_dash_main__ctt__mn w-full">
          <div className="flex-1 flex flex-col w-full">
            <div className="app_dashboard_page">{children}</div>
          <div className="fixed bottom-0 w-[1210px] ">
            {/* w-full bg-white border-t */}
            <Footer />
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <body
    //     suppressHydrationWarning
    //     className={inter.className}
    //     id="app_dashboard_body"
    //   >
        <Suspense fallback={null}>
          <Main>{children}</Main>
        </Suspense>
    //   </body>
    // </html>
  );
}
