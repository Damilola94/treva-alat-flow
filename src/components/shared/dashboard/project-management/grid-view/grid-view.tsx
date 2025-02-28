import React, { useEffect, useState } from 'react';
import { FlagOutline, CalendarWithMark, Calendar } from '@/components/shared';
import { useParams } from 'next/navigation';
import queries from '@/services/queries/projects';
import { formatDate } from '@/lib/utils';

// const TaskCard = () => (
//   <div className="task-card">
//     <h4 className="task-card__title">{'{Task name}'}</h4>
//     <ul className="task-card__options">
//       <li className="flex ">
//         <input type="checkbox" id="complete" />
//         <label htmlFor="complete">Mark as complete</label>
//       </li>
//       <li className="flex gap-2">
//         <CalendarWithMark />
//         Add date
//       </li>
//       <li className="flex gap-2">
//         <FlagOutline />
//         Add priority
//       </li>
//     </ul>
//   </div>
// );

interface Task {
  taskId: string
  taskName: string
  dueDate: string
  startDate: string
  taskPriority: string
  priorityColor: string
  taskStatus: number
}

export function TaskGirdView () {
  const param = useParams()
  const projectId = Array.isArray(param.id) ? param.id[0] : param.id
  const { data, isLoading } = queries.readTasks({ projectId })
  const [tasks, setTasks] = useState<Task[]>([])

  const todoTasks = tasks.filter((task: Task) => task.taskStatus === 1)
  const completedTasks = tasks.filter((task: Task) => task.taskStatus === 2)

  useEffect(() => {
    if (data) {
      setTasks(data)
    }
  }, [data])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="task-board">
      <div className="task-section task-section--todo">
        <div className="task-section__header">
          <div className="project_action_group__todo">
            To do <span className="font-bold">{todoTasks.length}</span>
          </div>
        </div>
        {data.map((item: Task) => (
        <div key={item.taskId} className = "task-section__content">
          <div className="task-card">
            <h4 className="task-card__title">{item.taskName}</h4>
            <ul className="task-card__options">
              <li className="flex ">
                <input type="checkbox" id="complete" />
                <label htmlFor="complete">Mark as complete</label>
              </li>
              <li className="flex gap-2">
                <Calendar />
                Start date:
                <div className="project_action_group__button">{formatDate(item.startDate)}</div>
              </li>
              <li className="flex gap-2">
                <CalendarWithMark />
                Due date:
                <div className="project_action_group__button">{formatDate(item.dueDate)}</div>

              </li>
              <li className="flex gap-2">
                <FlagOutline />
                Priority:
                <div className={`app_table__priority app_table__priority--${['low', 'medium', 'high'][Number(item.taskPriority)] || 'low'}`}>
                  <span className="app_table__priority__dot"></span>
                  {(item.taskPriority) || 'Low'}
                </div>
              </li>
            </ul>
          </div>
          {/* <TaskCard />
          <TaskCard />
          <TaskCard /> */}
          {/* <div
            onClick={() => {}}
            className="flex mt-5 items-center cursor-pointer text-shark-950 gap-1"
          >
            <PlusIcon fill="#6D6D6D" />
            Add task
          </div> */}
        </div>

        ))}
      </div>

      <div className="task-section task-section--completed">
        <div className="task-section__header">
          <div className="bg-green-800 project_action_group__completed ">
            Completed <span className="font-bold">{completedTasks.length}</span>
          </div>
        </div>
        <div className="task-section__content">
          {/* <TaskCard /> */}
          {/* <div
            onClick={() => {}}
            className="flex mt-5 items-center cursor-pointer text-shark-950 gap-1"
          >
            <PlusIcon fill="#6D6D6D" />
            Add task
          </div> */}
        </div>
      </div>
    </div>
  );
}
