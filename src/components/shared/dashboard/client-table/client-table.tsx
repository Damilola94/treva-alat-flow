import { Pagination } from '../../pagination';
import { EmptyState, BinGray, EditPencilGray } from '../../svgs';
import Image from 'next/image';
import clientManagement from '@/lib/assets/client-management';

interface IProps {
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}
const IS_EMPTY = false;

const thead = [
  { label: 'Client' },
  { label: 'Email address' },
  { label: 'Phone number' },
  { label: 'Birthday' },
  { label: '' }
];

export function ClientTable (props: IProps) {
  const { onEdit, onDelete } = props;
  if (IS_EMPTY) {
    return (
      <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
        <EmptyState />
        <div className="flex flex-col gap-1">
          <p className="app_dashboard_home__task__ctt__title">No task yet</p>
          <p className="app_dashboard_home__task__ctt__desc">
            Click “add new request” button to get started
          </p>
        </div>
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
                  <th key={label} className={'app_table__tr__th'}>
                    <div className="app_table__tr__th__ctt">{label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white app_table__tbody">
              {[0, 1, 2, 3].map((_, index) => {
                return (
                  <tr className="cursor-pointer hover:bg-gray-100" key={index}>
                    <td className="app_table__tbody__td font-medium text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt flex justify-center items-center -ml-5">
                        <Image
                          src={clientManagement?.femaleClient}
                          alt="female"
                          className="w-6 h-6 rounded-full border-2 border-white object-cover mr-3"
                        />
                        Moyin Aakindal
                      </div>
                    </td>
                    <td className="app_table__tbody__td text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt">
                        moyin.aakindal@gmail
                      </div>
                    </td>
                    <td className="app_table__tbody__td">
                      <div className="app_table__tbody__td__ctt">
                        234 081 940 9304
                      </div>
                    </td>
                    <td className="app_table__tbody__td">
                      <div className="app_table__tbody__td__ctt">
                        {'{Month day, year}'}
                      </div>
                    </td>
                    <td className="app_table__tbody__td">
                      <div className="app_table__tbody__td__ctt flex justify-center items-center space-x-4">
                        <div
                          onClick={() => {
                            if (onEdit) {
                              onEdit('id');
                            }
                          }}
                        >
                          <EditPencilGray />
                        </div>
                        <div
                          onClick={() => {
                            if (onDelete) {
                              onDelete('id');
                            }
                          }}
                        >
                          <BinGray />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
