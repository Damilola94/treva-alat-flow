import { Pagination } from '../../pagination';
<<<<<<< HEAD
import { BinGray, EditPencilGray, EmptyStatus } from '../../svgs';
import Image from 'next/image';
import clientManagement from '@/lib/assets/client-management';
import { EmptyState } from '../empty-state';
import queries from '@/services/queries/client-management';
import { Skeleton } from '@/components/ui/skeleton';
=======
import { EmptyState, BinGray, EditPencilGray } from '../../svgs';
import Image from 'next/image';
import clientManagement from '@/lib/assets/client-management';
>>>>>>> origin/dev

interface IProps {
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

// const IS_EMPTY = false;

const thead = [
  { label: 'Client' },
  { label: 'Email address' },
  { label: 'Phone number' },
  { label: 'Birthday' },
  { label: '' }
];

export function ClientTable (props: IProps) {
  const { data: clients, isLoading } = queries.read();
  console.log(clients, 'Table data');

  const { onEdit, onDelete } = props;

  // Handling empty state if no data
  // if (!clients?.data?.length) {
  //   return (
  //     <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
  //       <EmptyState
  //         icon={<EmptyStatus />}
  //         title="No task yet"
  //         description="Click “add new request” button to get started"
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="app_dashboard_home__task__ctt">
      <div className="w-full text-left relative rounded-xl overflow-auto">
        <div className="shadow-sm overflow-hidden">
          <table className="border-collapse table-auto w-full app_table">
            <thead>
              <tr className="app_table__tr">
                {thead.map(({ label }) => (
                  <th key={label} className={'app_table__tr__th'}>
                    <div className="app_table__tr__th__ctt">{label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white app_table__tbody">
              {/* Rendering rows dynamically from fetched data */}
              {isLoading
                ? (
                <>
                  <Skeleton />
                  <Skeleton />
                </>
                  )
                : (
                    clients?.data?.map((client: any) => (
                  <tr className="cursor-pointer hover:bg-gray-100" key={client.id}>
                    <td className="app_table__tbody__td font-medium text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt flex justify-center items-center -ml-5">
                        <Image
                          src={client?.avatarUrl || clientManagement?.femaleClient}
                          alt="client"
                          className="w-6 h-6 rounded-full border-2 border-white object-cover mr-3"
                        />
                        {client.firstName} {client.lastName}
                      </div>
                    </td>
                    <td className="app_table__tbody__td text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt">
                        {client.email}
                      </div>
                    </td>
                    <td className="app_table__tbody__td">
                      <div className="app_table__tbody__td__ctt">
                        {client.phoneNumber}
                      </div>
                    </td>
                    <td className="app_table__tbody__td">
                      <div className="app_table__tbody__td__ctt">
                        {new Date(client.birthday).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="app_table__tbody__td">
                      <div className="app_table__tbody__td__ctt flex justify-center items-center space-x-4">
                        <div
                          onClick={() => {
                            if (onEdit) {
                              onEdit(client.id);
                            }
                          }}
                        >
                          <EditPencilGray />
                        </div>
                        <div
                          onClick={() => {
                            if (onDelete) {
                              onDelete(client.id);
                            }
                          }}
                        >
                          <BinGray />
                        </div>
                      </div>
                    </td>
                  </tr>
                    ))
                  )}
            </tbody>
          </table>

          <div className="bg-white app_table__pagination">
            <Pagination {...{ paginate: { pageCount: 2 } }} />
          </div>
        </div>
      </div>
    </div>
  );
}
