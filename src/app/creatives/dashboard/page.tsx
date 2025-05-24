'use client';

import {
  AnimatedModal,
  ClientIcon,
  EmptyStatus,
  PersonalIcon,
  Pill,
  PlusIcon,
  RenderIf,
} from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
// import { ProjectsTable } from '@/components/shared/dashboard';
import { EmptyState } from '@/components/shared/dashboard/empty-state';
import { ProjectsTable } from '@/components/shared/dashboard/project-management/project-table/projects-table';
import {
  AddProject,
  CreateProjectCard,
} from '@/components/shared/project-management';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile, useUsers } from '@/hooks/Users';
import dashboard from '@/lib/assets/dashboard';
import projectManagement from '@/lib/assets/project-management';
import { numberFormat } from '@/lib/numbers';
import routes from '@/lib/routes';
import { getAvatar, getFullName } from '@/lib/utils';
import { ProjectStatus } from '@/services/queries/projects/enums';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
// import { createAProject } from './project-management/page';

const createAProject = {
  img: projectManagement.topImageProject,
  title: 'Add new project',
  createProject: [
    {
      icon: <PersonalIcon />,
      title: 'Personal',
      details: 'Support a cause by making one-time donations.',
    },
    {
      icon: <ClientIcon />,
      title: 'Client',
      details: 'Support a cause by making one-time donations.',
    },
  ],
  btnText1: 'Proceed',
};

enum Tasks {
  'Due Task' = 'Due Task',
  'Ongoing Task' = 'Ongoing Task',
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
    value: numberFormat(0),
  },
];

export default function Page() {
  const router = useRouter();

  const [addProject, setAddProject] = useState(true);
  const [addProjectForm, setAddProjectForm] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectStatus | null>(null);
  const [search, setSearch] = useState('');
  // const { data } = queries.read();

  const { data } = useProfile();
  const userData = useMemo(() => data?.data || null, [data]);

  const { creativeOnboardingData } = useUsers();

  const handleAddProjectClick = () => {
    setAddProject(!addProject);
  };

  const handleProjectFormClick = () => {
    setAddProject(!addProject);
    setAddProjectForm(!addProjectForm);
  };

  const handleProjectFormClose = () => {
    setAddProjectForm(!addProjectForm);
  };

  useEffect(() => {
    if (
      !creativeOnboardingData?.data?.isCompleted &&
      creativeOnboardingData?.data
    ) {
      router.push(routes.creatives.dashboard.getStarted.path);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creativeOnboardingData]);

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <RenderIf condition={!addProject}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'middle',
              onClose: handleAddProjectClick,
              className: 'sm:max-w-[450px] h-[420px] p-0',
            }}
          >
            <CreateProjectCard
              item={createAProject}
              handleProject={handleProjectFormClick}
              handleClick={handleAddProjectClick}
              onClose={handleProjectFormClick}
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
                'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2',
            }}
          >
            <AddProject onClose={handleProjectFormClose} />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <div className="app_dashboard_home__header">
        <div className="app_dashboard_home__header__profile_con app_dashboard_page__px">
          <div className="app_dashboard_home__header__profile">
            {false && (
              <div className="app_dash_main__aside__btm__avi">
                <Image src={dashboard.avi} alt="avi" className="w-full" />
              </div>
            )}
            <Avatar
              src={getAvatar({
                name: userData && getFullName(userData),
                length: 2,
              })}
            />
            <h4 className="app_dashboard_home__header__profile__h4">
              Welcome, {userData?.firstName}
            </h4>
          </div>
          <Button
            size="md"
            backgroundColor="text-color-100"
            color="shark-950"
            className="app_auth_login__btn"
            onClick={() => {
              window.location.href =
                routes.creatives.dashboard.projectManagement.path;
            }}
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
                className={`app_dashboard_home__kpis__item ${
                  IS_WALLET ? 'app_dashboard_home__kpis__item--wallet' : ''
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
        </div>

        <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
          <EmptyState
            icon={<EmptyStatus />}
            title="No task yet"
            description="Click “create project” button to get started"
          />
        </div>
      </div>

      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2">
          <div className="flex md:flex-wrap gap-2">
            <Pill
              key="all-projects"
              size="md"
              active={selectedCategory === null}
              onClick={() => {
                setSelectedCategory(null);
              }}
            >
              All Projects
            </Pill>
            {Object.values(ProjectStatus).map((status) => (
              <Pill
                key={status}
                size="md"
                active={selectedCategory === status}
                onClick={() => {
                  setSelectedCategory(status);
                }}
              >
                {status}
              </Pill>
            ))}
          </div>

          <Input
            placeholder="Search for project"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="app_navbar__right__searchbar"
          />
        </div>

        <ProjectsTable
          category=""
          search={search}
          projectPriority={''}
          projectStatus={selectedCategory ?? ''}
        />
      </div>
    </div>
  );
}
