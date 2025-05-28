import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Label } from '@/components/shared/Label';
import { useMemo, useState } from 'react';
import {
  useDeliverable,
  usePaymentSchedule,
} from '@/hooks/Projects/useProjects';
import { Loader2 } from 'lucide-react';
import { Table } from '@/components/shared/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyStatus, PlusIcon } from '@/components/shared/svgs';
import Link from 'next/link';

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
interface Payments {
  id?: string;
  description?: string;
  unitAmount?: number;
  unit?: string;
  total?: number;
}

export function PaymentTable() {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;

  const { allPaymentScheduleData, loading } = usePaymentSchedule(projectId);
  const { allDeliverablesData } = useDeliverable(projectId);

  const [activeTab, setActiveTab] = useState<'billingSchedule' | 'payment'>(
    'billingSchedule',
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const billingHeaders = [
    {
      header: 'Billing Schedule',
      accessorKey: '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => `Payment ${row.index + 1}`,
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
    },
    {
      header: 'Due date',
      accessorKey: 'dueDate',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const date = row.original.dueDate;
        return formatDate(date);
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const value = row.original.status;
        return (
          <div className="">
            <Label type="status" value={value} showIcon />
          </div>
        );
      },
    },
  ];

  const paymentHeaders = [
    {
      header: 'Item',
      accessorKey: 'description',
    },
    {
      header: 'Unit Price',
      accessorKey: 'unitPrice',
    },
    {
      header: 'Unit',
      accessorKey: 'unit',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
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
        dueDate: billing.dueDate,
      }));
    }
    return [];
  }, [allPaymentScheduleData?.isSuccess, allPaymentScheduleData?.data]);

  const tableBodyPayment: Payments[] = useMemo(() => {
    if (
      allDeliverablesData?.isSuccess &&
      Array.isArray(allDeliverablesData.data)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return allDeliverablesData.data.map((payment: any) => ({
        id: payment.id,
        description: payment.description,
        unitPrice: payment.unitAmount,
        unit: payment.unit,
        amount: payment.total,
      }));
    }
    return [];
  }, [allDeliverablesData?.isSuccess, allDeliverablesData?.data]);

  if (tableBody.length === 0) {
    return (
      <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
        <EmptyStatus />
        <div className="flex flex-col gap-1">
          <p className="app_dashboard_home__task__ctt__title">
            No billing schedule yet
          </p>
          {projectId && (
            <Link
              href={`/dashboard/project-management/client-project/create?projectId=${projectId}`}
            >
              <p className="app_dashboard_home__task__ctt__desc !text-[#7D6CE8]">
                <div className="flex gap-1 justify-center items-center">
                  <PlusIcon fill="#7D6CE8" />
                  Complete project creation process
                </div>
              </p>
            </Link>
          )}
        </div>
      </div>
    );
  }

// eslint-disable-next-line react-hooks/rules-of-hooks
const latestDueDate = useMemo(() => {
  if (
    allPaymentScheduleData?.isSuccess &&
    Array.isArray(allPaymentScheduleData.data)
  ) {
    const sorted = [...allPaymentScheduleData.data].sort(
      (a, b) =>
        new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );
    return sorted[0]?.dueDate ?? null;
  }
  return null;
}, [allPaymentScheduleData]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { totalPaid, totalRemaining } = useMemo(() => {
    if (
      allPaymentScheduleData?.isSuccess &&
      Array.isArray(allPaymentScheduleData.data)
    ) {
      const totalPaid = allPaymentScheduleData.data.reduce(
        (sum, item) => sum + (item.paidAmount ?? 0),
        0,
      );
      const totalRemaining = allPaymentScheduleData.data.reduce(
        (sum, item) => sum + (item.remainingAmount ?? 0),
        0,
      );
      return { totalPaid, totalRemaining };
    }
    return { totalPaid: 0, totalRemaining: 0 };
  }, [allPaymentScheduleData]);

  const totalAmount = totalPaid + totalRemaining;

  return (
    <div className="app_dashboard_home__task__cct">
      <div className="w-full text-left relative rounded-xl overflow-auto">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as 'billingSchedule' | 'payment');
          }}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList className="gap-3">
              <TabsTrigger
                value="billingSchedule"
                className="flex gap-2 rounded-full border-none"
                style={{
                  backgroundColor:
                    activeTab === 'billingSchedule' ? '#26A17B' : 'white',
                  color: activeTab === 'billingSchedule' ? 'white' : 'black',
                }}
              >
                Billing Schedule
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="flex gap-2 rounded-full border-none"
                style={{
                  backgroundColor:
                    activeTab === 'payment' ? '#26A17B' : 'white',
                  color: activeTab === 'payment' ? 'white' : 'black',
                }}
              >
                Payment
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="billingSchedule" className="mt-4">
            {' '}
            <div className="shadow-sm overflow">
              {loading ? (
                <div className="text-center flex justify-center items-center">
                  <Loader2 size={18} className="animate-spin" />
                </div>
              ) : (
                <div>
                  <Table<BillingSchedule>
                    columns={billingHeaders}
                    data={tableBody}
                    pagination={pagination}
                    setPagination={setPagination}
                  />
                  <div className="font-bold flex flex-col gap-5">
                    <p className="flex justify-between items-center">
                      Amount Paid <span>₦{totalPaid.toLocaleString()}</span>
                    </p>
                    <p className="flex justify-between items-center mb-5">
                      Amount Left{' '}
                      <span>₦{totalRemaining.toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="border-[#E7E7E7] border-t flex flex-col gap-5">
                    <p className="flex justify-between items-center mt-5">
                      Total payment due date{' '}
                      <span>
                        {latestDueDate ? formatDate(latestDueDate) : '—'}
                      </span>
                    </p>
                    <p className="flex justify-between items-center font-bold border-none">
                      Total{' '}
                      <span className="font-bold">
                        ₦{totalAmount.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-4">
            <div className="shadow-sm overflow">
              {loading ? (
                <div className="text-center flex justify-center items-center">
                  <Loader2 size={18} className="animate-spin" />
                </div>
              ) : (
                <Table<Payments>
                  columns={paymentHeaders}
                  emptyTitle="No billing schedule Yet"
                  emptyMessage="+ complete billing process"
                  data={tableBodyPayment}
                  pagination={pagination}
                  setPagination={setPagination}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
