import queries from '@/services/queries/projects'
import { Badge, type BadgeProps } from '../../../badge'
import { Pagination } from '../../../pagination'
import { BinGray, EditPencilGray, EmptyStatus } from '../../../svgs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmptyState } from '../../empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface IProps {
  onClick?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  category: string
  search: string
  projectPriority: string
  projectStatus: string
  // limit?: number
}

const statusMap: Record<string, { style: BadgeProps['style'] }> = {
  Completed: { style: 'success' },
  Ongoing: { style: 'pending' },
  Pending: { style: 'danger' }
};

const thead = [
  { label: 'Project name' },
  { label: 'Project Type' },
  { label: 'Due date', isSortable: true },
  { label: 'Priority' },
  { label: 'Status' },
  { label: '' }
]
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

export function ProjectsTable (props: IProps) {
  const { category, onDelete, projectPriority, projectStatus } = props
  // const { onEdit, onDelete } = props;
  const rt = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 50
  const { data, refetch, isLoading } = queries.read({
    projectType: category,
    priority: projectPriority,
    status: projectStatus,
    pageNumber: currentPage,
    pageSize,
    search: props.search
  })
  // const [projects, setProjects] = useState<any[]>([])

  const filteredProjects = data?.data?.filter(project => {
    if (!category) return true;
    return project.projectType === category;
  });
  // const displayedProjects = filteredProjects.slice(0, 10);
  // const displayedProjects = filteredProjects ? filteredProjects.slice(0, 10) : [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    void refetch();
  }, [projectPriority, projectStatus, category, currentPage, refetch]);

  const handleRowSelect = (value: string) => {
    rt.push(`/dashboard/project-management/${value}`)
  }

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1)
  }

  if (!isLoading && (!data || data?.data?.length === 0)) {
    return (
      <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
        <EmptyState
          icon={<EmptyStatus />}
          title="No project yet"
          description="Click “add project button to get started"
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
                {thead.map(({ label, isSortable }) => (
                  <th
                    key={label}
                    className={`app_table__tr__th ${isSortable ? 'cursor-pointer' : ''
                      }`}
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
              {isLoading
                ? (
                  <>
                    {[...Array(3)].map((_, index) => <Skeleton key={index} columns={4} />)}
                  </>
                  )
                : (
                    filteredProjects?.map((project, index) => (
                    <tr
                      // onClick={() => { handleRowSelect(project.id); }}
                      className="cursor-pointer hover:bg-gray-100"
                      key={index}
                    >
                      <td className="app_table__tbody__td font-medium text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {project.title}
                        </div>
                      </td>
                      <td className="app_table__tbody__td text-[--text-color-500]">
                        <div className="app_table__tbody__td__ctt">
                          {project.projectType}
                        </div>
                      </td>
                      <td className="app_table__tbody__td">
                        <div className="app_table__tbody__td__ctt">
                          {new Date(project.expectedDeliveryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="app_table__tbody__td">
                        <div className={`app_table__priority app_table__priority--${project.priority || 'Low'}`}>
                          <span className="app_table__priority__dot"></span>
                          {(project.priority) || 'Low'}
                        </div>
                      </td>
                      <td className="app_table__tbody__td">
                        <div className="app_table__tbody__td__ctt">
                          <Badge title={project.status} style={statusMap[project.status]?.style ?? 'Pending'} />
                        </div>
                      </td>
                      <td className="app_table__tbody__td">
                        <div className="app_table__tbody__td__ctt flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => { handleRowSelect(project.id); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => onDelete?.(project.id)}>
                                <BinGray className="h-4 w-4" />
                              </Button>
                          {project.projectType === 'PersonalProject' && (
                            <>
                              <Link href={`/dashboard/project-management/personal-project/${project.id}/edit`}>
                                <Button variant="outline" size="icon">
                                  <EditPencilGray className="h-4 w-4" />
                                </Button>
                              </Link>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                    ))
                  )}
            </tbody>

          </table>

          <div className="bg-white app_table__pagination">
            <Pagination
              paginate={{
                pageCount: data?.metaData?.totalPages ?? 1,
                currentPage: currentPage - 1,
                marginPagesDisplayed: 2,
                pageRangeDisplayed: 5
              }}
              handlePageClick={handlePageClick}
            />
          </div>
             {/* <div className="bg-white app_table__pagination">
            <Pagination {...{ paginate: { pageCount: 2 } }} />
          </div> */}
        </div>
      </div>
    </div>
  )
}
