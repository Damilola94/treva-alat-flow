import queries from '@/services/queries/projects';
import { EmptyStatus } from '../../../svgs';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

const thead = [
  { label: 'Deliverable name' },
  { label: 'Description' },
  { label: 'Start date' },
  { label: 'Due date' },
  { label: 'Amount' }
];

export function DeliverableTable () {
  const param = useParams();
  const projectId = Array.isArray(param.id) ? param.id[0] : param.id;
  const { data, isLoading } = queries.readDeliverables({ projectId });

  if (data.length === 0) {
    return (
        <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
          <EmptyStatus />
          <div className="flex flex-col gap-1">
            <p className="app_dashboard_home__task__ctt__title">No deliverables yet</p>
            <p className="app_dashboard_home__task__ctt__desc">
              Click &quot;add new deliverables&quot; button to get started
            </p>
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
                      data?.map((item: any) => (
                    <tr key={item.id} className="">
                      <td className="app_table__tbody__td font-medium text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt font-semibold">
                          {item.deliverableName}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {item.deliverableDescription}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                        {formatDate(item.startDate)}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                        {formatDate(item.dueDate)}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {item.deliverableAmount}
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
