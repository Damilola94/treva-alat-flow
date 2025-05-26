/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { TaskGirdView } from '../grid-view/grid-view';
import { Label } from '@/components/shared/Label';
import { Loader2 } from 'lucide-react';
import { Table } from '@/components/shared/Table';
import { useTasks } from '@/hooks/Projects/useProjects';
import { useUpdateDeliverableTaskMutation } from '@/services';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store';
import { clearValues } from '@/store/slices/project';
import { BinGray, EditPencilGray, Plus } from '@/components/shared/svgs';

interface TaskTableProps {
  viewType?: string;
  projectId?: string;
  taskId?: string;
  onAddTask: () => void;
  deliverableId?: string;
  onUpdateTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}
interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: number | string;
}

export function TaskTable({
  viewType,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  deliverableId,
}: TaskTableProps) {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  const dispatch = useAppDispatch();
  dispatch(clearValues());

  const [activeTab, setActiveTab] = useState<'todo' | 'completed'>('todo');

  const { allTasksData, loading, refetchAllTasks } = useTasks(
    projectId,
    deliverableId,
  );
  const [updateTask] = useUpdateDeliverableTaskMutation();

  const tableBody: Task[] = useMemo(() => {
    if (allTasksData?.isSuccess && Array.isArray(allTasksData.data)) {
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

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const headers = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Start date',
      accessorKey: 'startDate',
      cell: ({ row }: any) => {
        const date = row.original.startDate;
        return formatDate(date);
      },
    },
    {
      header: 'End date',
      accessorKey: 'endDate',
      cell: ({ row }: any) => {
        const date = row.original.endDate;
        return formatDate(date);
      },
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const value = row.original.priority;
        return (
          <div className="">
            <Label type="priority" value={value} showIcon />
          </div>
        );
      },
    },
    {
      header: '',
      accessorKey: 'actions',
      cell: ({ row }: any) => {
        const task = row.original;
        const isCompleted = task.status === 4;
        const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const newStatus = e.target.checked ? 4 : 2;
          await updateTask({
            projectId,
            deliverableId,
            taskId: task.id,
            status: newStatus,
          });
          if (refetchAllTasks) refetchAllTasks();
        };
        return (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-5 h-5 cursor-pointer"
              checked={isCompleted}
              onChange={handleChange}
            />
            <label>Mark as {isCompleted ? 'Incomplete' : 'Completed'}</label>
          </div>
        );
      },
    },
    {
      header: '',
      accessorKey: 'actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const task = row.original;
        return (
          <div className="app_table__tbody__td__ctt flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
            >
              <BinGray className="h-4 w-4" />
            </Button >
                <Button variant="outline" size="icon"  onClick={() => onUpdateTask(task.id)}>
                  <EditPencilGray className="h-4 w-4" />
                </Button>
             
          </div>
        );
      },
    },
  ];

  return (
    <div className="app_dashboard_home__task__cct">
      <div className="flex justify-between items-center mb-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as 'todo' | 'completed');
          }}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList className="gap-3">
              <TabsTrigger
                value="todo"
                className="flex gap-2 rounded-full border-none"
                style={{
                  backgroundColor: activeTab === 'todo' ? '#26A17B' : 'white',
                  color: activeTab === 'todo' ? 'white' : 'black',
                }}
              >
                To do
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm text-black">
                  {todoTasks.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex gap-2 rounded-full border-none"
                style={{
                  backgroundColor:
                    activeTab === 'completed' ? '#26A17B' : 'white',
                  color: activeTab === 'completed' ? 'white' : 'black',
                }}
              >
                Completed
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm text-black">
                  {completedTasks.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={onAddTask}
              className="flex items-center gap-2 text-purple-600 bg-transparent hover:bg-purple-50"
            >
              <Plus />
              Add new task
            </Button>
          </div>

          <TabsContent value="todo" className="mt-4">
            {viewType === 'table' ? (
              <div className="w-full text-left relative rounded-xl overflow-auto">
                <div className="shadow-sm overflow">
                  {loading ? (
                    <div className="text-center flex justify-center items-center">
                      <Loader2 size={18} className="animate-spin" />
                    </div>
                  ) : (
                    <Table<Task>
                      columns={headers}
                      emptyTitle="No Tasks Yet"
                      emptyMessage="You'll see all your tasks here"
                      data={tableBody}
                      pagination={pagination}
                      setPagination={setPagination}
                    />
                  )}
                </div>
              </div>
            ) : (
              <TaskGirdView
                onAddTask={function (): void {
                  throw new Error('Function not implemented.');
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            {viewType === 'table' ? (
              <div className="w-full text-left relative rounded-xl overflow-auto">
                <div className="shadow-sm overflow">
                  {loading ? (
                    <div className="text-center flex justify-center items-center">
                      <Loader2 size={18} className="animate-spin" />
                    </div>
                  ) : (
                    <Table<Task>
                      columns={headers}
                      emptyTitle="No Completed Tasks"
                      emptyMessage="You'll see all your completed tasks here"
                      data={completedTasks}
                      pagination={pagination}
                      setPagination={setPagination}
                    />
                  )}
                </div>
              </div>
            ) : (
              <TaskGirdView
                onAddTask={function (): void {
                  throw new Error('Function not implemented.');
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
