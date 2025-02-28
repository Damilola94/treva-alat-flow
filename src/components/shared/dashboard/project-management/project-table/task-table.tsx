'use client'

import { EmptyStatus } from '../../../svgs'
import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useParams } from 'next/navigation'
import queries from '@/services/queries/projects'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { TaskGirdView } from '../grid-view/grid-view'

interface TaskTableProps {
  viewType: string
}

interface Task {
  taskId: string
  taskName: string
  dueDate: string
  startDate: string
  taskPriority: string
  priorityColor: string
  taskStatus: number
}

const thead = [
  { label: 'Name' },
  { label: 'Start date' },
  { label: 'Due date' },
  { label: 'Priority' },
  { label: 'Status' }
]

export function TaskTable ({ viewType }: TaskTableProps) {
  const param = useParams()
  const projectId = Array.isArray(param.id) ? param.id[0] : param.id
  const { data } = queries.readTasks({ projectId })
  const [tasks, setTasks] = useState<Task[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<'todo' | 'completed'>('todo')

  useEffect(() => {
    if (data) {
      setTasks(data)
    }
  }, [data])

  const updateTaskStatus = async (taskId: string, newStatus: number) => {
    const updatedTasks = tasks.map((task) => (task.taskId === taskId ? { ...task, taskStatus: newStatus } : task))
    setTasks(updatedTasks)
  }

  if (tasks.length === 0) {
    return (
      <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
        <EmptyStatus />
        <div className="flex flex-col gap-1">
          <p className="app_dashboard_home__task__ctt__title">No task yet</p>
          <p className="app_dashboard_home__task__ctt__desc">Click &quot;add new request&quot; button to get started</p>
        </div>
      </div>
    )
  }

  const todoTasks = tasks.filter((task: Task) => task.taskStatus === 1)
  const completedTasks = tasks.filter((task: Task) => task.taskStatus === 2)

  return (
    <div className="app_dashboard_home__task__cct">
      <Tabs defaultValue="todo" className="w-full">
        {viewType === 'table' &&
        <TabsList className="mb-4 gap-3">
          <TabsTrigger
            value="todo"
            onClick={() => { setActiveTab('todo'); }}
            className="flex gap-2 rounded-full border-none bg-white"
          >
            To do
            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm">
              {todoTasks.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            onClick={() => { setActiveTab('completed'); }}
            className="flex gap-2 rounded-full bg-[#26A17B] text-white"
          >
            Completed
            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm text-black">
              {completedTasks.length}
            </span>
          </TabsTrigger>
        </TabsList>
}

        <TabsContent value="todo">
          {viewType === 'table'
            ? (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <TaskList tasks={todoTasks} updateTaskStatus={updateTaskStatus} />
              )
            : (
            <TaskGirdView />
              )}
        </TabsContent>

        <TabsContent value="completed">
          {viewType === 'table'
            ? (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <TaskList tasks={completedTasks} updateTaskStatus={updateTaskStatus} />
              )
            : (
            <TaskGirdView />
              )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TaskListProps {
  tasks: Task[]
  updateTaskStatus: (taskId: string, newStatus: number) => void
}

function TaskList ({ tasks, updateTaskStatus }: TaskListProps) {
  const param = useParams()
  const projectId = Array.isArray(param.id) ? param.id[0] : param.id
  const { data, isLoading } = queries.readTasks({ projectId })

  return (
    <><div className="w-full text-left relative rounded-xl overflow-auto">
      <div className="shadow-sm overflow-hidden">
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
                  data.map((item: Task) => (
                  <tr key={item.taskId} className="border-t border-gray-100">
                    <td className="app_table__tbody__td font-medium text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt font-semibold">{item.taskName}</div>
                    </td>
                    <td className="app_table__tbody__td text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt">{formatDate(item.startDate)}</div>
                    </td>
                    <td className="app_table__tbody__td text-[--text-color-500]">
                      <div className="app_table__tbody__td__ctt">{formatDate(item.dueDate)}</div>
                    </td>
                    <td className="app_table__tbody__td text">
                      <div className={`app_table__priority app_table__priority--${['low', 'medium', 'high'][Number(item.taskPriority)] || 'low'}`}>
                        <span className="app_table__priority__dot"></span>
                        {(item.taskPriority) || 'Low'}
                      </div>
                    </td>
                    <td className="app_table__tbody__td">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={item.taskStatus === 2}
                          onChange={() => { updateTaskStatus(item.taskId, item.taskStatus === 1 ? 2 : 1) } }
                          className="w-5 h-5 accent-green-500 cursor-pointer" />
                        <label>{item.taskStatus === 1 ? 'Mark as Complete' : 'Mark as Incomplete'}</label>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}
