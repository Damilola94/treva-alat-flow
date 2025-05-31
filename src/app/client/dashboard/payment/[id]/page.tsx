'use client';
import { Table } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useDeliverable } from '@/hooks/Projects/useProjects';
import { useGetProjectByIdQuery } from '@/services';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

export default function Page({params}: IProps) {
  const  projectId  = params.id;

  const { data, isLoading } = useGetProjectByIdQuery(projectId);
  const { allDeliverablesData } = useDeliverable(projectId);

  const deliverableHeaders = [
    {
      header: 'Deliverable',
      accessorKey: 'name',
      // cell: ({ row }: any) => `Payment ${row.index + 1}`,
    },
    {
      header: 'Unit Price',
      accessorKey: 'unitAmount',
    },
    {
      header: 'Unit',
      accessorKey: 'unit',
    },
    {
      header: 'Amount',
      accessorKey: 'total',
    },
  ];

    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 50,
    });

  const tableDeliverableBody = useMemo(() => {
    return allDeliverablesData?.isSuccess && allDeliverablesData.data
      ? allDeliverablesData.data
      : [];
  }, [allDeliverablesData?.isSuccess, allDeliverablesData?.data]);

  const project = data;
  const clientName = project?.data?.clientUser?.firstName
    ? `${project?.data?.clientUser.firstName} ${project?.data?.clientUser.lastName}`
    : '';
  const projectName = project?.data?.title;
  const startDate = project?.data?.startDate?.slice(0, 10);
  const endDate = project?.data?.expectedDeliveryDate?.slice(0, 10);

  const deliverableSubtotal = useMemo(() => {
  if (allDeliverablesData?.isSuccess && Array.isArray(allDeliverablesData.data)) {
    return allDeliverablesData.data.reduce((sum, item) => {
      return sum + (item.total || 0);
    }, 0);
  }
  return 0;
}, [allDeliverablesData]);

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="app_get_started_professional_details__form flex flex-col gap-10 !max-w-[700px] !mx-auto">
        <div className="border border-[#E5E5E5] rounded-xl p-4">
          <div className="mb-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <span className=" text-[#6B7280]">Project name:</span>{' '}
                {projectName || 'name'}
              </p>
              <p>
                <span className=" text-[#6B7280]">Client name:</span>{' '}
                {clientName || 'client name'}
              </p>
              <p>
                <span className=" text-[#6B7280]">Start date:</span> {startDate || 'date'}
              </p>
              <p>
                <span className=" text-[#6B7280]">End date:</span> {endDate || 'date'}
              </p>
            </div>
          </div>

          <div className="w-full text-left relative rounded-xl overflow-auto ">
            <div className="shadow-sm md:overflow-hidden ">
              {isLoading ? (
                  <div className="text-center flex justify-center items-center">
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                ) : (
                  <Table
                    columns={deliverableHeaders}
                    emptyTitle="No deliverable Yet"
                    emptyMessage="You'll see all your deliverable here"
                    data={tableDeliverableBody}
                    pagination={pagination}
                    setPagination={setPagination}
                  />
                )}
              <hr className="bg-[#E5E5E5] mt-6" />
            </div>
          </div>
          <div className="flex justify-end">
          <div className="mt-6 text-start space-y-4">
            <div className="flex gap-5">
              <span className="text-[#6B7280]">TOTAL:</span>
              <span>{deliverableSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex gap-5">
              <span className="text-[#6B7280]">AMOUNT PAID:</span>
              <span>NGN 4,000.00</span>
            </div>
            <div className="flex gap-5 font-bold">
              <span>BALANCE DUE:</span>
              <span>NGN 64,000.00</span>
            </div>
          </div>
          </div>
        </div>
        <div className="w-full text-left relative rounded-xl overflow-auto ">
          <div className="shadow-sm md:overflow-hidden ">
            <hr className="bg-[#E5E5E5] mt-6" />
          </div>
        </div>
        <div className="mt-6 text-right">
          <Button
            size="lg"
            className=" py-3 px-12"
            backgroundColor="primary-blue-500"
          >
            Pay Balance Due 
          </Button>
        </div>
      </div>
    </div>
  );
}
