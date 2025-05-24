import React, { useMemo, } from 'react';
import {
  FlagOutline,
  CalendarWithMark,
  Calendar,
} from '@/components/shared';
import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { useAppDispatch } from '@/store';
import { clearValues } from '@/store/slices/project';
import { useTasks } from '@/hooks/Projects/useProjects';
import { useUpdateDeliverableTaskMutation } from '@/services';

interface IProps {
  taskId?: string;
  onAddTask: () => void;
  deliverableId?: string;
}
interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: number | string;
}

export function TaskGirdView({ deliverableId }: IProps) {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  const dispatch = useAppDispatch();
  dispatch(clearValues());

  const { allTasksData, refetchAllTasks } = useTasks(
    projectId,
    deliverableId,
  );
  const [updateTask] = useUpdateDeliverableTaskMutation();
  const tableBody: Task[] = useMemo(() => {
    if (allTasksData?.isSuccess && Array.isArray(allTasksData.data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return allTasksData.data.map((task: any) => ({
        id: task.id,
        name: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        priority: task.priority,
        status: task.status,
      }));
    }
    return [];
  }, [allTasksData?.isSuccess, allTasksData?.data]);

  const todoTasks = useMemo(() => {
    return tableBody.filter((task: Task) => task.status === 1);
  }, [tableBody]);

  const completedTasks = useMemo(() => {
    return tableBody.filter((task: Task) => task.status === 4);
  }, [tableBody]);

  const updateTaskStatus = async (taskId: string, newStatus: number) => {
    await updateTask({
      projectId,
      deliverableId,
      taskId,
      status: newStatus,
    });
    if (refetchAllTasks) refetchAllTasks();
  };

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
              <h4 className="task-card__title">{item.name}</h4>
              <ul className="task-card__options">
                <li className="flex">
                  <input
                    type="checkbox"
                    checked={item.status === 4}
                    onChange={() => {
                      updateTaskStatus(item.id, item.status === 1 ? 4 : 1);
                    }}
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                  />
                  <label>
                    Mark as {item.status === 4 ? 'incomplete' : 'complete'}
                  </label>
                </li>
                <li className="flex gap-2">
                  <Calendar />
                  Start date:
                  <div className="project_action_group__button">
                    {formatDate(item.startDate)}
                  </div>
                </li>
                <li className="flex gap-2">
                  <CalendarWithMark />
                  Due date:
                  <div className="project_action_group__button">
                    {formatDate(item.endDate)}
                  </div>
                </li>
                <li className="flex gap-2">
                  <FlagOutline />
                  Priority:
                  <div
                    className={`app_table__priority app_table__priority--${
                      item.priority || 'Low'
                    }`}
                  >
                    <span className="app_table__priority__dot"></span>
                    {item.priority || 'Low'}
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
              <h4 className="task-card__title">{item.name}</h4>
              <ul className="task-card__options">
                <li className="flex">
                  <input
                    type="checkbox"
                    checked={item.status === 4}
                    onChange={() => {
                      updateTaskStatus(item.id, item.status === 1 ? 4 : 1);
                    }}
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                  />
                  <label>
                    Mark as {item.status === 4 ? 'incomplete' : 'complete'}
                  </label>
                </li>
                <li className="flex gap-2">
                  <Calendar />
                  Start date:
                  <div className="project_action_group__button">
                    {formatDate(item.startDate)}
                  </div>
                </li>
                <li className="flex gap-2">
                  <CalendarWithMark />
                  Due date:
                  <div className="project_action_group__button">
                    {formatDate(item.endDate)}
                  </div>
                </li>
                <li className="flex gap-2">
                  <FlagOutline />
                  Priority:
                  <div
                    className={`app_table__priority app_table__priority--${
                      item.priority || 'Low'
                    }`}
                  >
                    <span className="app_table__priority__dot"></span>
                    {item.priority || 'Low'}
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
