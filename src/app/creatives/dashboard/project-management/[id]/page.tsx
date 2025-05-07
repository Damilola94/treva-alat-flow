'use client';

import { Pill, PlusIcon, AnimatedModal, Calendar, FlagOutline } from '@/components/shared';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Select } from '@/components/shared/select';
import projectManagement from '@/lib/assets/project-management';
import Image from 'next/image';
import { CreateTaskCard } from '@/components/shared/project-management';
import queries from '@/services/queries/projects';
import { useParams } from 'next/navigation';
import { TaskTable } from '@/components/shared/dashboard/project-management/project-table/task-table';
import { DeliverableTable } from '@/components/shared/dashboard/project-management/project-table/deliverable-table';
import { formatDate } from '@/lib/utils';
import { PaymentTable } from '@/components/shared/dashboard/project-management/project-table/payment-table';

type TabType = 'task' | 'deliverables' | 'payment'

const options = [
  { value: 'table', label: 'Table' },
  { value: 'grid', label: 'Grid' }
];

export default function Page () {
  const params = useParams()
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id
  const { data } = queries.readone({ projectId })

  const [activeTab, setActiveTab] = useState<TabType>('deliverables')

  const [viewType, setViewType] = useState('table');

  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deliverableId, setDeliverableId] = useState<string>('');

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleViewChange = (selectedOption: {
    value: string
    label: string
  }) => {
    setViewType(selectedOption.value);
  };

  const tabs: TabType[] = ['deliverables', 'task'];
  if (data?.projectType === 'ClientProject') {
    tabs.push('payment');
  }

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <AnimatedModal
        isOpen={isModalOpen}
        from="right"
        onClose={closeModal}
        className="absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2"
      >

        <CreateTaskCard onClose={closeModal} projectId={projectId} setDeliverableId={setDeliverableId} />

      </AnimatedModal>

      <div className="app_dashboard_home__task app_dashboard_page__px !bg-white border border-[#E7E7E7]">
        <div className="app_dashboard_home__task__hdr flex items-center justify-between flex-wrap gap-2 mt-4">
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold">{data?.title}</h1>
                <p className='text-[#888888] font-medium mt-5'>{data?.description}</p>

              </div>
            </div>
            {false &&
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
            }
          </div>

          <div className="flex-shrink-0">
            <Button
              size="md"
              onClick={() => { handleAddClick(); }}
              backgroundColor="primary-blue-500"
              className="app_auth_login__btn flex items-center gap-2"
            >
              <PlusIcon />
              Add new Task
            </Button>
          </div>
        </div>

        <div className="my-4 block md:flex md:justify-between w-full">
          {/* <ButtonGroup /> */}
          <div className="project_action_group">
          <div className='flex items-center gap-1 mb-3 md:mb-0 md:gap-2'>
              <Calendar />
              Start:
              <div className="project_action_group__button">{formatDate(data.expectedDeliveryDate)}</div>

            </div>
            <div className='flex items-center gap-1 mb-3 md:mb-0 md:gap-2'>
              <Calendar />
              End:
              <div className="project_action_group__button">{formatDate(data.expectedDeliveryDate)}</div>

            </div>
            <div className='flex items-center gap-1 mb-3 md:mb-0 md:gap-2'>
              <FlagOutline />
              Priority:
              <div className={`app_table__priority app_table__priority--${(data.priority) || 'Low'} project_action_group__button`}>
                <span className="app_table__priority__dot" />
                {data?.priority || 'Low'}
              </div>

            </div>
          </div>
          <div className="md:w-1/4">
            <div className="app_progress-bar__label">
              Progress 0% <span className="app_progress-bar__label__days-left">{data?.remainingDays}</span>
            </div>
            <div className="app_progress-bar-track">
              <div className="app_progress-bar-track-fill" style={{ width: '10%' }} />
            </div>
          </div>
        </div>

    </div>
    <div className='app_dashboard_home__task app_dashboard_page__px !bg-white border border-[#E7E7E7]'>
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
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
            {activeTab === 'task' &&
              <Select
                options={options}
                placeholder="View"
                onChange={handleViewChange}
                className="w-full sm:w-auto"
              />
            }
          </div>
        </div>

    </div>
    <div className='app_dashboard_page__px mt-10'>
        {activeTab === 'task' && <TaskTable viewType={viewType} />}
        {activeTab === 'deliverables' && <DeliverableTable />}
        {activeTab === 'payment' && <PaymentTable />}

    </div>

      </div>
  );
}
