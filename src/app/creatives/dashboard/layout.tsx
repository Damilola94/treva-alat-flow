'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Footer,
  Header,
  Sidebar,
  SubscribeToPlan,
  // SubscribeToPlanLeft,
} from '@/components/shared/dashboard';
// import { Inter } from 'next/font/google';
import routes from '@/lib/routes';
// import queries from '@/services/queries/profile';
import {
  Column,
  File,
  GlobeAlt,
  Grid,
  Like,
  Payment,
  Settings,
  Users,
} from '@/components/shared';
import { ChatIcon, Notifications } from '@/app/assets/svgs';
import { useProfile } from '@/hooks/Users';
import { useAppSelector } from '@/store';

// const inter = Inter({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
// });

function Main({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  // const { data } = queries.read();
  const { data } = useProfile();

  const isOnboardingCompleted = useAppSelector(
    (state) => state.auth.isOnboardingCompleted,
  );

  const creativeMenuItems = [
    // {
    //   label: 'Get Started',
    //   href: routes.creatives.dashboard.getStarted.path,
    //   icon: <GlobeAlt />,
    // },
    {
      label: 'Profile Onboarding',
      href: routes.creatives.dashboard.getStarted.personalDetails.path,
      icon: <GlobeAlt />,
    },
    {
      label: 'Dashboard',
      href: routes.creatives.dashboard.entry.path,
      icon: <Grid />,
    },
    {
      label: 'Client Management',
      href: routes.creatives.dashboard.clientManagement.path,
      icon: <Users />,
    },
    {
      label: 'Project Management',
      href: routes.creatives.dashboard.projectManagement.path,
      icon: <Column />,
    },
    {
      label: 'Chat',
      href: routes.creatives.dashboard.chat.path,
      icon: <ChatIcon />,
    },
    {
      label: 'Payment',
      href: routes.creatives.dashboard.payment.path,
      icon: <Payment />,
    },
    { label: 'Contracts', href: '#', icon: <File /> },
    {
      label: 'Reminders and Notification',
      href: routes.creatives.dashboard.notifications.path,
      icon: <Notifications />,
    },
    {
      label: 'Settings',
      href: routes.creatives.dashboard.settings.profile.path,
      icon: <Settings />,
    },
    { label: 'Reviews and Feedback', href: '#', icon: <Like /> },
  ]
    .filter((item) => item.href !== '#')
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
    <main className="app_dash_main flex-col">
      <div className="app_dash_main flex-1 relative">
        <div className="z-50 md:relative fixed top-0">
          <Sidebar
            menuItems={creativeMenuItems}
            logoHref={routes.creatives.dashboard.entry.path}
            userData={data?.data}
          />
        </div>
        <div className="app_dash_main__ctt">
          {pathname === '/dashboard/get-started' ? (
            <SubscribeToPlan />
          ) : (
            // <></>
            // <SubscribeToPlanLeft />
            <></>
          )}
          <Header
            showBackArrow={pathname.startsWith(
              '/creatives/dashboard/project-management/',
            )}
          />

          <div className="app_dash_main__ctt__mn w-full">
            <div className="app_dashboard_page">{children}</div>
          </div>
          <div className="fixed bottom-0 w-[1230px]">
            <Footer />
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
