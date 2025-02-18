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
import { EditProject } from '@/components/shared/dashboard/project-management/project-table/edit-project'
import { DeleteProject } from '@/components/shared/dashboard/project-management/project-table/delete-project'

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

const deleteClient = {
  img: projectManagement.topImage,
  title: 'Are you sure you want to delete this project',
  details: 'Project record will be deleted Permanently',
  btnText1: 'Cancel',
  btnText2: 'Delete'
};

enum Projects {
  'All Projects' = 'All Projects',
  'Pending Project' = 'Pending Project',
  'Completed Project' = 'Completed Project',
}

export default function Page () {
  const [takeATour, setTakeATour] = useState(true)
  const [addProject, setAddProject] = useState(true)
  const [addProjectForm, setAddProjectForm] = useState(true)

  const [editForm, setEditForm] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);

  const [deleteForm, setDeleteForm] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const handleEditProject = (id: string) => {
    setEditProjectId(id)
    setEditForm(true)
  }

  const handleCloseEditForm = () => {
    setEditForm(false)
    setEditProjectId(null)
  }

  // const handleEditClient = () => {
  //   setEditForm(!deleteForm);
  // };

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

  const onDelete = (id: string) => {
    setDeleteProjectId(id);
    setDeleteForm(!deleteForm);
  };

  const handleDeleteProject = () => {
    setDeleteForm(!deleteForm)
  }

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <RenderIf condition={!addProject}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: !addProject,
              from: 'middle',
              onClose: handleAddProjectClick,
              className: 'sm:max-w-[450px] h-[420px] p-0'
            }}
          >
            <CreateProjectCard
              item={createAProject}
              handleProject={handleProjectFormClick}
              handleClick={handleAddProjectClick}
              onClose={handleAddProjectClick}
            />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <RenderIf condition={!addProjectForm}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: !addProjectForm,
              from: 'right',
              onClose: handleProjectFormClose,
              className:
                'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2'
            }}
          >
            <AddProject onClose={handleProjectFormClose} />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <RenderIf condition={editForm}>
        <AnimatedModal
          isOpen={editForm}
          from="right"
          onClose={handleCloseEditForm}
          className="absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2"
        >
          {editProjectId && (
            <EditProject
              id={editProjectId}
              item={editProjectId}
              handleClick={handleCloseEditForm}
              onClose={handleCloseEditForm}
              setProjectId={setEditProjectId}
              setDeliverableId={() => { }}
              handleNext={() => { }}
              onAddDeliverable={() => { }}
            />
          )}
        </AnimatedModal>
      </RenderIf>

      <RenderIf condition={takeATour}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: takeATour,
              from: 'middle',
              onClose: handleTakeTourClick,
              className: 'sm:max-w-[300px] h-[420px] p-0'
            }}
          >
            <TakeATour item={viewTakeATour} handleClick={handleTakeTourClick} />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <RenderIf condition={deleteForm}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'middle',
              onClose: onDelete,
              className: 'sm:max-w-[450px] h-[300px] p-0'
            }}
          >
            {deleteProjectId && <DeleteProject projectId={deleteProjectId} item={deleteClient} handleClick={() => { setDeleteForm(false); }} onClose={handleDeleteProject} />}
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
        <ProjectsTable onEdit={handleEditProject} onDelete={onDelete} />
      </div>
    </div>
  )
}
