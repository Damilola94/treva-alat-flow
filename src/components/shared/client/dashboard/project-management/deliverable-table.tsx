/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/shared/Label';
import { Loader2 } from 'lucide-react';
import { Table } from '@/components/shared/Table';
import { formatDate } from '@/lib/utils';
import { numberFormat } from '@/lib/numbers';
import { statusEnum } from '@/constants';

type Deliverable = {
  id: string;
  name: string;
  description?: string;
  endDate?: string;
  unit?: number;
  unitAmount?: number;
  total?: number;
  status: number;
};

export function DeliverableTable({
  deliverables,
  loading,
}: {
  deliverables: Deliverable[];
  loading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'completed' | 'all'>('all');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 });

  const headers = [
    { header: 'Deliverable name', accessorKey: 'name' },
    { header: 'Description', accessorKey: 'description' },
    {
      header: 'Due date',
      accessorKey: 'endDate',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => formatDate(row.original.endDate),
    },
    { header: 'Unit', accessorKey: 'unit' },
    {
      header: 'Unit Amount',
      accessorKey: 'unitAmount',
      cell: ({ row }: any) => (
        <span>{numberFormat(row.original.unitAmount)}</span>
      ),
    },
    {
      header: 'Total Amount',
      accessorKey: 'total',
      cell: ({ row }: any) => <span>{numberFormat(row.original.total)}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: any) => (
        <div>
          {/* ✅ pass the number directly; Label maps it to string internally */}
          <Label type="status" value={row.original.status} />
        </div>
      ),
    },
  ];

  const completedDeliverables = useMemo(
    () => deliverables.filter((d) => d.status === statusEnum.Completed),
    [deliverables],
  );

  const tableBody = activeTab === 'all' ? deliverables : completedDeliverables;

  return (
    <div className="app_dashboard_home__task__cct">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'all' | 'completed')}
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
              {deliverables.length}
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
                : 'No deliverable yet'
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