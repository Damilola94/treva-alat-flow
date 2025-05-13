'use client';
import { Tab } from '@/components/shared';
import React, { useState } from 'react';
import { NotificationsList } from './components';
import { messageNotifications, notificationsList } from '@/constants';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      trigger: 'All Notifications',
      value: 'notifications',
      content: (
        <>
          <NotificationsList notifications={notificationsList} />
        </>
      ),
    },
    {
      trigger: 'Messages',
      value: 'messages',
      content: (
        <>
          <NotificationsList notifications={messageNotifications} />
        </>
      ),
    },
  ];
  return (
    <>
      <div className="p-6">
        <div>
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
    </>
  );
};

export default Notifications;
