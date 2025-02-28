import { useEffect, useState } from 'react';
import { Pagination } from '../../pagination';
import { BinGray, EditPencilGray, EmptyStatus } from '../../svgs';
import Image from 'next/image';
import clientManagement from '@/lib/assets/client-management';
import { EmptyState } from '../../dashboard/empty-state';
import queries from '@/services/queries/client-management';
import { Skeleton } from '@/components/ui/skeleton';

interface IProps {
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  search: string
}

const thead = [
  { label: 'Client' },
  { label: 'Email address' },
  { label: 'Phone number' },
  { label: 'Birthday' },
  { label: '' }
];

export function ClientTable (props: IProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 50
  const { data: clientData, refetch, isLoading } = queries.read({
    search: props.search,
    pageNumber: currentPage,
    pageSize
  });

  const { onEdit, onDelete } = props;

  useEffect(() => {
    void refetch()
  }, [clientData, refetch, props.search, currentPage]);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1)
  }

  if (!isLoading && (!clientData?.data || clientData.data.length === 0)) {
    return (
      <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
        <EmptyState
          icon={<EmptyStatus />}
          title="No clients yet"
          description="Click “add new client” button to get started"
        />
      </div>
    );
  }

  return (
    <div className="app_dashboard_home__task__ctt">
      <div className="w-full text-left relative rounded-xl overflow-auto">
        <div className="shadow-sm overflow-hidden">
          <table className="border-collapse table-auto w-full app_table">
            <thead>
              <tr className="app_table__tr">
                {thead.map(({ label }) => (
                  <th key={label} className={'app_table__tr__th '}>
                    <div className="app_table__tr__th__ctt">{label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white app_table__tbody">
              {isLoading
                ? (
                  <>
                    {[...Array(3)].map((_, index) => <Skeleton key={index} columns={4} />)}
                  </>
                  )
                : (
                    clientData?.data?.map((client: any) => (
                    <tr className="cursor-pointer hover:bg-gray-100" key={client.id}>
                      <td className="app_table__tbody__td font-medium text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt flex justify-center items-center -ml-5">
                          <Image
                            src={clientManagement?.femaleClient}
                            alt="client"
                            width={100}
                            height={100}
                            className="w-8 h-8 rounded-full border-2 border-[#E4BACA] object-cover mr-3"
                            unoptimized
                          />
                          {client.fullName}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {client.emailAddress}
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

          {/* <div className="bg-white app_table__pagination">
            <Pagination {...{ paginate: { pageCount: 2 } }} />
          </div> */}
           <div className="bg-white app_table__pagination">
            <Pagination
              paginate={{
                pageCount: clientData?.metaData?.totalPages ?? 1,
                currentPage: currentPage - 1,
                marginPagesDisplayed: 2,
                pageRangeDisplayed: 5
              }}
              handlePageClick={handlePageClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
