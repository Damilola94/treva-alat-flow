'use client'
import { Badge, type BadgeProps } from '../../../badge'
import { Pagination } from '../../../pagination'
import { EmptyStatus } from '../../../svgs'
import { EmptyState } from '../../../dashboard/empty-state'
import { useRouter } from 'next/navigation'

const statusMap: Record<string, { style: BadgeProps['style'] }> = {
  Completed: { style: 'success' },
  Ongoing: { style: 'pending' },
  Pending: { style: 'danger' }
};

const thead = [
  { label: 'Project name' },
  { label: 'Creative' },
  { label: 'Budget (NGN)' },
  { label: 'Start date', isSortable: true },
  { label: 'Due date', isSortable: true },
  { label: 'Status' }
]

const projects = Array(4).fill({
  id: '1',
  name: '{Project name}',
  creative: '{Creative name}',
  budget: '{Amount}',
  startDate: '{Month day, year}',
  dueDate: '{Month day, year}',
  status: 'Ongoing'
})

function ChevronVIcon () {
  return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10.5893 2.74408C10.433 2.5878 10.221 2.5 10 2.5C9.77899 2.5 9.56703 2.5878 9.41075 2.74408L4.41075 7.74408C4.08531 8.06952 4.08531 8.59715 4.41075 8.92259C4.73619 9.24803 5.26382 9.24803 5.58926 8.92259L10 4.51184L14.4107 8.92259C14.7362 9.24803 15.2638 9.24803 15.5893 8.92259C15.9147 8.59715 15.9147 8.06952 15.5893 7.74408L10.5893 2.74408Z"
                fill="#F6F6F6"
            />
            <path
                d="M10.5893 18.0893C10.433 18.2455 10.221 18.3333 10 18.3333C9.77899 18.3333 9.56703 18.2455 9.41075 18.0893L4.41075 13.0893C4.08531 12.7638 4.08531 12.2362 4.41075 11.9107C4.73619 11.5853 5.26382 11.5853 5.58926 11.9107L10 16.3215L14.4107 11.9107C14.7362 11.5853 15.2638 11.5853 15.5893 11.9107C15.9147 12.2362 15.9147 12.7638 15.5893 13.0893L10.5893 18.0893Z"
                fill="#F6F6F6"
            />
        </svg>
  )
}

export function ProjectsTable () {
  const router = useRouter();

  const handleUserClick = (id: string) => {
    router.push(`/client/dashboard/project-management/${id}`);
  };
    <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
        <EmptyState
            icon={<EmptyStatus />}
            title="No project yet"
            description="Click “add project button to get started"
        />
    </div>

    return (
        <div className="app_dashboard_home__task__ctt">
            <div className="w-full text-left relative rounded-xl overflow-auto">
                <div className="shadow-sm overflow-hidden">
                    <div className="overflow-x-auto whitespace-nowrap">
                        <table className="border-collapse table-auto w-full app_table">
                            <thead>
                                <tr className="app_table__tr">
                                    {thead.map(({ label, isSortable }) => (
                                        <th
                                            key={label}
                                            className={`app_table__tr__th ${isSortable ? 'cursor-pointer' : ''}`}
                                        >
                                            <div className="app_table__tr__th__ctt">
                                                {label}
                                                {isSortable && <ChevronVIcon />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="bg-white app_table__tbody">
                                {projects.map((project, index) => (
                                    <tr key={index} className="app_table__tbody__tr cursor-pointer hover:bg-gray-50"
                                        onClick={() => { handleUserClick(project.id); }}>
                                        <td className="app_table__tbody__td text-[--text-color-500]">
                                            <div className="app_table__tbody__td__ctt">{project.name}</div>
                                        </td>
                                        <td className="app_table__tbody__td">
                                            <div className="app_table__tbody__td__ctt">
                                                {project.creative}
                                            </div>
                                        </td>
                                        <td className="app_table__tbody__td">
                                            <div className="app_table__tbody__td__ctt">
                                                {project.budget}
                                            </div>
                                        </td>
                                        <td className="app_table__tbody__td">
                                            <div className="app_table__tbody__td__ctt">
                                                {project.startDate}
                                            </div>
                                        </td>
                                        <td className="app_table__tbody__td">
                                            <div className="app_table__tbody__td__ctt">
                                                {project.dueDate}
                                            </div>
                                        </td>
                                        <td className="app_table__tbody__td">
                                            <div className="app_table__tbody__td__ctt">
                                                <Badge title={project.status} style={statusMap[project.status]?.style ?? 'Pending'} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white app_table__pagination">
                        <Pagination
                            paginate={{
                              pageCount: 1,
                              currentPage: 1,
                              marginPagesDisplayed: 2,
                              pageRangeDisplayed: 5
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}
