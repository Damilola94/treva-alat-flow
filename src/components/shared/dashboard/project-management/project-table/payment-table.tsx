import queries from '@/services/queries/projects';
import { EmptyStatus, PlusIcon } from '../../../svgs';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Badge, type BadgeProps } from '@/components/shared/badge';

const thead = [
  { label: 'Payment schedule' },
  { label: '%' },
  { label: 'Amount (NGN)' },
  { label: 'Due date' },
  { label: 'Reminder frequency' },
  { label: 'Status' }
];

const statusMap: Record<string, { style: BadgeProps['style'] }> = {
  Paid: { style: 'success' },
  Due: { style: 'danger' },
  Pending: { style: 'pending' }
};

export function PaymentTable () {
  const param = useParams();
  const projectId = Array.isArray(param.id) ? param.id[0] : param.id;
  const { data, isLoading } = queries.readPayment({ projectId });

  if (data.length === 0) {
    return (
      <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
        <EmptyStatus />
        <div className="flex flex-col gap-1">
          <p className="app_dashboard_home__task__ctt__title">No Payment schedule yet</p>
          {projectId &&
            <Link href={`/dashboard/project-management/client-project/create?projectId=${projectId}`}>
              <p className="app_dashboard_home__task__ctt__desc !text-[#7D6CE8]">
                <div className='flex gap-1 justify-center items-center'>
                  <PlusIcon fill='#7D6CE8' />
                  Complete project creation process
                </div>
              </p>
            </Link>
          }
        </div>
      </div>
    );
  }

  return (
    <div className="app_dashboard_home__task__cct">
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
              {isLoading
                ? (
                  <>
                    {[...Array(3)].map((_, index) => <Skeleton key={index} columns={4} />)}
                  </>
                  )
                : (
                    data?.map((item: any, index: number) => (
                    <tr key={item.id} className="">
                      <td className="app_table__tbody__td font-medium text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt font-semibold">
                          Payment {index + 1}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {item.amountPercentage}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {item.amount}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {formatDate(item.dueDate)}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {item.reminderFrequency}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {/* {item.status} */}
                          <Badge title={item.status} style={statusMap[item.status]?.style ?? 'Pending'} />

                        </div>
                      </td>
                    </tr>
                    ))
                  )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
