'use client';

import {
  Pill,
  AnimatedModal,
  Calendar,
  FlagOutline,
  Label,
  Comment,
  SideModal,
  RenderIf,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Select } from '@/components/shared/select';
import projectManagement from '@/lib/assets/project-management';
import Image from 'next/image';
import { CreateTaskCard } from '@/components/shared/project-management';
import { useParams } from 'next/navigation';
import { TaskTable } from '@/components/shared/dashboard/project-management/project-table/task-table';
import { DeliverableTable } from '@/components/shared/dashboard/project-management/project-table/deliverable-table';
import { PaymentTable } from '@/components/shared/dashboard/project-management/project-table/payment-table';
import { useProjectById } from '@/hooks/Projects';
import { Loader2, Send } from 'lucide-react';
import { useComment } from '@/hooks/Projects/useProjects';
import { useCreateCommentMutation } from '@/services/projectService/comment';
import { Avatar } from '@/components/shared/avatar';
import { Textarea } from '@/components/ui/textarea';
import clientManagement from '@/lib/assets/client-management';
import { ProjectProgressBar } from '@/components/shared/dashboard/progressbar';
import { EditTaskCard } from '@/components/shared/dashboard/project-management/personal-project/edit-task';
import { DeleteTask } from '@/components/shared/dashboard/project-management/project-table/delete-task';

type TabType = 'task' | 'deliverables' | 'payment';

const options = [
  { value: 'table', label: 'Table' },
  { value: 'grid', label: 'Grid' },
];

const deleteTask = {
  img: projectManagement.topImage,
  title: 'Are you sure you want to delete this task',
  details: 'Task record will be deleted Permanently',
  btnText1: 'Cancel',
  btnText2: 'Delete',
};

