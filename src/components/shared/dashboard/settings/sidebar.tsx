import routes from '@/lib/routes';
import { useAppSelector } from '@/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useAppSelector((state) => state?.auth);
  const isCreative = useMemo(
    () => Array.isArray(role) && role.includes('Creative'),
    [role],
  );
  // const { isActive } = useIsActive();

  const menuItems = [
    {
      label: 'Profile',
      href: isCreative
        ? routes.creatives.dashboard.settings.profile.path
        : routes.client.dashboard.settings.profile.path,
    },
    {
      label: 'Security',
      href: isCreative
        ? routes.creatives.dashboard.settings.security.path
        : routes.client.dashboard.settings.security.path,
    },
    {
      label: 'Notifications',
      href: isCreative
        ? routes.creatives.dashboard.settings.notifications.path
        : routes.client.dashboard.settings.notifications.path,
    },
  ].filter((item) => !!item.href);

  return (
    <div className="w-60 mb-24 min-h-[calc(100vh-4rem)] overflow-auto shrink-0 p-6 border-r border-gray-200 bg-white rounded-l-xl shadow-sm relative">
      <ul className="space-y-5">
        {menuItems.map((item) => {
          //   const activeCN = isActive(item?.href, item.label === 'Settings')
          //     ? 'active'
          //     : '';
          const isActive = pathname === item.href;
          return (
            <li key={item.label}>
              <Link
                href={item?.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? ' text-[#7B37F0] '
                    : 'text-[#3D3D3D] hover:text-[#7B37F0]'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="absolute bottom-10">
        <div className="px-4 mt-auto">
          <button className="text-[#E7211B]">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
