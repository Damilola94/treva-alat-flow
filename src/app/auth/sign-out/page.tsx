'use client';
import React, { useEffect } from 'react';
import routes from '@/lib/routes';
import config from '@/lib/config';
import { MiniLoader } from '@/components/shared';

export default function Page() {
  useEffect(() => {
    setTimeout(() => {
      // localStorage.clear()

      // window.location.href = routes.home.path + (query?.next ? `?next=${query.next}` : '')
      const signIn = routes.auth.signIn.path;
      const nextRoute = process.env.NEXT_PUBLIC_ASSET_PREFIX_DISABLED
        ? signIn
        : `/${config.namespace}` + signIn;
      window.location.href = nextRoute;
    }, 1500);
  }, []);

  return <MiniLoader message="Loading" />;
}
