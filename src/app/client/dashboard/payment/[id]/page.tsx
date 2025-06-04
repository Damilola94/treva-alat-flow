'use client';
import { CenterModal, Table } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useInvoicesById } from '@/hooks/Projects/useProjects';
import routes from '@/lib/routes';
import { errorToast, successToast, useCreateInvoiceMutation } from '@/services';
import { getErrorMessage } from '@/utils';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function Page() {
  const { id } = useParams();
  const invoiceId = Array.isArray(id) ? id[0] : id;

  const [togglepayInvoice, setTogglePayInvoice] = useState(false);

  const { allInvoicesByIdData, loading } = useInvoicesById(invoiceId);
  const [payInvoice, { isLoading }] = useCreateInvoiceMutation();

  const handlePayInvoice = async () => {
    try {
      const response = await payInvoice(invoiceId).unwrap();
      if (response?.isSuccess) {
        successToast(response?.message || 'Invoice paid');
        setTogglePayInvoice(true);
      } else {
        errorToast(response?.message || 'Something went erong');
        setTogglePayInvoice(true);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  const handleleDone = () => {
    setTogglePayInvoice(false);
    window.location.href = routes.client.dashboard.payment.path;
  };

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

  const tableBody = useMemo(() => {
    if (
      allInvoicesByIdData?.isSuccess &&
      allInvoicesByIdData.data?.paymentSchedule?.project?.deliverables
    ) {
      return allInvoicesByIdData.data.paymentSchedule.project.deliverables;
    }
    return [];
  }, [allInvoicesByIdData]);

  const invoice = allInvoicesByIdData?.data;

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <CenterModal
        headerImageType={4}
        isOpen={togglepayInvoice}
        onClose={() => {
          setTogglePayInvoice(false);
        }}
        showFooter
        footerChildren={
          <div className="flex justify-end items-center">
            <Button
              backgroundColor="treva-purple"
              color="white"
              size="xl"
              className=""
              isLoading={isLoading}
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onClick={() => {
                handleleDone();
              }}
            >
              Done
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-semibold">Payment has been made successfully</h2>
        </div>
      </CenterModal>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !max-w-[700px] !mx-auto">
        <div className="border border-[#E5E5E5] rounded-xl p-4">
          <div className="mb-6">
            {invoice && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <span className=" text-[#6B7280]">Project name:</span>{' '}
                  {invoice?.paymentSchedule?.project?.title}
                </p>
                <p>
                  <span className=" text-[#6B7280]">Client name:</span>{' '}
                  {invoice?.clientUser?.firstName}{' '}
                  {invoice?.clientUser?.lastName}
                </p>
                <p>
                  <span className=" text-[#6B7280]">Start date:</span>{' '}
                  {invoice?.paymentSchedule?.project?.deliverables?.[0]?.startDate?.slice(
                    0,
                    10,
                  )}
                </p>
                <p>
                  <span className=" text-[#6B7280]">End date:</span>{' '}
                  {invoice?.paymentSchedule?.project?.deliverables?.[0]?.endDate?.slice(
                    0,
                    10,
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="w-full text-left relative rounded-xl overflow-auto ">
            <div className="shadow-sm md:overflow-hidden ">
              {loading ? (
                <div className="text-center flex justify-center items-center">
                  <Loader2 size={18} className="animate-spin" />
                </div>
              ) : (
                <Table
                  columns={deliverableHeaders}
                  emptyTitle="No deliverable Yet"
                  emptyMessage="You'll see all your deliverable here"
                  data={tableBody}
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
                {/* <span>{deliverableSubtotal.toLocaleString()}</span> */}
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
        {allInvoicesByIdData?.data?.status !== 'Closed' && (
          <div className="mt-6 text-right">
            <Button
              size="lg"
              className=" py-3 px-12"
              backgroundColor="primary-blue-500"
              onClick={() => handlePayInvoice()}
              isLoading={isLoading}
            >
              Pay Balance Due
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
