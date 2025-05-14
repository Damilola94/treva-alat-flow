'use client';
import { ChatSideModal, Tab } from '@/components/shared';
import React, { useState } from 'react';
import { ChatWindow, NotificationsList } from './components';
import { messageNotifications, notificationsList } from '@/constants';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [messageModal, toggleMessageModal] = useState(false);

  const tabs = [
    {
      trigger: 'All Notifications',
      value: 'notifications',
      content: (
        <>
          <NotificationsList
            toggleMessageModal={toggleMessageModal}
            notifications={notificationsList}
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
            notifications={messageNotifications}
          />
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

      {/* withdraw funds side modal */}
      <ChatSideModal
        isOpen={messageModal}
        onClose={() => {
          toggleMessageModal(false);
        }}
        title={"{{Creative's Name}}"}
        projName="{{Project Name}}"
        usebg={false}
      >
        <div className="space-y-10">
          <ChatWindow />
        </div>
      </ChatSideModal>
    </>
  );
};

export default Notifications;
