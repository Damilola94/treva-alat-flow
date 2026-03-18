'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createChatHubConnection,
  registerChatHubListeners,
  unregisterChatHubListeners,
} from '@/lib/signalr/chatHub';
import { getCookie } from '@/utils';
import { useNotifications } from '@/hooks/Chat';

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
  content?: string | null;
  type?: number | string | null;
  objectId?: string | null;
  objectSlug?: string | null;
  objectIdentifier?: string | null;
  isRead?: boolean;
}

type NotificationContextType = {
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
  addNotification: (notification: INotification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  refetchNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [params] = useState({
    searchKey: '',
    pageNumber: 1,
    pageSize: 50,
  });

  const { allNotifications, loading, refetch } = useNotifications(params);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    setNotifications(allNotifications?.data || []);
  }, [allNotifications?.data]);

  const addNotification = useCallback((notification: INotification) => {
    setNotifications((prev) => {
      const exists = prev.some((item) => item.id === notification.id);

      if (exists) {
        return prev.map((item) =>
          item.id === notification.id ? { ...item, ...notification } : item,
        );
      }

      return [notification, ...prev];
    });
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      })),
    );
  }, []);

  const refetchNotifications = useCallback(() => {
    refetch?.();
  }, [refetch]);

  useEffect(() => {
    const token = getCookie('_tk');
    if (!token) return;

    const conn = createChatHubConnection(token);
    let isDisposed = false;

    registerChatHubListeners(conn, {
      onReceiveNotification: (notification: INotification) => {
        addNotification({
          ...notification,
          isRead: false,
        });
      },
    });

    conn.start().catch((error) => {
      const message =
        error instanceof Error ? error.message : String(error);

      const isNegotiationAbort =
        error?.name === 'AbortError' ||
        message.includes('stopped during negotiation');

      if (isDisposed || isNegotiationAbort) {
        return;
      }

      console.error('Notification SignalR connection failed', error);
    });

    return () => {
      isDisposed = true;
      unregisterChatHubListeners(conn);
      conn.stop().catch(() => null);
    };
  }, [addNotification]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.isRead).length;
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      setNotifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      refetchNotifications,
    }),
    [
      notifications,
      unreadCount,
      loading,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      refetchNotifications,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotificationContext must be used within NotificationProvider',
    );
  }

  return context;
};