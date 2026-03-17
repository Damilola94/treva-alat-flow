'use client';

import React from 'react';
import Image from 'next/image';
import { NPayment } from '@/app/assets/svgs';
import { NotificationTypeEnums } from '@/types';
import { extractName, getAvatar, getFullName } from '@/lib/utils';
import { Avatar } from '@/components/shared/avatar';
import { errorToast, useReadNotificationMutation } from '@/services';
import { getErrorMessage } from '@/utils';
import { useNotificationContext } from '@/contexts/NotificationProvider';

interface NotificationItem {
  id?: string;
  createdDate?: string;
  createdBy?: string | null;
  modifiedDate?: string | null;
  modifiedBy?: string | null;
  isDeleted?: boolean;
  deletedDate?: string | null;
  deletedBy?: string | null;
  sourceName?: string | null;
  sourceAvatar?: string | null;
  title: string | null;
  type?: number | string | null;
  objectId?: string | null;
  objectSlug?: string | null;
  objectIdentifier?: string | null;
  isRead?: boolean;
}

interface GroupedNotifications {
  dateLabel: string;
  items: NotificationItem[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const groupNotifications = (
  notifications: NotificationItem[],
): GroupedNotifications[] => {
  const groups: Record<string, NotificationItem[]> = {};

  notifications?.forEach((n) => {
    const createdDate = n.createdDate ? new Date(n.createdDate) : new Date();
    const key = formatDate(createdDate);
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });

  return Object.entries(groups).map(([dateLabel, items]) => ({
    dateLabel,
    items,
  }));
};

const NotificationList: React.FC<{
  notifications: NotificationItem[];
  toggleMessageModal: (value: boolean) => void;
  setSelectedNotification: (value: NotificationItem | null) => void;
  refetch: () => void;
}> = ({
  notifications,
  toggleMessageModal,
  setSelectedNotification,
  refetch,
}) => {
  const [triggerReadNotification] = useReadNotificationMutation();
  const { markNotificationAsRead } = useNotificationContext();

  const handleReadNotification = async (item: NotificationItem) => {
    if (!item?.id) return;

    if (!item.isRead) {
      markNotificationAsRead(item.id);
    }

    setSelectedNotification(item);
    toggleMessageModal(true);

    try {
      if (!item.isRead) {
        const response = await triggerReadNotification({
          notificationId: item.id,
        }).unwrap();

        if (!response?.isSuccess) {
          errorToast(response?.message || 'Failed to read notification');
        }
      }

      refetch && refetch();
    } catch (error) {
      errorToast(getErrorMessage(error));
      refetch && refetch();
    }
  };

  const grouped = groupNotifications(
    Array.isArray(notifications) ? notifications : [],
  );

  return (
    <>
      {grouped?.length > 0 ? (
        <div className="space-y-8 border border-[#E7E7E7] bg-white pt-5 rounded-xl">
          {grouped.map((group) => (
            <div key={group.dateLabel}>
              <div className="flex items-center mb-4">
                <div className="flex-1 h-px bg-gray-200" />

                <span className="px-3 text-xs text-gray-400 whitespace-nowrap">
                  {group.dateLabel}
                </span>

                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div>
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className={`w-full flex justify-between items-center p-4 border border-[#E7E7E7] ${
                      !item.isRead ? 'bg-[#F0F2FF]' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-[40px] h-[40px]">
                        {item.sourceAvatar ? (
                          <Image
                            src={item.sourceAvatar}
                            alt="avatar"
                            className="rounded-full w-[40px] h-[40px] object-cover"
                            width={40}
                            height={40}
                            unoptimized
                          />
                        ) : (
                          <>
                            {item?.type === NotificationTypeEnums.Invoice && (
                              <NPayment />
                            )}

                            {item?.type === NotificationTypeEnums.Message && (
                              <Avatar
                                src={getAvatar({
                                  name: item?.sourceName
                                    ? getFullName(extractName(item?.sourceName))
                                    : '',
                                  length: 2,
                                })}
                                className="w-[40px] h-[40px] rounded-full border-[2.42px] border-[#A5A6F6] object-cover"
                                size="mds"
                              />
                            )}
                          </>
                        )}
                      </div>

                      <div>
                        <p className="items-center text-sm text-gray-800">
                          <span className="font-bold">{item?.sourceName} </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item?.title ?? '',
                            }}
                          />
                        </p>

                        <div>
                          <span className="text-xs text-gray-400 mt-1">
                            {item.createdDate &&
                              `${formatDate(
                                new Date(item.createdDate),
                              )} • ${new Date(
                                item.createdDate,
                              ).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item?.type !== undefined && (
                      <button
                        className="border border-[#7B37F0] text-[#7B37F0] px-4 py-3 rounded-full text-sm hover:bg-[#f7f1ff]"
                        onClick={() => {
                          if (item.type === NotificationTypeEnums.Message) {
                            handleReadNotification(item);
                          }
                        }}
                      >
                        {NotificationTypeEnums[Number(item?.type)]}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[65vh] text-xl text-[#7b7575] flex justify-center items-center">
          No Notifications found
        </div>
      )}
    </>
  );
};

export default NotificationList;