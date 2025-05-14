import React from 'react';
import Image, { type StaticImageData } from 'next/image';

interface NotificationItem {
  id: string;
  type: string;
  date: Date;
  message: string;
  name?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  avatarUrl?: StaticImageData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  highlighted?: boolean;
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
  notifications.forEach((n) => {
    const key = formatDate(n.date);
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
}> = ({ notifications, toggleMessageModal }) => {
  const grouped = groupNotifications(notifications);

  return (
    <div className="space-y-8 border border-[#E7E7E7] bg-white pt-5 rounded-xl">
      {grouped.map((group) => (
        <div key={group.dateLabel}>
          <div className="text-center text-xs text-gray-400 mb-4">
            {group.dateLabel}
          </div>
          <div className="">
            {group.items.map(({ icon: Icon, ...rest }) => (
              <div
                key={rest.id}
                className={`w-full flex justify-between items-center p-4 border border-[#E7E7E7] ${
                  rest.highlighted ? 'bg-[#F0F2FF]' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="w-[40px] h-[40px]">
                    {rest.avatarUrl ? (
                      <Image
                        src={rest.avatarUrl}
                        alt="avatar"
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <Icon className="" />
                    )}
                  </div>
                  <div>
                    <p className="items-center text-sm text-gray-800">
                      <span className="font-bold">{rest?.name} </span>
                      <span
                        dangerouslySetInnerHTML={{ __html: rest?.message }}
                      />
                    </p>
                    <div>
                      <span className="text-xs text-gray-400 mt-1">
                        {formatDate(rest?.date)} •{' '}
                        {rest?.date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {rest?.actionLabel && (
                  <button
                    className="border border-[#7B37F0] text-[#7B37F0] px-4 py-3 rounded-full text-sm hover:bg-[#f7f1ff]"
                    onClick={() => {
                      rest?.actionLabel === 'View Message' &&
                        toggleMessageModal(true);
                    }}
                  >
                    {rest?.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
