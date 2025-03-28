'use client'

import {
  ClientIcon,
  PersonalIcon,
  AnimatedModal,
  // Pill,
  PlusIcon,
  RenderIf
} from '@/components/shared'
import { ProjectsTable } from '@/components/shared/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { Fragment, useCallback, useState } from 'react'
import {
  CreateProjectCard,
  TakeATour,
  AddProject
} from '@/components/shared/project-management'
import projectManagement from '@/lib/assets/project-management'
import { EditProject } from '@/components/shared/dashboard/project-management/project-table/edit-project'
import { DeleteProject } from '@/components/shared/dashboard/project-management/project-table/delete-project'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ListFilter } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type ProjectPriority, type ProjectStatus, type ProjectType } from '@/services/queries/projects/enums'
import queries from '@/services/queries/projects'

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

export default function Page () {
  const path = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const popoverItems = [
    { label: 'All Project', value: '' },
    { label: 'Personal Project', value: 'PersonalProject' },
    { label: 'Client Project', value: 'ClientProject' }
  ]

  const priorityItems = [
    { label: 'All', value: '' },
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
  ]

  const statusItems = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Due', value: 'Due' }
  ]

  const handleCategorySelect = useCallback((projectType: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (projectType) {
      params.set('projectType', projectType)
    } else {
      params.delete('projectType')
    }
    router.push(`${path}?${params.toString()}`)
  }, [path, searchParams, router])

  const handlePriorityItem = useCallback((priority: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (priority) {
      params.set('projectPriority', priority)
    } else {
      params.delete('projectPriority')
    }
    router.push(`${path}?${params.toString()}`)
  }, [path, searchParams, router])

  const handleStatusItem = useCallback((status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status) {
      params.set('projectStatus', status)
    } else {
      params.delete('projectStatus')
    }
    router.push(`${path}?${params.toString()}`)
  }, [path, searchParams, router])

  const selectedCategory = searchParams.get('projectType') as ProjectType || '';
  const selectedPriority = searchParams.get('projectPriority') as ProjectPriority || '';
  const selectedStatus = searchParams.get('projectStatus') as ProjectStatus || '';

  const [search, setSearch] = useState('');
  const { refetch } = queries.read({ search });

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    void refetch();
  };

  // const clearSearch = () => {
  //   setSearch('');
  //   void refetch();
  // };

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <RenderIf condition={!addProject}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: !addProject,
              from: 'middle',
              onClose: handleAddProjectClick,
              className: 'sm:max-w-[450px] h-[420px] p-0 mx-7 lg:mx-0'
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
                'lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7'
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
          className="lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7"
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
              className: 'sm:max-w-[300px] h-[420px] p-0 mx-7 lg:mx-0'
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
              className: 'sm:max-w-[450px] h-[300px] p-0 mx-7 lg:mx-0'
            }}
          >
            {deleteProjectId && <DeleteProject projectId={deleteProjectId} item={deleteClient} handleClick={() => { setDeleteForm(false); }} onClose={handleDeleteProject} />}
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
          <div className='flex gap-2'>
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger>
                  <button type="button" className="app_dashboard_group_header__btn">
                    Project Type
                    <ListFilter size={14} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="app_popover__content">
                  {popoverItems.map((item) => (
                    <button
                      className="app_popover__content__item"
                      key={item.value}
                      onClick={() => { handleCategorySelect(item.value) }}
                    >
                      {item.label}
                      <RenderIf condition={searchParams.get('projectType') === item.value}>
                        <Check />
                      </RenderIf>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger>
                  <button type="button" className="app_dashboard_group_header__btn">
                    Priority
                    <ListFilter size={14} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="app_popover__content">
                  {priorityItems.map((item: any) => (
                    <button
                      className="app_popover__content__item"
                      key={item.value}
                      onClick={() => { handlePriorityItem(item.value) }}
                    >
                      {item.label}
                      <RenderIf condition={searchParams.get('projectPriority') === item.value}>
                        <Check />
                      </RenderIf>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger>
                  <button type="button" className="app_dashboard_group_header__btn">
                    Status
                    <ListFilter size={14} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="app_popover__content">
                  {statusItems.map((item) => (
                    <button
                      className="app_popover__content__item"
                      key={item.value}
                      onClick={() => { handleStatusItem(item.value) }}
                    >
                      {item.label}
                      <RenderIf condition={searchParams.get('projectStatus') === item.value}>
                        <Check />
                      </RenderIf>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search for project"
              className="app_navbar__right__searchbar"
              onChange={handleSearchChange}
              value={search}
            />
            <Button
              type='button'
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
        <ProjectsTable onEdit={handleEditProject} onDelete={onDelete} category={selectedCategory} projectPriority={selectedPriority} projectStatus={selectedStatus} search={search} />
      </div>
    </div>
  )
}
