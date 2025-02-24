'use client';

import { Pill, PlusIcon, AnimatedModal } from '@/components/shared';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Select } from '@/components/shared/select';
import projectManagement from '@/lib/assets/project-management';
import Image from 'next/image';
import { CreateTaskCard } from '@/components/shared/project-management';
import queries from '@/services/queries/projects';
import { useParams } from 'next/navigation';
import { TaskTable } from '@/components/shared/dashboard/project-management/project-table/projects-task-table';
import { DeliverableTable } from '@/components/shared/dashboard/project-management/project-table/deliverable-table';
import { AddDeliverables } from '@/components/shared/project-management.tsx/add-deliverables';
import { ButtonGroup } from './button-group';
import { ProgressBar } from './progress-tag';

type TabType = 'task' | 'deliverables' | 'payment'

const getAddButtonText = (tab: TabType) => {
  switch (tab) {
    case 'task':
      return 'Add new task'
    case 'deliverables':
      return 'Add new deliverable'
    case 'payment':
      return 'Add new payment'
  }
}

const options = [
  { value: 'Table', label: 'Table' },
  { value: 'Grid', label: 'Grid' }
];

interface Deliverable {
  deliverableId: string
  deliverableName: string
  description: string
  startDate: string
  dueDate: string
  amount: string
}

export default function Page () {
  const params = useParams()
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id
  const { data } = queries.readone({ projectId })

  const [activeTab, setActiveTab] = useState<TabType>('task')

  // const [addTask, setAddTask] = useState(true)
  const [viewType, setViewType] = useState('Grid');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TabType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deliverableId, setDeliverableId] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  // const [taskId, setTaskId] = useState<string>('');
  // const [task, setTask] = useState<Task[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: deliverableData, refetch } = queries.readDeliverables({ projectId }, {
    onSuccess: (newData: any) => {
      setDeliverables(newData);
    }
  });

  const handleAddClick = (tab: TabType) => {
    setModalType(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  // const handleAddTask = () => {
  //   setAddTask(!addTask)
  // }

  const handleAddDeliverables = (newDeliverable: Deliverable) => {
    setDeliverables((prev) => [...prev, newDeliverable]);
    void refetch();
  };

  const handleViewChange = (selectedOption: {
    value: string
    label: string
  }) => {
    setViewType(selectedOption.value);
  };

  return (
    <div className="app_dashboard_page app_dashboard_home">
      {/* <RenderIf condition={addTask}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'middle',
              onClose: handleAddTask,
              className: 'sm:max-w-[450px] h-[380px] p-0 w-1/2'
            }}
          >
            <CreateTaskCard
              item={createTask}
              handleClick={handleAddTask}
            />
          </AnimatedModal>
        </Fragment>
      </RenderIf> */}

      <AnimatedModal
        isOpen={isModalOpen}
        from="right"
        onClose={closeModal}
        className="absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2"
      >
        {modalType === 'task' && (
          <CreateTaskCard onClose={closeModal} projectId={projectId} setDeliverableId={setDeliverableId} />
        )}

        {modalType === 'deliverables' && (
          <AddDeliverables
            onClose={closeModal}
            projectId={projectId}
            onAddDeliverable={handleAddDeliverables}
            setDeliverableId={setDeliverableId}
          />
        )}
      </AnimatedModal>

      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex items-center justify-between flex-wrap gap-2 mt-4">
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold">{data?.title}</h1>
                <p className='text-[#888888] font-medium mt-5'>{data?.description}</p>

              </div>
              {/* <button className="text-primary-blue-500 hover:underline">
                <EditIcon />
              </button> */}
            </div>
            <div className="flex items-center ml-10 gap-4 mt-1">
              <div className="flex -space-x-2">
                <Image
                  src={projectManagement?.male}
                  alt="male"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <Image
                  src={projectManagement?.female}
                  alt="female"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Button
              size="md"
              onClick={() => { handleAddClick(activeTab); }}
              backgroundColor="primary-blue-500"
              className="app_auth_login__btn flex items-center gap-2"
            >
              <PlusIcon />
              {getAddButtonText(activeTab)}
            </Button>
          </div>
        </div>

        <div className="mt-10 flex justify-between w-full">
          <ButtonGroup />
          <ProgressBar />
        </div>

        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
          <div className="flex flex-wrap gap-2">
            {['task', 'deliverables', 'payment'].map((tab) => (
              <Pill
                key={tab}
                size="md"
                active={activeTab === tab}
                onClick={() => { setActiveTab(tab as TabType); }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Pill>
            ))}
          </div>

          <div className="flex gap-2">
            <Select
              options={options}
              placeholder="View"
              onChange={handleViewChange}
            />
          </div>
        </div>
        {activeTab === 'task' && <TaskTable viewType={viewType} />}
        {activeTab === 'deliverables' && <DeliverableTable />}
        {/* {activeTab === "payment" && <PaymentTable />} */}

      </div>
    </div>
  );
}
