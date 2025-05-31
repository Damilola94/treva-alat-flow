'use client';

import { Suspense, useEffect, useState } from 'react';
import { Footer, Header, Sidebar } from '@/components/shared/dashboard';
import { Inter } from 'next/font/google';
import { Column, Users, GlobeAlt, Grid, Payment } from '@/components/shared';
import routes from '@/lib/routes';
// import queries from '@/services/queries/profile';
import { usePathname } from 'next/navigation';
import { ChatIcon, Notifications } from '@/app/assets/svgs';
import { useProfile } from '@/hooks/Users';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});


function Main({ children }: { children: React.ReactNode }) {
  const pt = usePathname();
  
  const shouldShowBackArrow =
  pt.startsWith('/client/dashboard/project-management/') ||
  pt.startsWith('/client/dashboard/hiring-management/') ||
  /^\/client\/dashboard\/payment\/[^/]+$/.test(pt);

  const [mounted, setMounted] = useState(false);
  // const { data } = queries.read();
  const { data } = useProfile();

  const clientMenuItems = [
    {
      label: 'Get Started',
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
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="app_dash_main flex-col">
      <div className="app_dash_main flex-1 relative">
        <div className="z-50 md:relative fixed top-0">
          <Sidebar
            menuItems={clientMenuItems}
            logoHref={routes.client.dashboard.entry.path}
            userData={data?.data}
          />
          ;
        </div>
        <div className="app_dash_main__ctt">
          <Header showBackArrow={shouldShowBackArrow} />
          <div className="app_dash_main__ctt__mn w-full">
            <div className="app_dashboard_page">{children}</div>
            {false && <Footer />}
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
