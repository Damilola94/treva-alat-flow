'use client';
import { ChatSideModal, MiniLoader, Tab } from '@/components/shared';
import React, { useMemo, useState } from 'react';
import { ChatWindow, NotificationsList } from './components';
import { useMessages, useNotifications } from '@/hooks/Chat';
import { NotificationTypeEnums } from '@/types';

export interface INotification {
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

const Notifications = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [messageModal, toggleMessageModal] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<INotification | null>(null);

  const [params] = useState({
    searchKey: '',
    pageNumber: 1,
    pageSize: 50,
  });

  const { allNotifications, loading, refetch } = useNotifications(params);
  const { chatByIdData, refetch: refetchChat } = useMessages({
    chatId: selectedNotification?.objectId || '',
  });


  const notificationsList = useMemo(
    () => allNotifications?.data || [],
    [allNotifications?.data],
  );

  // const chatsFetchedById = useMemo(
  //   () => chatByIdData?.data || null,
  //   [chatByIdData?.data],
  // );

  const chatsFetchedById = useMemo(() => {
    const unsorted = chatByIdData?.data || [];
    return [...unsorted].sort((a, b) => {
      const aTime = a?.sentAt ? new Date(a.sentAt).getTime() : 0;
      const bTime = b?.sentAt ? new Date(b.sentAt).getTime() : 0;
      return aTime - bTime;
    });
  }, [chatByIdData?.data]);

  const selectedNotificationItem = useMemo(
    () => notificationsList?.find((x) => x?.id === selectedNotification?.id),
    [selectedNotification, notificationsList],
  );

  const filteredMessageNotification = useMemo(() => {
    if (!Array.isArray(notificationsList)) return [];
    return notificationsList.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (notification: any) =>
        notification?.type === NotificationTypeEnums.Message,
    );
  }, [notificationsList]);

  const tabs = [
    {
      trigger: 'All Notifications',
      value: 'notifications',
      content: (
        <>
          <NotificationsList
            toggleMessageModal={toggleMessageModal}
            notifications={notificationsList || []}
            setSelectedNotification={setSelectedNotification}
            refetch={refetch}
          />
        </>
      ),
    },
    {
      trigger: 'Messages',
      value: 'messages',
      content: (
        <>
          <NotificationsList
            toggleMessageModal={toggleMessageModal}
            notifications={filteredMessageNotification}
            setSelectedNotification={setSelectedNotification}
            refetch={refetch}
          />
        </>
      ),
    },
  ];

  if (loading) {
    return <MiniLoader message="Loading" />;
  }

  return (
    <>
      <div className="p-6">
        <div className='!mb-36'>
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

      {/* withdraw funds side modal */}
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
