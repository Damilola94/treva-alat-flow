import React, { useEffect, useState } from 'react';
import { FlagOutline, CalendarWithMark, Calendar } from '@/components/shared';
import { useParams } from 'next/navigation';
import queries from '@/services/queries/projects';
import { formatDate } from '@/lib/utils';
import { ProjectStatus } from '@/services/queries/projects/enums';

interface IProps {
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

export function TaskGirdView ({ taskId }: IProps) {
  const param = useParams()
  const projectId = Array.isArray(param.id) ? param.id[0] : param.id
  const { data, isLoading } = queries.readTasks({ projectId })
  const { mutate } = queries.updateTasks({ taskId, projectId },
    {
      onSuccess: () => {
        console.log('Completed');
      }
    }
  )
  const [tasks, setTasks] = useState<Task[]>([])

  const todoTasks = tasks.filter((task: Task) => task.taskStatus === ProjectStatus.ToDo)
  const completedTasks = tasks.filter((task: Task) => task.taskStatus === ProjectStatus.Completed)

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
      setTasks(data)
    }
  }, [data])

  useEffect(() => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskStatus === ProjectStatus.Completed ? { ...task, taskStatus: ProjectStatus.Completed } : task
      )
    );
  }, [tasks]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="task-board">
      {/* To Do Section */}
      <div className="task-section task-section--todo">
        <div className="task-section__header">
          <div className="project_action_group__todo">
            To do <span className="font-bold">{todoTasks.length}</span>
          </div>
        </div>
        {todoTasks.map((item: Task) => (
          <div key={item.id} className="task-section__content">
            <div className="task-card">
              <h4 className="task-card__title">{item.taskName}</h4>
              <ul className="task-card__options">
                <li className="flex">
                  <input
                    type="checkbox"
                    checked={item.taskStatus === ProjectStatus.Completed}
                    onChange={() => {
                      updateTaskStatus(
                        item.id,
                        item.taskStatus === ProjectStatus.ToDo ? ProjectStatus.Completed : ProjectStatus.ToDo
                      );
                    }
                    }
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                  />
                  <label>
                    Mark as {item.taskStatus === ProjectStatus.Completed ? 'incomplete' : 'complete'}
                  </label>
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
                  <div className={`app_table__priority app_table__priority--${item.taskPriority || 'Low'}`}>
                    <span className="app_table__priority__dot"></span>
                    {item.taskPriority || 'Low'}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Section */}
      <div className="task-section task-section--completed">
        <div className="task-section__header">
          <div className="bg-green-800 project_action_group__completed">
            Completed <span className="font-bold">{completedTasks.length}</span>
          </div>
        </div>
        {completedTasks.map((item: Task) => (
          <div key={item.id} className="task-section__content">
            <div className="task-card">
              <h4 className="task-card__title">{item.taskName}</h4>
              <ul className="task-card__options">
                <li className="flex">
                  <input
                    type="checkbox"
                    checked={item.taskStatus === ProjectStatus.Completed}
                    onChange={() => {
                      updateTaskStatus(
                        item.id,
                        item.taskStatus === ProjectStatus.ToDo ? ProjectStatus.Completed : ProjectStatus.ToDo
                      );
                    }
                    }
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                  />
                  <label>
                    Mark as {item.taskStatus === ProjectStatus.Completed ? 'incomplete' : 'complete'}
                  </label>
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
                  <div className={`app_table__priority app_table__priority--${item.taskPriority || 'Low'}`}>
                    <span className="app_table__priority__dot"></span>
                    {item.taskPriority || 'Low'}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
