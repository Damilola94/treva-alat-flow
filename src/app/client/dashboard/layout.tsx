'use client';

import { Suspense, useEffect, useState } from 'react';
import {
  Header,
  Sidebar,
} from '@/components/shared/dashboard';
import { Inter } from 'next/font/google';
import { Column, Users } from '@/components/shared';
import routes from '@/lib/routes';
import queries from '@/services/queries/profile';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

function Main ({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { data } = queries.read();

  const clientMenuItems = [
    { label: 'Hiring Management', href: routes.client.dashboard.hiringManagement.path, icon: <Users /> },
    { label: 'Project Management', href: routes.client.dashboard.projectManagement.path, icon: <Column /> },

  ];

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
   <Sidebar menuItems={clientMenuItems} logoHref={routes.client.dashboard.entry.path} userData={data} />;
        </div>
        <div className="app_dash_main__ctt">
          <Header />
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
