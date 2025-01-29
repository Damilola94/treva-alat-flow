'use client';

import { AnimatedModal, ClientIcon, EmptyStatus, PersonalIcon, Pill, PlusIcon, RenderIf } from '@/components/shared';
import { ProjectsTable } from '@/components/shared/dashboard';
import { EmptyState } from '@/components/shared/dashboard/empty-state';
import { AddProject, CreateProjectCard } from '@/components/shared/project-management';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dashboard from '@/lib/assets/dashboard';
import projectManagement from '@/lib/assets/project-management';
import { numberFormat } from '@/lib/numbers';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';
// import { createAProject } from './project-management/page';

const createAProject = {
  img: projectManagement.topImageProject,
  title: 'Add new project',
  createProject: [
    {
      icon: <PersonalIcon />,
      title: 'Personal',
      details: 'Support a cause by making one-time donations.'
    },
    {
      icon: <ClientIcon />,
      title: 'Client',
      details: 'Support a cause by making one-time donations.'
    }
  ],
  btnText1: 'Proceed'
}

enum Tasks {
  'Due Task' = 'Due Task',
  'Ongoing Task' = 'Ongoing Task',
}

enum Projects {
  'All Projects' = 'All Projects',
  'Pending Project' = 'Pending Project',
  'Completed Project' = 'Completed Project',
}

function EllIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_b_87_5448)">
        <circle cx="14" cy="14" r="14" fill="#262626" />
      </g>
      <circle cx="8" cy="14" r="2" fill="#F6F6F6" />
      <circle cx="14" cy="14" r="2" fill="#F6F6F6" />
      <circle cx="20" cy="14" r="2" fill="#F6F6F6" />
      <defs>
        <filter
          id="filter0_b_87_5448"
          x="-10"
          y="-10"
          width="48"
          height="48"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_87_5448"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_87_5448"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

const kpis = [
  { label: 'Active Project', value: '0' },
  { label: 'Completed Project', value: '0' },
  { label: 'To-do Task', value: '0' },
  {
    label: (
      <>
        Wallet balance <EllIcon />
      </>
    ),
    value: numberFormat(0)
  }
];

export default function Page() {
  const [addProject, setAddProject] = useState(true)
  const [addProjectForm, setAddProjectForm] = useState(true)

  const handleAddProjectClick = () => {
    setAddProject(!addProject)
  }

  const handleProjectFormClick = () => {
    setAddProject(!addProject)
    setAddProjectForm(!addProjectForm)
  }

  const handleProjectFormClose = () => {
    setAddProjectForm(!addProjectForm)
  }
  return (
    <div className="app_dashboard_page app_dashboard_home">
      <RenderIf condition={!addProject}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'middle',
              onClose: handleAddProjectClick,
              className: 'sm:max-w-[450px] h-[420px] p-0'
            }}
          >
            <CreateProjectCard
              item={createAProject}
              handleProject={handleProjectFormClick}
              handleClick={handleAddProjectClick}
            />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <RenderIf condition={!addProjectForm}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'right',
              onClose: handleProjectFormClose,
              className:
                'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2'
            }}
          >
            <AddProject />
          </AnimatedModal>
        </Fragment>
      </RenderIf>
      <div className="app_dashboard_home__header">
        <div className="app_dashboard_home__header__profile_con app_dashboard_page__px">
          <div className="app_dashboard_home__header__profile">
            <div className="app_dash_main__aside__btm__avi">
              <Image src={dashboard.avi} alt="avi" className="w-full" />
            </div>
            <h4 className="app_dashboard_home__header__profile__h4">
              Welcome, Moyinoluwa
            </h4>
          </div>
          <Button
            size="md"
            backgroundColor="text-color-100"
            color="shark-950"
            className="app_auth_login__btn"
            onClick={handleAddProjectClick}

          >
            <PlusIcon fill="var(--shark-950)" />
            Create Project
          </Button>
        </div>

        <div className="app_dashboard_home__kpis grid grid-cols-4 app_dashboard_page__px">
          {kpis.map((item, index) => {
            const IS_WALLET = kpis.length === index + 1;

            return (
              <div
                className={`app_dashboard_home__kpis__item ${IS_WALLET ? 'app_dashboard_home__kpis__item--wallet' : ''
                  }`}
                key={index}
              >
                <h6 className="app_dashboard_home__kpis__item__h6">
                  {item.label}
                </h6>

                <p className="app_dashboard_home__kpis__item__value">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="app_dashboard_home__task app_dashboard_page__px pt-4">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {Object.entries(Tasks).map(([label]) => (
              <Pill key={label} size="md" active={Tasks['Due Task'] === label}>
                {label}
              </Pill>
            ))}
          </div>

          <Button
            size="md"
            backgroundColor="shark-950"
            className="app_auth_login__btn"
          >
            <PlusIcon />
            Add new task
          </Button>
        </div>

        <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
          <EmptyState
            icon={<EmptyStatus />}
            title="No task yet"
            description="Click “add new request” button to get started"
          />

          {/* <div className="flex flex-col gap-1">
            <p className="app_dashboard_home__task__ctt__title">No task yet</p>
            <p className="app_dashboard_home__task__ctt__desc">
              Click “add new request” button to get started
            </p>
          </div> */}
        </div>
      </div>

      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {Object.entries(Projects).map(([label]) => (
              <Pill
                key={label}
                size="md"
                active={Projects['All Projects'] === label}
              >
                {label}
              </Pill>
            ))}
          </div>

          <Input
            placeholder="Search for project"
            className="app_navbar__right__searchbar"
          />
        </div>

        <ProjectsTable />
      </div>
    </div>
  );
}
