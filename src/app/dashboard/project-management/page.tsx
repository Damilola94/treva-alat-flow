'use client'

import {
  ClientIcon,
  PersonalIcon,
  AnimatedModal,
  Pill,
  PlusIcon,
  RenderIf
} from '@/components/shared'
import { ProjectsTable } from '@/components/shared/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { Fragment, useState } from 'react'
import {
  CreateProjectCard,
  TakeATour,
  AddProject
} from '@/components/shared/project-management'
import projectManagement from '@/lib/assets/project-management'

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

const viewTakeATour = {
  img: projectManagement.topImage,
  title: 'Create Project',
  details:
    "You're almost there! Complete your onboarding to unlock the full potential of Creathrivity and start achieving your goals today.",
  btnText1: 'Start tour',
  btnText2: 'Skip',
  bottomInfo: ''
}

enum Projects {
  'All Projects' = 'All Projects',
  'Pending Project' = 'Pending Project',
  'Completed Project' = 'Completed Project',
}

export default function Page () {
  const [takeATour, setTakeATour] = useState(true)
  const [addProject, setAddProject] = useState(true)
  const [addProjectForm, setAddProjectForm] = useState(true)

  const handleAddProjectClick = () => {
    setAddProject(!addProject)
  }

  const handleProjectFormClick = () => {
    setAddProject(!addProject)
    setAddProjectForm(!addProjectForm)
  }

  const handleTakeTourClick = () => {
    setTakeATour(!takeATour)
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

      <RenderIf condition={takeATour}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'middle',
              onClose: handleTakeTourClick,
              className: 'sm:max-w-[300px] h-[420px] p-0'
            }}
          >
            <TakeATour item={viewTakeATour} handleClick={handleTakeTourClick} />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
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

          <div className="flex gap-2">
            <Input
              placeholder="Search for project"
              className="app_navbar__right__searchbar"
            />
            <Button
              size="md"
              onClick={handleAddProjectClick}
              backgroundColor="primary-blue-500"
              className="app_auth_login__btn"
            >
              <PlusIcon />
              Add project
            </Button>
          </div>
        </div>
        <ProjectsTable />
      </div>
    </div>
  )
}
