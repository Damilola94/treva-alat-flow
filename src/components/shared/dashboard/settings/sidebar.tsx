'use client';
import routes from '@/lib/routes';
import { useAppSelector } from '@/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CenterModal } from '../../CenterModal';
import {
  errorToast,
  successToast,
  useDeleteUserProfileMutation,
} from '@/services';
import { getErrorMessage, handleLogoutRedirect } from '@/utils';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const pathname = usePathname();
  const { role, userId } = useAppSelector((state) => state?.auth);
  const isCreative = useMemo(
    () => Array.isArray(role) && role.includes('Creative'),
    [role],
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [triggerDelete, { isLoading }] = useDeleteUserProfileMutation();
  // const { isActive } = useIsActive();

  const deleteUser = async () => {
    try {
      const payload = {
        userId: userId,
      };
      const response = await triggerDelete(payload).unwrap();
      if (response?.isSuccess) {
        successToast(response?.message || 'Account deleted successfully');
        handleLogoutRedirect();
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      errorToast(getErrorMessage(error));
    }
  };

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
    <>
      {/* mobile */}
        <div className="md:hidden flex justify-between items-center px-4 py-5 border-b bg-white sticky top-0 z-50">
          <ul className="flex gap-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`text-sm font-medium ${
                      isActive
                        ? 'text-[#7B37F0] border-b-4 border-[#7B37F0]'
                        : 'text-[#3D3D3D]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      <div className="hidden md:block w-60 mb-24 min-h-[calc(100vh-4rem)] overflow-auto shrink-0 p-6 border-r border-gray-200 bg-white rounded-l-xl shadow-sm relative">
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
            <button
              onClick={() => setDeleteModal(true)}
              className="text-[#E7211B]"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <CenterModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        headerImageType={5}
      >
        <div className="space-y-5 text-center">
          <div>
            <p className="font-bold text-[16px]">
              Are you sure you want to delete this account?
            </p>
            <p className="text-[#888888]">
              Account will be deleted Permanently
            </p>
          </div>
          <div className="w-full flex items-center gap-5">
            <Button
              onClick={() => setDeleteModal(false)}
              className="w-full p-3 rounded-full border border-[#F1F1F1]"
              variant={'outline'}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteUser}
              className="w-full p-3 rounded-full bg-[#F14343] text-white"
              isLoading={isLoading}
              variant={'destructive'}
            >
              Delete
            </Button>
          </div>
        </div>
      </CenterModal>
    </>
  );
}
