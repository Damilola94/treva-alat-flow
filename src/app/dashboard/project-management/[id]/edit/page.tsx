'use client';

import { EditIcon, Pill, PlusIcon,AnimatedModal,RenderIf } from '@/components/shared';
import { Formik } from 'formik';
import { EditProjectsTable, TaskGirdView } from '@/components/shared/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { Fragment,useState } from 'react';
import { Select } from '@/components/shared/select';
import projectManagement from '@/lib/assets/project-management';
import Image from 'next/image';
import { ButtonGroup } from './button-group';
import { ProgressBar } from './progress-tag';
import { CreateTaskCard } from '@/components/shared/project-management';


const createTask = {
  img: projectManagement.topcover,
  title: '{Task name}',
  btnText1: 'Close',
}

const initialValues = {
  description: '',
};

const options = [
  { value: 'Table', label: 'Table' },
  { value: 'Grid', label: 'Grid' },
];

enum Projects {
  'Overview' = 'Overview',
  'Task' = 'Task',
  'Deliverables' = 'Completed Project',
  'Invoice' = 'Invoice',
}

export default function Page() {
  const [addTask, setAddTask] = useState(true)
  const [viewType, setViewType] = useState('Grid');


  const handleAddTask =  () => {
    setAddTask(!addTask)
  }

  const handleViewChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setViewType(selectedOption.value); 
  };

  return (
    <div className="app_dashboard_page app_dashboard_home">
       <RenderIf condition={!addTask}>
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
      </RenderIf>
      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex items-center justify-between flex-wrap gap-2 mt-4">
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">{'{Project name}'}</h1>
              <button className="text-primary-blue-500 hover:underline">
                <EditIcon />
              </button>
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
              onClick={handleAddTask}
              backgroundColor="primary-blue-500"
              className="app_auth_login__btn flex items-center gap-2"
            >
              <PlusIcon />
              Add new task
            </Button>
          </div>
        </div>

        <Formik initialValues={initialValues} onSubmit={() => {}}>
          {(props) => {
            const {
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
            } = props;
            return (
              <form onSubmit={handleSubmit} className="-mt-5">
                <Input
                  name="description"
                  type="text"
                  id="description"
                  placeholder="Project description"
                  className="border border-b-0"
                  size="xl"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </form>
            );
          }}
        </Formik>

        <div className="mt-10 flex justify-between w-full">
          <ButtonGroup />
          <ProgressBar />
        </div>

        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(Projects).map(([label]) => (
              <Pill key={label} size="md" active={Projects.Task === label}>
                {label}
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

        {viewType === 'Grid' ? (
          <TaskGirdView />
        ) : (
          <div>
            <div className="my-10">
              <div className="flex space-x-3 items-center my-5">
                <div className="project_action_group__todo">
                  To do <span className="font-bold">10</span>
                </div>

                <div
                  onClick={handleAddTask}
                  className="flex items-center cursor-pointer text-shark-950 gap-1"
                  color=""
                >
                  <PlusIcon fill="#6D6D6D" />
                  Add task
                </div>
              </div>
              <EditProjectsTable />
            </div>

            <div className="my-10 mb-20">
              <div className="flex space-x-3 items-center my-5">
                <div className="bg-green-800 project_action_group__completed ">
                  Completed <span className="font-bold">10</span>
                </div>

                <div
                  onClick={handleAddTask}
                  className="flex items-center cursor-pointer text-shark-950 gap-1"
                  color=""
                >
                  <PlusIcon fill="#6D6D6D" />
                  Add task
                </div>
              </div>
              <EditProjectsTable />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
