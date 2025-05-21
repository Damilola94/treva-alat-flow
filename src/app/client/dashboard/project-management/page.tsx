'use client';
import { Label, Pill, Table } from '@/components/shared';
import SearchInput from '@/components/ui/SearchInput';
import { clientDashboardTasks } from '@/constants';
import { useProjects } from '@/hooks/Projects';
import clientManagement from '@/lib/assets/client-management';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
interface ProjectQueryParams {
  type?: string;
  status?: string;
  priority?: string;
  currency?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

export default function Page() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [params, setParams] = useState<ProjectQueryParams>({
    // type: '2',
    // status: '2',
    // priority: '3',
    currency: 'NGN',
    pageNumber: 1,
    pageSize: 50,
    searchKey: '',
  });

  const { allProjectsData, loading } = useProjects(params);  

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const headers = [
    {
      header: 'Project Name',
      accessorKey: 'title',
    },
    {
      header: 'Creative',
      accessorKey: 'creativeUser',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const creative = row.original.creativeUser;
        return (
          <div className="flex items-center gap-2">
            <Image
              src={creative.profilePicture || clientManagement.femaleClient}
              alt={creative.firstName}
              className="w-6 h-6 rounded-full"
            />
            <span>{creative.firstName} {creative.lastName}</span>
          </div>
        )
      },
    },
    {
      header: 'Amount (NGN)',
      accessorKey: 'actualCost',
    },
    {
      header: 'Start date',
      accessorKey: 'startDate',
    },
    {
      header: 'Due Date',
      accessorKey: 'expectedDeliveryDate',
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

  const tableBody = useMemo(() => {
    return allProjectsData?.isSuccess && allProjectsData.data
      ? allProjectsData.data
      : [];
  }, [allProjectsData?.isSuccess, allProjectsData?.data]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      pageNumber: pagination?.pageIndex + 1,
      pageSize: pagination?.pageSize,
    }));
  }, [pagination]);

  const handleParamChange = (param: Partial<ProjectQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...param,
    }));
  };

  return (
    <div className="app_dashboard_home__task app_dashboard_page__px">
      <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
        <div className="flex border-t border-gray-200 p-4 gap-2">
          {clientDashboardTasks.map((item) => (
            <Pill
              key={item.value}
              size="md"
              active={selectedCategory === item.value}
              onClick={() => {
                setSelectedCategory(item.value);
                handleParamChange({
                  status: item?.value === 'All' ? undefined : item?.value,
                });
              }}
            >
              {item.label}
            </Pill>
          ))}
        </div>
        <SearchInput
          placeholder="Search for Project"
          onChange={(e) => {
            handleParamChange({ searchKey: e.target.value });
          }}
        />
      </div>
      {loading ? (
        <div className="text-center flex justify-center items-center">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : (
        <Table
          columns={headers}
          emptyTitle="No Project Yet"
          emptyMessage="You'll see all your projects here"
          data={tableBody}
          pagination={pagination}
          setPagination={setPagination}
          onRowClick={(row) => router.push(`/client/dashboard/project-management/${row.id}`)}
        />
      )}
    </div>
  );
}