export default function Page() {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;

  const [activeTab, setActiveTab] = useState<TabType>('deliverables');
  const [viewType, setViewType] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedDeliverableId, setSelectedDeliverableId] =
    useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deliverableId, setDeliverableId] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [deleteForm, setDeleteForm] = useState(false);
  const [content, setContent] = useState('');
  const [commentModal, setCommentModal] = useState(false);

  const { allProjectsByIdData, loading, refetchAllProjectsById } =
    useProjectById(projectId);
  const { allCommentsData, refetchAllComments } = useComment(projectId);
  const [triggerComment, { isLoading: loadingComment }] =
    useCreateCommentMutation();

  const project = allProjectsByIdData?.data;
  const commentDetails = allCommentsData?.data;

  const handleAddTask = () => {
    setModalType('create');
    setIsModalOpen(true);
    setSelectedTaskId('');
  };

  const handleEditTask = (taskId: string) => {
    setModalType('edit');
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleDeleteTask = () => {
    setDeleteForm(!deleteForm);
  };

  const onDelete = (id: string) => {
    setSelectedTaskId(id);
    setDeleteForm(!deleteForm);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleViewChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setViewType(selectedOption.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await triggerComment({ content, projectId });
      setContent('');
      refetchAllComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const tabs: TabType[] = ['deliverables', 'task'];
  if (Number(project?.type) === 2) {
    tabs.push('payment');
  }

  useEffect(() => {
    const progress = allProjectsByIdData?.data?.metrics?.progressPercent;
    if (progress === 100) {
    }
  }, [allProjectsByIdData?.data?.metrics?.progressPercent]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex  gap-12">
          <div
            className="flex justify-center items-center"
            style={{ minHeight: 200 }}
          >
            <span className="txxx_loader" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <AnimatedModal
        isOpen={isModalOpen}
        from="right"
        onClose={closeModal}
        className="absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2"
      >
        {modalType === 'create' ? (
          <CreateTaskCard
            onClose={closeModal}
            projectId={projectId}
            setDeliverableId={setDeliverableId}
          />
        ) : (
          <EditTaskCard
            onClose={closeModal}
            projectId={projectId}
            setDeliverableId={setDeliverableId}
            deliverableId={selectedDeliverableId}
            taskId={selectedTaskId}
          />
        )}
      </AnimatedModal>

      <RenderIf condition={deleteForm}>
        <AnimatedModal
          isOpen={true}
          from="middle"
          onClose={onDelete}
          className="sm:max-w-[450px] h-[300px] p-0 mx-7 lg:mx-0"
        >
          {selectedTaskId && (
            <DeleteTask
              projectId={projectId}
              deliverableId={deliverableId}
              taskId={selectedTaskId}
              item={deleteTask}
              handleClick={() => {
                setDeleteForm(false);
              }}
              onClose={handleDeleteTask}
              refetchAllTasks={refetchAllProjectsById}
            />
          )}
        </AnimatedModal>
      </RenderIf>

      <SideModal
        usebg
        isOpen={commentModal}
        onClose={() => {
          setCommentModal(false);
        }}
        title="Comments"
        showFooter
        footerChildren={
          <div className="w-full relative px-3 py-1 bg-[#F6F6F6] border border-[#E7E7E7]">
            <Textarea
              name="comment"
              id="comment"
              placeholder="Add a comment"
              className="w-[90%] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              wordCount={{
                limit: 1000,
                current: content.length,
              }}
            />
            <Button
              size="md"
              className="bg-[#7C3AED] hover:bg-[#7C3AED] focus:bg-[#7C3AED] active:bg-[#7C3AED] absolute right-3 top-8 -translate-y-1/2"
              type="submit"
              disabled={loading || !content.trim()}
              onClick={handleSubmit}
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
        }
      >
        {loadingComment ? (
          <div className="text-center flex justify-center items-center">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col space-y-6 p-1">
            {commentDetails && commentDetails.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              commentDetails.map((comment: any) => (
                <div
                  key={comment.id}
                  className={`flex gap-3 rounded-lg p-3 ${
                    comment.user.id === project?.creativeUser?.id
                      ? 'bg-[#EEE4FF] border border-[#EEE4FF]'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <Avatar
                    size="sm"
                    className="h-8 w-8 rounded-full bg-muted"
                    src={comment.user.avatar || clientManagement.femaleClient}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {comment.user ? (
                          <span className="text-blue-600">
                            {comment.user.firstName}
                          </span>
                        ) : (
                          <span className="text-purple-600">
                            {comment.user.lastName}
                          </span>
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {comment.createdDate
                          ? new Date(comment.createdDate).toLocaleTimeString(
                              [],
                              { hour: '2-digit', minute: '2-digit' },
                            )
                          : ''}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400">No comments yet.</div>
            )}
          </div>
        )}
      </SideModal>

      {project && (
        <div className="app_dashboard_home__task app_dashboard_page__px !bg-white border border-[#E7E7E7]">
          <div className="app_dashboard_home__task__hdr flex items-center justify-between flex-wrap gap-2 mt-4">
            <div className="flex justify-center items-center">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold">{project.title}</h1>
                  <p className="text-[#888888] font-medium mt-5">
                    {project?.description}
                  </p>
                </div>
              </div>
              {false && (
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
              )}
            </div>

            <div className="flex-shrink-0">
              <Button
                size="md"
                onClick={() => {
                  setCommentModal(true);
                }}
                backgroundColor="primary-blue-500"
                className="app_auth_login__btn flex items-center gap-2"
              >
                <Comment />
                Add Comment
              </Button>
            </div>
          </div>

          <div className="my-4 block md:flex md:justify-between w-full">
            {/* <ButtonGroup /> */}
            <div className="project_action_group">
              <div className="flex items-center gap-1 mb-3 md:mb-0 md:gap-2">
                <Calendar />
                Start:
                <div className="project_action_group__button">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : ''}
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3 md:mb-0 md:gap-2">
                <Calendar />
                End:
                <div className="project_action_group__button">
                  {project.expectedDeliveryDate
                    ? new Date(
                        project.expectedDeliveryDate,
                      ).toLocaleDateString()
                    : ''}
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3 md:mb-0 md:gap-2">
                <FlagOutline />
                Priority:
                <Label
                  type="priority"
                  value={project?.priority || 'Low'}
                  showIcon
                  size="md"
                  className="project_action_group__button"
                />
              </div>
            </div>
            <ProjectProgressBar
              percent={allProjectsByIdData?.data?.metrics?.progressPercent ?? 0}
              daysLeft={
                allProjectsByIdData?.data?.metrics?.daysLeftDisplay ??
                'Days left'
              }
            />
          </div>
        </div>
      )}

      <div className="app_dashboard_home__task app_dashboard_page__px !bg-white border border-[#E7E7E7]">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Pill
                key={tab}
                size="md"
                active={activeTab === tab}
                onClick={() => {
                  setActiveTab(tab as TabType);
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Pill>
            ))}
          </div>

          <div className="flex gap-2">
            {activeTab === 'task' && (
              <Select
                options={options}
                placeholder="View"
                onChange={handleViewChange}
                className="w-full sm:w-auto"
              />
            )}
          </div>
        </div>
      </div>
      <div className="app_dashboard_page__px mt-10">
        {activeTab === 'task' && (
          <TaskTable
            viewType={viewType}
            onAddTask={handleAddTask}
            deliverableId={selectedDeliverableId}
            onUpdateTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
        {activeTab === 'deliverables' && (
          <DeliverableTable
            refetchProject={refetchAllProjectsById}
            onDeliverableClick={(deliverableId) => {
              setSelectedDeliverableId(deliverableId);
              setActiveTab('task');
            }}
          />
        )}
        {activeTab === 'payment' && <PaymentTable />}
      </div>
    </div>
  );
}
