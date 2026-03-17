'use client';

import React, { useMemo, useState } from 'react';
import { ChatSideModal, MiniLoader, Tab } from '@/components/shared';
import { ChatWindow, NotificationsList } from './components';
import { useMessages } from '@/hooks/Chat';
import { NotificationTypeEnums } from '@/types';
import {
  INotification,
  useNotificationContext,
} from '@/contexts/NotificationProvider';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [messageModal, toggleMessageModal] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<INotification | null>(null);

  const {
    notifications,
    loading,
    refetchNotifications,
  } = useNotificationContext();

  const { chatByIdData, refetch: refetchChat } = useMessages({
    chatId: selectedNotification?.objectId || '',
  });

  const chatsFetchedById = useMemo(() => {
    const unsorted = chatByIdData?.data || [];
    return [...unsorted].sort((a, b) => {
      const aTime = a?.sentAt ? new Date(a.sentAt).getTime() : 0;
      const bTime = b?.sentAt ? new Date(b.sentAt).getTime() : 0;
      return aTime - bTime;
    });
  }, [chatByIdData?.data]);

  const selectedNotificationItem = useMemo(
    () => notifications?.find((x) => x?.id === selectedNotification?.id),
    [selectedNotification, notifications],
  );

  const filteredMessageNotification = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    return notifications.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (notification: any) =>
        notification?.type === NotificationTypeEnums.Message,
    );
  }, [notifications]);

  const tabs = [
    {
      trigger: 'All Notifications',
      value: 'notifications',
      content: (
        <NotificationsList
          toggleMessageModal={toggleMessageModal}
          notifications={notifications || []}
          setSelectedNotification={setSelectedNotification}
          refetch={refetchNotifications}
        />
      ),
    },
    {
      trigger: 'Messages',
      value: 'messages',
      content: (
        <NotificationsList
          toggleMessageModal={toggleMessageModal}
          notifications={filteredMessageNotification}
          setSelectedNotification={setSelectedNotification}
          refetch={refetchNotifications}
        />
      ),
    },
  ];

  if (loading) {
    return <MiniLoader message="Loading" />;
  }

  return (
    <>
      <div className="p-6">
        <div className="!mb-36">
          <Tab
            variant="pill"
            value={activeTab}
            tabs={tabs}
            onValueChange={(value: number) => {
              setActiveTab(value);
            }}
          />
        </div>
      </div>

      <ChatSideModal
        isOpen={messageModal}
        onClose={() => {
          toggleMessageModal(false);
        }}
        title={selectedNotificationItem?.sourceName || ''}
        projName={selectedNotificationItem?.title || ''}
        usebg={false}
      >
        <div className="space-y-10">
          <ChatWindow
            chats={chatsFetchedById || []}
            chatId={selectedNotification?.objectId}
            refetch={refetchChat}
          />
        </div>
      </ChatSideModal>
    </>
  );
};

export default Notifications;