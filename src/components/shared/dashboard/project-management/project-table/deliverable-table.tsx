import { useState } from 'react';
import { EmptyStatus } from '../../../svgs';
import { Badge, type BadgeProps } from '@/components/shared/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusMap: Record<string, { style: BadgeProps['style'] }> = {
  Completed: { style: 'success' },
  Ongoing: { style: 'pending' },
  Pending: { style: 'danger' },
};

const thead = [
  { label: 'Deliverable name' },
  { label: 'Description' },
  { label: 'Due date' },
  { label: 'Unit' },
  { label: 'Unit Amount' },
  { label: 'Total Amount' },
  { label: 'Status' },
];

const deliverable = Array(4).fill({
  id: '1',
  name: '{Deliverable name}',
  description: '{Description}',
  dueDate: '{Month day, year}',
  unit: '{unit}',
  unitAmount: '{Unit Amount}',
  totalAmpont: '{Total amount}',
  status: 'Ongoing',
});

export function DeliverableTable () {
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');

  const filteredData =
    activeTab === 'completed'
      ? deliverable.filter((d) => d.status === 'Completed')
      : deliverable;

  return (
    <div className="app_dashboard_home__task__cct">
      <Tabs
        value={activeTab}
        onValueChange={(value) => { setActiveTab(value as 'all' | 'completed'); }}
        className="w-full mt-3"
      >
        <TabsList className="mb-4 gap-3">
          <TabsTrigger
            value="all"
            className="flex gap-2 rounded-full border-none"
            style={{
              backgroundColor: activeTab === 'all' ? '#26A17B' : 'white',
              color: activeTab === 'all' ? 'white' : 'black',
            }}
          >
            All
            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm text-black">
              {deliverable.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex gap-2 rounded-full border-none"
            style={{
              backgroundColor: activeTab === 'completed' ? '#26A17B' : 'white',
              color: activeTab === 'completed' ? 'white' : 'black',
            }}
          >
            Completed
            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm text-black">
              {
                deliverable.filter((d) => d.status === 'Completed').length
              }
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredData.length === 0 ? (
        <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
          <EmptyStatus />
          <div className="flex flex-col gap-1">
            <p className="app_dashboard_home__task__ctt__title">
              No deliverables yet
            </p>
            <p className="app_dashboard_home__task__ctt__desc">
              Click &quot;add new deliverables&quot; button to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full text-left relative rounded-xl overflow-auto">
          <div className="shadow-sm overflow">
            <table className="border-collapse table-auto w-full app_table">
              <thead>
                <tr className="app_table__tr">
                  {thead.map(({ label }) => (
                    <th key={label} className="app_table__tr__th">
                      <div className="app_table__tr__th__edit">{label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="app_table__tbody">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="">
                    <td className="app_table__tbody__td font-medium text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt font-semibold">
                        {item.name}
                      </div>
                    </td>
                    <td className="app_table__tbody__td text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt">
                        {item.description}
                      </div>
                    </td>
                    <td className="app_table__tbody__td text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt">
                        {item.dueDate}
                      </div>
                    </td>
                    <td className="app_table__tbody__td text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt">
                        {item.unit}
                      </div>
                    </td>
                    <td className="app_table__tbody__td text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt">
                        {item.unitAmount}
                      </div>
                    </td>
                    <td className="app_table__tbody__td text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt">
                        {item.totalAmpont}
                      </div>
                    </td>
                    <td className="app_table__tbody__td">
                      <div className="app_table__tbody__td__ctt">
                        <Badge
                          title={item.status}
                          style={statusMap[item.status]?.style ?? 'pending'}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
