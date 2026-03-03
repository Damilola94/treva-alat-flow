'use client';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CenterModal, PlusIcon, Table } from '@/components/shared';
import routes from '@/lib/routes';
import { useGetProjectByIdQuery } from '@/services';
import { Loader2 } from 'lucide-react';
import {
  useDeliverable,
  usePaymentSchedule,
} from '@/hooks/Projects/useProjects';
import { resetProject } from '@/store/slices/project';
import { useAppDispatch } from '@/store';
import { numberFormat } from '@/lib/numbers';
import Image from 'next/image';
import Success from '@/app/assets/pngs/success.png';


interface IProps {
  projectId: string;
  onChange?: () => void;
  value?: boolean;
}

interface BillingSchedule {
  id?: string;
  amount?: number;
  dueDate?: string;
  status?:
    | 'Pending'
    | 'Due'
    | 'Cancelled'
    | 'Failed'
    | 'Overdue'
    | 'Paid'
    | 'PartiallyPaid'
    | 'Refunded';
  paidAmount?: number;
  remainingAmount?: number;
}

export function ProjectReview(props: IProps) {
  const dispatch = useAppDispatch();
  const { projectId } = props;
  const { data, isLoading } = useGetProjectByIdQuery(projectId);
  const { allPaymentScheduleData, loading } = usePaymentSchedule(projectId);
  const { allDeliverablesData } = useDeliverable(projectId);

  // const [createInvoice] = useCreateInvoiceMutation();

  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });
  const handleCloseModal = () => {
    setIsDecisionModalOpen(false);
    setIsDeleteModal(false);
  };

  const handleSendInvoice = () => {
    // createInvoice({ projectId }).then(() => setIsDeleteModal(true));
    setIsDecisionModalOpen(false);
    setIsDeleteModal(true);
  };

  const handleDone = () => {
    dispatch(resetProject());
    window.location.href = routes.creatives.dashboard.projectManagement.path;
  };

  const headers = [
    {
      header: 'Billing Schedule',
      accessorKey: '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => `Payment ${row.index + 1}`,
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => <span>{numberFormat(row.original.amount)}</span>,
    },
    {
      header: 'Due date',
      accessorKey: 'dueDate',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // cell: ({ row }: any) => <span>{formatDate(row.original.dueDate)}</span>,
    },
  ];

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => <span>{numberFormat(row.original.total)}</span>,
    },
  ];

  const tableBody: BillingSchedule[] = useMemo(() => {
    if (
      allPaymentScheduleData?.isSuccess &&
      Array.isArray(allPaymentScheduleData.data)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return allPaymentScheduleData.data.map((billing: any) => ({
        id: billing.id,
        amount: billing.amount,
        duedate: billing.dueDate,
      }));
    }
    return [];
  }, [allPaymentScheduleData?.isSuccess, allPaymentScheduleData?.data]);

  const tableDeliverableBody = useMemo(() => {
    return allDeliverablesData?.isSuccess && allDeliverablesData.data
      ? allDeliverablesData.data
      : [];
  }, [allDeliverablesData?.isSuccess, allDeliverablesData?.data]);

  if (isLoading) {
    <div className="text-center flex justify-center items-center">
      <Loader2 size={18} className="animate-spin" />
    </div>;
  }

  const project = data;
  const clientName = project?.data?.clientUser?.firstName
    ? `${project?.data?.clientUser.firstName} ${project?.data?.clientUser.lastName}`
    : '';
  const projectName = project?.data?.title;
  const startDate = project?.data?.startDate?.slice(0, 10);
  const endDate = project?.data?.expectedDeliveryDate?.slice(0, 10);

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="app_get_started_professional_details__form flex flex-col gap-10 !max-w-[700px] !mx-auto">
        <CenterModal
        headerImageType={0}
          isOpen={isDecisionModalOpen}
          onClose={handleCloseModal}
          showFooter
          footerChildren={
            <div className="w-full flex items-center gap-5">
              <button
                className="border border-[#F1F1F1] text-[#262626] p-3 rounded-full w-full"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="border p-3 bg-[#262626] rounded-full w-full text-[#fff]"
                onClick={handleSendInvoice}
              >
                Send Invoice
              </button>
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <div className="">
              <Image
                src={Success}
                className="w-[78px]"
                alt="success"
                unoptimized
              />
            </div>
            <p className="font-semibold">
              Are you sure you want to send this invoice
            </p>
            <p className="text-[#888888]">
              Invoice will be sent to client for payment
            </p>
          </div>
        </CenterModal>

        <CenterModal
          isOpen={isDeleteModal}
          onClose={handleCloseModal}
          showFooter
          footerChildren={
            <div className="w-full flex items-center gap-5">
              {false && (
                <button
                  className="w-full flex items-center justify-center text-[#7B37F0]"
                  onClick={handleCloseModal}
                >
                  <PlusIcon fill="#7B37F0" />
                  New invoice
                </button>
              )}
              <button
                className="border p-3 bg-[#7B37F0] rounded-full w-full text-[#fff]"
                onClick={handleDone}
              >
                Done
              </button>
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="">
              <Image
                src={Success}
                className="w-[78px]"
                alt="success"
                unoptimized
              />
            </div>
            <p className="font-semibold flex flex-col items-center justify-center ">
              Invoice has been sent to client successfully
            </p>
            <p className="text-[#888888]">
              Invoice has been sent to make payment.
            </p>
          </div>
        </CenterModal>

        <h1 className="text-xl font-bold">Review</h1>
        <p className="text-[#888888] -mt-8">
          Check and confirm that all the information you&apos;ve added.
        </p>

        <div className="border border-[#E5E5E5] rounded-xl p-4">
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <span className=" text-[#6B7280]">Project name:</span>{' '}
                {projectName}
              </p>
              <p>
                <span className=" text-[#6B7280]">Client name:</span>{' '}
                {clientName}
              </p>
              <p>
                <span className=" text-[#6B7280]">Start date:</span> {startDate}
              </p>
              <p>
                <span className=" text-[#6B7280]">End date:</span> {endDate}
              </p>
            </div>
          </div>

          <div className="w-full text-left relative rounded-xl overflow-auto ">
            <div className="shadow-sm md:overflow-hidden ">
              <div className="shadow-sm overflow">
                {loading ? (
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
              </div>

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
                  />
                )}
              </div>

              <hr className="bg-[#E5E5E5] mt-6" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-6">
          <input
            type="checkbox"
            className="w-5 h-5"
            onChange={(e) => {
              setIsChecked(e.target.checked);
            }}
            checked={isChecked}
          />
          <label htmlFor="terms">
            <p className="text-sm text-[#888888] mt-6">
              This Agreement constitutes the entire agreement among the parties
              and supersedes all prior negotiations, understandings, and
              agreements relating to the subject matter hereof.
            </p>
          </label>
        </div>

        <div className="mt-6 text-right">
          <Button
            size="lg"
            className=" py-3 px-12"
            backgroundColor="primary-blue-500"
            onClick={() => {
              setIsDecisionModalOpen(true);
            }}
            disabled={!isChecked}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
