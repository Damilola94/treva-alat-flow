import React from 'react';

interface Tab {
  label: string;
  count?: number;
  value: string;
}

interface TransactionTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  activeClass: string;
  inactiveClass: string;
}

const TabSelector: React.FC<TransactionTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  activeClass,
  inactiveClass,
}) => {
  return (
    <div className="mb-6 flex">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`px-4 py-2 text-sm font-medium rounded-full mr-2 ${
            activeTab === tab.value ? activeClass : inactiveClass
          }`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label} <span className="ml-1">{tab.count}</span>
        </button>
      ))}
    </div>
  );
};

export default TabSelector;
