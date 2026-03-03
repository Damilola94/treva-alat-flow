'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  ClientIcon,
  PersonalIcon,
  AnimatedModal,
  PlusIcon,
  RenderIf,
  Table,
  Label,
  projectTypeMap,
} from '@/components/shared';

import { Button } from '@/components/ui/button';
import {
  CreateProjectCard,
  TakeATour,
  AddProject,
} from '@/components/shared/project-management';

import { DeleteProject } from '@/components/shared/dashboard/project-management/project-table/delete-project';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ListFilter, Loader2 } from 'lucide-react';

import projectManagement from '@/lib/assets/project-management';
import { BinGray, EditPencilGray } from '@/components/shared/svgs';
import { popoverItems, priorityItems, statusItems } from '@/constants';
import { useProjects } from '@/hooks/Projects';
import SearchInput from '@/components/ui/SearchInput';
import { formatDate } from '@/lib/utils';

import { useAppDispatch } from '@/store';
import { resetProject } from '@/store/slices/project';

interface ProjectQueryParams {
  type?: string;
  status?: string;
  priority?: string;
  currency?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

const createAProject = {
  img: projectManagement.createImg,
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

const viewTakeATour = {
  img: projectManagement.topImage,
  title: 'Create Project',
  details:
    "You're almost there! Complete your onboarding to unlock the full potential of Treva and start achieving your goals today.",
  btnText1: 'Start tour',
  btnText2: 'Skip',
  bottomInfo: '',
};

const deleteProject = {
  img: projectManagement.topImage,
  title: 'Are you sure you want to delete this project',
  details: 'Project record will be deleted Permanently',
  btnText1: 'Cancel',
  btnText2: 'Delete',
};

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [params, setParams] = useState<ProjectQueryParams>({
    pageNumber: 0,
    pageSize: 50,
    currency: 'NGN',
    searchKey: '',
  });

  const { allProjectsData, loading, refetchAllProjects } = useProjects(params);

  const projectData = useMemo(
    () => allProjectsData?.data || [],
    [allProjectsData?.data],
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [takeATour, setTakeATour] = useState(true);
  const [addProject, setAddProject] = useState(true);
  const [addProjectForm, setAddProjectForm] = useState(true);

  const [deleteForm, setDeleteForm] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  // ✅ per-row loader state
  const [navigatingRowId, setNavigatingRowId] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // ✅ reset row loader when route changes (navigation completes)
  useEffect(() => {
    setNavigatingRowId(null);
  }, [pathname]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }));
  }, [pagination]);

  const handleParamChange = (param: Partial<ProjectQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...param,
      pageNumber: 1,
    }));
  };

  const handleAddProjectClick = () => {
    dispatch(resetProject());
    setAddProject(!addProject);
  };

  const handleProjectFormClick = () => {
    setAddProject(!addProject);
    setAddProjectForm(!addProjectForm);
  };

  const handleTakeTourClick = () => {
    setTakeATour(!takeATour);
  };

  const handleProjectFormClose = () => {
    dispatch(resetProject());
    setAddProjectForm(!addProjectForm);
  };

  const onDelete = (id: string) => {
    setDeleteProjectId(id);
    setDeleteForm(!deleteForm);
  };

  const handleDeleteProject = () => {
    setDeleteForm(!deleteForm);
  };

  // ✅ row click with per-row loader
  const handleRowClick = useCallback(
    (row: { id: string }) => {
      // prevent re-clicking same row while navigating
      if (navigatingRowId) return;

      setNavigatingRowId(row.id);
      router.push(`/creatives/dashboard/project-management/${row.id}`);
    },
    [router, navigatingRowId],
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projectData.forEach((project: any) => {
      router.prefetch(`/creatives/dashboard/project-management/${project.id}`);
    });
  }, [projectData, router]);

  const columns = [
    {
      header: 'Project name',
      accessorKey: 'title',
      // ✅ show spinner inside project name for clicked row
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const project = row.original;
        const isRowLoading = navigatingRowId === project.id;

        return (
          <div className="flex items-center gap-2">
            <span className={isRowLoading ? 'opacity-60' : ''}>
              {project.title}
            </span>
            {isRowLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        );
      },
    },
    {
      header: 'Project Type',
      accessorKey: 'type',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const typeValue = row.original.type;
        return <div>{projectTypeMap[typeValue] || 'Unknown'}</div>;
      },
    },
    {
      header: 'Due date',
      accessorKey: 'expectedDeliveryDate',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => formatDate(row.original.expectedDeliveryDate),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const value = row.original.priority;
        return (
          <div>
            <Label type="priority" value={value} showIcon />
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const value = row.original.status;
        return (
          <div>
            <Label type="status" value={value} />
          </div>
        );
      },
    },
    {
      header: '',
      accessorKey: 'actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const project = row.original;
        const isRowLoading = navigatingRowId === project.id;

        return (
          <div className="app_table__tbody__td__ctt flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!!navigatingRowId || isRowLoading}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
            >
              <BinGray className="h-4 w-4" />
            </Button>

            {project.type === 1 && (
              <Link
                href={`/creatives/dashboard/project-management/personal-project/${project.id}/edit`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!!navigatingRowId || isRowLoading}
                >
                  <EditPencilGray className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <RenderIf condition={!addProject}>
        <AnimatedModal
          isOpen={!addProject}
          from="middle"
          onClose={handleAddProjectClick}
          className="sm:max-w-[450px] h-[420px] p-0 mx-7 lg:mx-0"
        >
          <CreateProjectCard
            item={createAProject}
            handleProject={handleProjectFormClick}
            handleClick={handleAddProjectClick}
            onClose={handleAddProjectClick}
          />
        </AnimatedModal>
      </RenderIf>

      <RenderIf condition={!addProjectForm}>
        <AnimatedModal
          isOpen={!addProjectForm}
          from="right"
          onClose={handleProjectFormClose}
          className="lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7"
        >
          <AddProject onClose={handleProjectFormClose} />
        </AnimatedModal>
      </RenderIf>

      {false && (
        <RenderIf condition={takeATour}>
          <AnimatedModal
            isOpen={takeATour}
            from="middle"
            onClose={handleTakeTourClick}
            className="sm:max-w-[300px] h-[420px] p-0 mx-7 lg:mx-0"
          >
            <TakeATour item={viewTakeATour} handleClick={handleTakeTourClick} />
          </AnimatedModal>
        </RenderIf>
      )}

      <RenderIf condition={deleteForm}>
        <AnimatedModal
          isOpen={true}
          from="middle"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClose={onDelete as any}
          className="sm:max-w-[450px] h-[300px] p-0 mx-7 lg:mx-0"
        >
          {deleteProjectId && (
            <DeleteProject
              projectId={deleteProjectId}
              item={deleteProject}
              handleClick={() => setDeleteForm(false)}
              onClose={handleDeleteProject}
              refetchAllProjects={refetchAllProjects}
            />
          )}
        </AnimatedModal>
      </RenderIf>

      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
          <div className="flex gap-2">
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger>
                  <button type="button" className="app_dashboard_group_header__btn">
                    Project Type <ListFilter size={14} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="app_popover__content">
                  {popoverItems.map((item) => (
                    <button
                      className="app_popover__content__item"
                      key={item.value}
                      onClick={() => {
                        setSelectedCategory(item.value);
                        handleParamChange({
                          type: item.value === 'All' ? undefined : item.value,
                        });
                      }}
                    >
                      {item.label}
                      <RenderIf condition={selectedCategory === item.value}>
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
                    Priority <ListFilter size={14} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="app_popover__content">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {priorityItems.map((item: any) => (
                    <button
                      className="app_popover__content__item"
                      key={item.value}
                      onClick={() => {
                        setSelectedCategory(item.value);
                        handleParamChange({
                          priority: item.value === 'All' ? undefined : item.value,
                        });
                      }}
                    >
                      {item.label}
                      <RenderIf condition={selectedCategory === item.value}>
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
                    Status <ListFilter size={14} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="app_popover__content">
                  {statusItems.map((item) => (
                    <button
                      className="app_popover__content__item"
                      key={item.value}
                      onClick={() => {
                        setSelectedCategory(item.value);
                        handleParamChange({
                          status: item.value === 'All' ? undefined : item.value,
                        });
                      }}
                    >
                      {item.label}
                      <RenderIf condition={selectedCategory === item.value}>
                        <Check />
                      </RenderIf>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2">
            <SearchInput
              placeholder="Search for Project"
              onChange={(e) => handleParamChange({ searchKey: e.target.value })}
            />

            <Button
              type="button"
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

        <div className="app_dashboard_home__task__ctt">
          <Table
            columns={columns}
            data={projectData}
            emptyTitle="No project yet"
            emptyMessage='Click "add project" button to get started'
            pagination={pagination}
            setPagination={setPagination}
            onRowClick={handleRowClick}
            manualPagination={true}
            pageCount={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((allProjectsData?.metaData as any)?.totalPages as number) ?? 1
            }
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}