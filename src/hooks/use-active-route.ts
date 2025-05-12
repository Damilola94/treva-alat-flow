import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useIsActive () {
  const pathname = usePathname();

  const isActive = useCallback(
    (href: string, exact: boolean = false) => {
      if (!href) return false;
      return exact ? pathname === href : pathname.startsWith(href);
    },
    [pathname]
  );

  return { isActive };
}
