/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { useDeliverable } from '@/hooks/Projects';
import { useMemo, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Table } from '@/components/shared/Table';

import { useUpdateDeliverableMutation } from '@/services';
import { Button } from '@/components/ui/button';
import { CenterModal } from '@/components/shared/CenterModal';

export function DeliverableTable({
  refetchProject,
  onDeliverableClick,
}: {
  refetchProject: () => void;
  onDeliverableClick?: (deliverableId: string) => void;
}) {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;

  const { allDeliverablesData, loading, refetchAllDeliverables } =
    useDeliverable(projectId);
  const [updatedDeliverable, { isLoading }] = useUpdateDeliverableMutation();
  // const deliverableData = allDeliverablesData?.data?.[0];
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const [showModal, setShowModal] = useState(false);

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
      header: 'Start date',
      accessorKey: 'startDate',
      cell: ({ row }: any) => {
        const date = row.original.startDate;
        return formatDate(date);
      },
    },
    {
      header: 'Amount',
      accessorKey: 'total',
    },
    {
      header: '',
      accessorKey: 'actions',
      cell: ({ row }: any) => {
        const deliverable = row.original;
        const isCompleted = deliverable.status === 4;

        const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          e.stopPropagation();
          const newStatus = e.target.checked ? 4 : 2;
          await updatedDeliverable({
            projectId,
            deliverableId: deliverable.id,
            ...deliverable,
            status: newStatus,
          });
          if (refetchAllDeliverables) refetchAllDeliverables();
          if (refetchProject) refetchProject();
        };

        return (
          <div
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="w-5 h-5 cursor-pointer"
              checked={isCompleted}
              onChange={handleChange}
              disabled={isLoading}
              onClick={(e) => e.stopPropagation()}
            />
            <label>Mark as Completed</label>
          </div>
        );
      },
    },
  ];

  const tableBody = useMemo(() => {
    return allDeliverablesData?.isSuccess && allDeliverablesData.data
      ? allDeliverablesData.data
      : [];
  }, [allDeliverablesData?.isSuccess, allDeliverablesData?.data]);

  return (
    <div className="app_dashboard_home__task__cct">
      <div className="w-full text-left relative rounded-xl overflow-auto">
        <div className="shadow-sm overflow">
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
              onRowClick={
                onDeliverableClick
                  ? (row: any) => onDeliverableClick(row.id)
                  : undefined
              }
            />
          )}
        </div>
      </div>
      {/* {deliverableData?.status === 'Completed' && ( */}
      <div className="flex justify-center">
        <Button
          size="xl"
          isLoading={isLoading}
          // backgroundColor="primary-blue-500"
          className="border border-[#7B37F0] text-[#7B37F0] "
          onClick={() => setShowModal(true)}
        >
          <Check />
          Mark Project Completed
        </Button>
      </div>
      {/* )} */}

      <CenterModal
        headerImageType={4}
        title=""
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <div className="flex flex-col p-6">
          <div className="mb-6 text-center">
            <h2 className="text-[21px] font-bold text-[#262626] mb-4">
              Are you sure you want to mark this project as completed ?
            </h2>
            <p>
              The client will be notified to review and confirm project
              completion
            </p>
          </div>

          <div className="w-full flex gap-5 ">
            <Button
              backgroundColor="transparent"
              size="xl"
              color="treva-purple"
              className="w-full mb-4 border border-[#F1F1F1]"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              backgroundColor="treva-purple"
              color="white"
              size="xl"
              className="w-full cursor-pointer"
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onClick={async () => {
                const deliverables = allDeliverablesData?.data || [];
                await Promise.all(
                  deliverables.map((deliverable: any) =>
                    updatedDeliverable({
                      projectId,
                      updatedDeliverable: deliverable.id,
                      ...deliverables,
                      status: 4,
                    }),
                  ),
                );
                if (refetchAllDeliverables) refetchAllDeliverables();
                if (refetchProject) refetchProject();
                setShowModal(false);
              }}
            >
              Mark as Complete
            </Button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
}
