'use client'
import { ProjectsTable } from '@/components/shared/client/dashboard/project-management/project-table';
import { Search } from 'lucide-react';
import { useState } from 'react';

type TabType = 'All Project' | 'Pending Project' | 'Completed Project' | 'Due Project'

export default function Page () {
  const [activeTab, setActiveTab] = useState<TabType>('All Project')

  return (
    <div className="app_dashboard_home__task app_dashboard_page__px">
    <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
    <div className="flex border-t border-gray-200 p-4 gap-2">
          {['All Project', 'Pending Project', 'Completed Project', 'Due Project'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 text-sm font-bold ${
                activeTab === tab ? ' border rounded-full border-[#262626] text-[#262626]' : 'text-[#808080] rounded-full border border-[#808080]'
              }`}
              onClick={() => { setActiveTab(tab as TabType); }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search for creatives"
            className="w-full border border-gray-200 rounded-full px-4 py-2 pl-10 text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
    </div>
    <ProjectsTable />
  </div>
  );
}
