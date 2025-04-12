'use client'

import { EmptyStatus } from '../../../svgs'
import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useParams } from 'next/navigation'
import queries from '@/services/queries/projects'
import { formatDate } from '@/lib/utils'
import { TaskGirdView } from '../grid-view/grid-view'
import { ProjectStatus } from '@/services/queries/projects/enums'

interface TaskTableProps {
  viewType?: string
  projectId?: string
  taskId?: string
}

interface Task {
  id: string
  projectId: string
  taskName: string
  dueDate: string
  startDate: string
  taskPriority: string
  priorityColor: string
  taskStatus: string
}

const thead = [
  { label: 'Name' },
  { label: 'Start date' },
  { label: 'Due date' },
  { label: 'Priority' },
  { label: 'Status' }
]

export function TaskTable ({ viewType, taskId }: TaskTableProps) {
  const param = useParams()
  const projectId = Array.isArray(param.id) ? param.id[0] : param.id
  const { data } = queries.readTasks({ projectId })
  const { mutate } = queries.updateTasks({ taskId, projectId },
    {
      onSuccess: () => {
      }
    }
  )

  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<'todo' | 'completed'>('todo')

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      mutate({
        taskId,
        projectId,
        taskName: task.taskName,
        startDate: task.startDate,
        dueDate: task.dueDate,
        taskPriority: task.taskPriority,
        taskStatus: newStatus
      });
    }
  };

  useEffect(() => {
    if (data) {
      setTasks(data.data || [])
    }
  }, [data])

  useEffect(() => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskStatus === ProjectStatus.Completed ? { ...task, taskStatus: ProjectStatus.Completed } : task
      )
    );
  }, [tasks]);

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

  const todoTasks = tasks.filter((task: Task) => task.taskStatus === ProjectStatus.ToDo)
  const completedTasks = tasks.filter((task: Task) => task.taskStatus === ProjectStatus.Completed)

  return (
    <div className="app_dashboard_home__task__cct">
      <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as 'todo' | 'completed'); }} className="w-full">
        {viewType === 'table' && (
          <TabsList className="mb-4 gap-3">
            <TabsTrigger
              value="todo"
              className='flex gap-2 rounded-full border-none'
              style={{
                backgroundColor: activeTab === 'todo' ? '#26A17B' : 'white',
                color: activeTab === 'todo' ? 'white' : 'black'
              }}
            >
              To do
              <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm text-black">
                {todoTasks.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className='flex gap-2 rounded-full border-none'
              style={{
                backgroundColor: activeTab === 'completed' ? '#26A17B' : 'white',
                color: activeTab === 'completed' ? 'white' : 'black'
              }}
            >
              Completed
              <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm text-black">
                {completedTasks.length}
              </span>
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="todo">
          {viewType === 'table' ? <TaskList tasks={todoTasks} updateTaskStatus={updateTaskStatus} /> : <TaskGirdView />}
        </TabsContent>

        <TabsContent value="completed">
          {viewType === 'table'
            ? (
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
  updateTaskStatus: (taskId: string, newStatus: string) => void
}

function TaskList ({ tasks, updateTaskStatus }: TaskListProps) {
  return (
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
            {tasks.length === 0
              ? (
                <tr>
                  <td colSpan={5} className="app_table__tbody__td text-center py-8">
                    No tasks in this category
                  </td>
                </tr>
                )
              : (
                  tasks.map((item: Task) => (
                  <tr key={item.id} className="border-t border-gray-100">
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
                      <div className={`app_table__priority app_table__priority--${item.taskPriority || 'Low'}`}>
                        <span className="app_table__priority__dot"></span>
                        {item.taskPriority || 'Low'}
                      </div>
                    </td>
                    <td className="app_table__tbody__td">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={item.taskStatus === ProjectStatus.Completed}
                          onChange={() => {
                            updateTaskStatus(
                              item.id,
                              item.taskStatus === ProjectStatus.ToDo ? ProjectStatus.Completed : ProjectStatus.ToDo
                            )
                          }}

                          className="w-5 h-5 accent-green-500 cursor-pointer"
                        />
                        <label>Mark as {item.taskStatus === ProjectStatus.Completed ? 'incomplete' : 'complete'}</label>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
