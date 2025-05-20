import { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/shared/Label';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Table } from '@/components/shared/Table';
import { useDeliverable } from '@/hooks/Projects';

export function DeliverableTable() {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  const [activeTab, setActiveTab] = useState<'completed' | 'all'>('all');

  const { allDeliverablesData, loading } = useDeliverable(projectId);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });
  const headers = [
    {
      header: 'Deliverable name',
      accessorKey: 'name',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Due date',
      accessorKey: 'endDate',
    },
    {
      header: 'Unit',
      accessorKey: 'unit',
    },
    {
      header: 'Unit Amount',
      accessorKey: 'unitAmount',
    },
    {
      header: 'Total Amount',
      accessorKey: 'total',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const value = row.original.status;
        return (
          <div className="">
            <Label type="status" value={value} />
          </div>
        );
      },
    },
  ];

   const allDeliverables = useMemo(() => {
    return allDeliverablesData?.isSuccess && allDeliverablesData.data
      ? allDeliverablesData.data
      : [];
  }, [allDeliverablesData?.isSuccess, allDeliverablesData?.data]);

  const completedDeliverables = useMemo(
    () => allDeliverables.filter((d) => d.status === 'Completed'),
    [allDeliverables]
  );

  // Table data based on tab
  const tableBody = activeTab === 'all' ? allDeliverables : completedDeliverables;

  return (
    <div className="app_dashboard_home__task__cct">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as 'all' | 'completed');
        }}
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
             {allDeliverables.length}
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
              {completedDeliverables.length}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>


      <div className="w-full text-left relative rounded-xl overflow-auto">
        {loading ? (
          <div className="text-center flex justify-center items-center">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : (
          <Table
            columns={headers}
             emptyTitle={
              activeTab === 'completed'
                ? 'No completed deliverable'
                : 'No deliverable Yet'
            }
            emptyMessage={
              activeTab === 'completed'
                ? "You'll see all your completed deliverables here"
                : "You'll see all your deliverables here"
            }
            data={tableBody}
            pagination={pagination}
            setPagination={setPagination}
          />
        )}
      </div>
    </div>
  );
}
