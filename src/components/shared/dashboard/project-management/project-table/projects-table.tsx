import queries from '@/services/queries/projects'
import { Badge, type BadgeProps } from '../../../badge'
import { Pagination } from '../../../pagination'
import { BinGray, EditPencilGray, EmptyStatus } from '../../../svgs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { useEffect } from 'react'
import { EmptyState } from '../../empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { ProjectType } from '@/services/queries/projects/enums'
import Image from 'next/image'

interface IProps {
  onClick?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  category: string

}

const statusMap: Record<
number,
{ title: string, status: BadgeProps['status'] }
> = {
  0: { status: 'success', title: 'Completed' },
  1: { status: 'pending', title: 'Pending' },
  2: { status: 'danger', title: 'Due' },
  3: { status: 'success', title: 'Completed' }
}

const thead = [
  { label: 'Project name' },
  { label: 'Client' },
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
  const { category } = props
  const rt = useRouter()
  const { data, refetch, isLoading } = queries.read({ projectType: category })
  const filteredProjects = data?.filter(project => {
    if (!category) return true;
    return project.projectType === category;
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onEdit, onDelete } = props;

  useEffect(() => {
    void refetch()
  }, [data, refetch]);

  const handleRowSelect = (value: string) => {
    rt.push(`/dashboard/project-management/${value}`)
  }

  if (!isLoading && (!data || data.length === 0)) {
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
                          {project.projectType === ProjectType.ClientProject
                            ? (
                            <div className="flex items-center gap-2">
                              <Image src={project.imageUrl} alt={project.fullName} className="w-8 h-8 rounded-full" />
                              <span>{project.fullName}</span>
                            </div>
                              )
                            : (
                                project.description
                              )
                        }
                        </div>
                      </td>
                      <td className="app_table__tbody__td">
                        <div className="app_table__tbody__td__ctt">
                          {new Date(project.expectedDeliveryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="app_table__tbody__td">
                        <div className={`app_table__priority app_table__priority--${['low', 'medium', 'high'][Number(project.priority)] || 'low'}`}>
                          <span className="app_table__priority__dot"></span>
                          {(project.priority) || 'Low'}
                        </div>
                      </td>
                      <td className="app_table__tbody__td">
                        <div className="app_table__tbody__td__ctt">
                          <Badge {...statusMap[Number(1)]} />
                        </div>
                      </td>
                      {/* <td className="app_table__tbody__td">
                        <div className="app_table__tbody__td__ctt">

                        </div>
                      </td> */}
                      <td className="app_table__tbody__td">
                        <div className="app_table__tbody__td__ctt flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => { handleRowSelect(project.id); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {project.projectType === 'PersonalProject' && (
                            <>
                              <Link href={`/dashboard/project-management/personal-project/${project.id}/edit`}>
                                <Button variant="outline" size="icon">
                                  <EditPencilGray className="h-4 w-4" />
                                </Button>
                              </Link><Button variant="outline" size="icon" onClick={() => onDelete?.(project.id)}>
                                <BinGray className="h-4 w-4" />
                              </Button>
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
            <Pagination {...{ paginate: { pageCount: 1 } }} />
          </div>
        </div>
      </div>
    </div>
  )
}
