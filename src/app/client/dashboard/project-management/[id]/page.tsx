// app/(client)/dashboard/projects/[id]/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Send, Star } from 'lucide-react';

import {
  Calendar,
  FlagOutline,
  CenterModal,
  Label,
  SideModal,
  Check,
  MiniLoader,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/shared/avatar';
import { ProjectProgressBar } from '@/components/shared/dashboard/progressbar';

import clientManagement from '@/lib/assets/client-management';

import { useProjectById, useDeliverable } from '@/hooks/Projects';
import { useComment } from '@/hooks/Projects/useProjects';

import { useCreateCommentMutation } from '@/services/projectService/comment';
import {
  errorToast,
  successToast,
  useCreateRateProjectMutation,
  useUpdateProjectMutation,
} from '@/services';
import { getErrorMessage } from '@/utils';
import Success from '@/app/assets/pngs/success.png';
import { statusEnum } from '@/constants';
import { DeliverableTable } from '@/components/shared/client/dashboard/project-management/deliverable-table';

type Deliverable = {
  id: string;
  name: string;
  description?: string;
  endDate?: string;
  unit?: number;
  unitAmount?: number;
  total?: number;
  status: number;
};

function toStatusCode(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    const asNum = Number(trimmed);
    if (!Number.isNaN(asNum) && Number.isFinite(asNum)) return asNum;

    if (trimmed in statusEnum) {
      return statusEnum[
        trimmed as keyof typeof statusEnum
      ] as unknown as number;
    }

    return undefined;
  }

  return undefined;
}

function toStatusLabel(value: unknown): string {
  const code = toStatusCode(value);
  if (typeof code === 'number') return statusEnum[code] ?? `Unknown(${code})`;
  if (typeof value === 'string' && value.trim()) return value;
  return 'Unknown';
}

export default function Page() {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;

  const {
    allProjectsByIdData,
    loading: projectLoading,
    refetchAllProjectsById,
  } = useProjectById(projectId);

  const { allCommentsData, refetchAllComments } = useComment(projectId);

  const { allDeliverablesData, loading: deliverablesLoading } =
    useDeliverable(projectId);

  const [triggerComment, { isLoading: loadingComment }] =
    useCreateCommentMutation();
  const [createRating, { isLoading: ratingLoading }] =
    useCreateRateProjectMutation();
  const [updateProject, { isLoading: updatingProject }] =
    useUpdateProjectMutation();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');
  const [review, setReview] = useState('');
  const [revisionRequestDescription, setRevisionRequestDescription] =
    useState('');

  const project = allProjectsByIdData?.data;
  const commentDetails = allCommentsData?.data;

  const projectStatusCode = useMemo(
    () => toStatusCode(project?.status),
    [project?.status],
  );
  const projectStatusLabel = useMemo(
    () => toStatusLabel(project?.status),
    [project?.status],
  );

  // const deliverables: Deliverable[] = useMemo(() => {
  //   const raw = allDeliverablesData?.data;
  //   return allDeliverablesData?.isSuccess && Array.isArray(raw) ? raw : [];
  // }, [allDeliverablesData]);

  const deliverables: Deliverable[] = useMemo(() => {
  const raw = allDeliverablesData?.data;
  return allDeliverablesData?.isSuccess && Array.isArray(raw)
    ? (raw as unknown as Deliverable[])
    : [];
}, [allDeliverablesData]);

  // const deliverableStatusSummary = useMemo(() => {
  //   return deliverables.map((d) => {
  //     const code = toStatusCode(d.status);
  //     return {
  //       id: d.id,
  //       rawStatus: d.status,
  //       rawType: typeof d.status,
  //       code,
  //       label: toStatusLabel(d.status),
  //       isCompleted: code === statusEnum.Completed,
  //     };
  //   });
  // }, [deliverables]);

 
  const areAllDeliverablesCompleted = useMemo(() => {
    if (deliverables.length === 0) return false;
    return deliverables.every(
      (d) => toStatusCode(d.status) === statusEnum.Completed,
    );
  }, [deliverables]);

  const shouldShowConfirmCompletion = useMemo(() => {
    if (!areAllDeliverablesCompleted) return false;
    if (projectStatusCode == null) return false; 
    return projectStatusCode !== statusEnum.Completed;
  }, [areAllDeliverablesCompleted, projectStatusCode]);

  const autoOpenedRef = useRef(false);
  useEffect(() => {
    if (shouldShowConfirmCompletion && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      setShowConfirmModal(true);
    }
  }, [shouldShowConfirmCompletion]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await triggerComment({ content, projectId });
      setContent('');
      refetchAllComments();
    } catch {
      errorToast('Failed to create comment');
    }
  };

  // const handleProjectConfirmation = async () => {
  //   try {
  //     const response = await updateProject({
  //       projectId,
  //       body: { status: statusEnum.Completed },
  //     }).unwrap();

  //     setShowConfirmModal(false);
  //     setShowRatingModal(true);
  //     refetchAllProjectsById();

  //     const responseStatusCode = toStatusCode(response?.data?.status);
  //     if (response?.isSuccess && responseStatusCode === statusEnum.Completed) {
  //       successToast('Project completed');
  //     } else {
  //       errorToast(response?.message || 'Failed to update status to completed');
  //     }
  //   } catch (error) {
  //     errorToast(getErrorMessage(error) || 'Something went wrong');
  //   }
  // };

  const handleProjectConfirmation = async () => {
  try {
    const response = await updateProject({
      projectId,
      body: { status: statusEnum.Completed },
    }).unwrap();

    const responseStatusCode = toStatusCode(response?.data?.status);

    if (response?.isSuccess && responseStatusCode === statusEnum.Completed) {
      successToast('Project completed');

      // ✅ wait for query to update UI
      await refetchAllProjectsById();

      setShowConfirmModal(false);
      setShowRatingModal(true);
      return;
    }

    errorToast(response?.message || 'Failed to update status to completed');
  } catch (error) {
    errorToast(getErrorMessage(error) || 'Something went wrong');
  }
};
  const handleProjectRevision = async () => {
    const trimmed = revisionRequestDescription.trim();
    if (!trimmed) {
      errorToast('Please describe what needs revision');
      return;
    }

    try {
      const response = await updateProject({
        projectId,
        body: {
          status: statusEnum.RequestingRevision,
          revisionRequestDescription: trimmed,
        },
      }).unwrap();

      setShowRevisionModal(false);
      setShowConfirmModal(false);
      refetchAllProjectsById();

      const responseStatusCode = toStatusCode(response?.data?.status);
      if (
        response?.isSuccess &&
        responseStatusCode === statusEnum.RequestingRevision
      ) {
        successToast('Revision sent successfully');
      } else {
        errorToast(response?.message || 'Failed to request revision');
      }
    } catch (error) {
      errorToast(getErrorMessage(error) || 'Something went wrong');
    }
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      errorToast('Please select a rating');
      return;
    }

    try {
      const response = await createRating({
        rating,
        review,
        projectId,
        ProjectId: projectId,
      });

      successToast(response?.data?.message || 'Project rated');
      setShowRatingModal(false);
    } catch (error) {
      errorToast(getErrorMessage(error) || 'Something went wrong');
    }
  };

  const isBusy = projectLoading;

  return (
    <div className="app_dashboard_page app_dashboard_home">
      {/* Rating Modal */}
      <CenterModal
        headerImageType={2}
        title=""
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      >
        <div className="flex flex-col items-center justify-center p-6">
          <div className="mb-6 mt-2 text-center">
            <h2 className="text-[21px] mb-4 text-[#262626] font-bold">
              Project Completed
            </h2>
            <p>
              The project <strong>&apos;{project?.title}&apos;</strong> has been
              successfully completed.
            </p>
          </div>

          <div className="my-6 w-full">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-10 w-10 cursor-pointer stroke-[1.5px] ${
                    hoveredRating >= star || rating >= star
                      ? 'fill-current text-[#7B37F0]'
                      : 'fill-none text-[#262626]'
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="w-full my-6">
            <p className="mb-2 text-sm text-gray-500">
              Leave a review (Optional)
            </p>
            <Textarea
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full rounded-md border border-gray-200 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
            />
          </div>

          <div className="w-full flex items-center gap-5">
            <Button
              backgroundColor="treva-purple"
              size="xl"
              color="white"
              className="w-full"
              onClick={handleRatingSubmit}
              isLoading={ratingLoading}
            >
              Submit
            </Button>
            <Button
              backgroundColor="transparent"
              color="treva-purple"
              size="xl"
              className="w-full border border-[#F1F1F1]"
              onClick={() => setShowRatingModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </CenterModal>

      {/* Comments Side Modal */}
      <SideModal
        usebg
        isOpen={commentModal}
        onClose={() => setCommentModal(false)}
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
              disabled={isBusy}
              wordCount={{ limit: 1000, current: content.length }}
            />
            <Button
              size="md"
              className="bg-[#7C3AED] hover:bg-[#7C3AED] focus:bg-[#7C3AED] active:bg-[#7C3AED] absolute right-3 top-8 -translate-y-1/2"
              type="submit"
              disabled={isBusy || !content.trim()}
              onClick={handleSubmitComment}
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
        }
      >
        {loadingComment ? (
          <div className="text-center flex justify-center items-center">
            <MiniLoader message="loading" />
          </div>
        ) : (
          <div className="flex flex-col space-y-6 p-1">
            {commentDetails && commentDetails.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              commentDetails.map((comment: any) => (
                <div
                  key={comment.id}
                  className={`flex gap-3 rounded-lg p-3 ${
                    comment.user?.id === project?.clientUser?.id
                      ? 'bg-[#EEE4FF] border border-[#EEE4FF]'
                      : 'bg-[#CCFFFF] border border-[#CCFFFF]'
                  }`}
                >
                  <Avatar
                    size="sm"
                    className="h-8 w-8 rounded-full bg-muted"
                    src={comment.user?.avatar || clientManagement.femaleClient}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        <span className="text-blue-600">
                          {comment.user?.firstName ||
                            comment.user?.lastName ||
                            'User'}
                        </span>
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {comment.createdDate
                          ? new Date(comment.createdDate).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )
                          : ''}
                      </span>
                    </div>
                    <p
                      className="mt-1 text-sm text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: String(comment.content || '').replace(
                          /\n/g,
                          '<br />',
                        ),
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400">No comments yet.</div>
            )}
          </div>
        )}
      </SideModal>

      {/* Confirm Completion Modal */}
      <CenterModal
        headerImageType={0}
        title=""
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        showFooter
        footerChildren= {
          <div className="flex gap-5 w-full items-center">
            <button 
            onClick={() => setShowRevisionModal(true)}
            className='border text-[12px] border-[#F1F1F1] text-[#7B37F0] rounded-full w-full font-bold p-3 '
            >
              Request Revision
            </button>
            <button
            className='bg-[#7B37F0] text-[12px] text-white rounded-full w-full font-bold py-3 px-4'
            onClick={handleProjectConfirmation}
            >
              Confirm Completion
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center p-6 mx-auto">
          <div className="mb- text-center flex flex-col items-center gap-4">
            <Image
              src={Success}
              alt="Success"
              className="w-[78px]"
              unoptimized
            />
            <h2 className="text-[18px] font-bold text-[#262626]">
              Confirm Project Completion
            </h2>
            <p className="text-[#888888]">
              By confirming, you acknowledge that the creative has completed the
              project to your satisfaction.
            </p>
          </div>
        </div>
      </CenterModal>

      {/* Revision Modal */}
      <CenterModal
        headerImageType={2}
        title=""
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
      >
        <div className="flex flex-col items-center justify-center p-6">
          <div className="mb-6 text-center">
            <h2 className="text-[21px] font-bold text-[#262626] mb-4">
              Request Revision
            </h2>
            <p>Tell the creative what needs to be changed.</p>

            <Textarea
              placeholder="Explain what needs to be revised..."
              value={revisionRequestDescription}
              onChange={(e) => setRevisionRequestDescription(e.target.value)}
            />
          </div>

          <div className="w-full flex items-center gap-4">
            <Button
              backgroundColor="transparent"
              size="xl"
              color="treva-purple"
              className="w-full border border-[#F1F1F1]"
              onClick={() => {
                setShowRevisionModal(false);
                setShowConfirmModal(true);
              }}
            >
              Cancel
            </Button>

            <Button
              backgroundColor="treva-purple"
              color="white"
              size="xl"
              className="w-full"
              isLoading={updatingProject}
              onClick={handleProjectRevision}
            >
              Request Revision
            </Button>
          </div>
        </div>
      </CenterModal>

      {projectLoading ? (
        <div className="text-center flex justify-center items-center">
          <MiniLoader message="loading" />
        </div>
      ) : (
        project && (
          <div className="app_dashboard_home__task app_dashboard_page__px">
            <div className="app_dashboard_home__task__hdr flex items-center justify-between flex-wrap gap-2 mt-4">
              <div className="flex justify-center items-center">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-xl font-bold">
                      {project.title || 'Project Title'}
                    </h1>
                    <p className="text-[#888888] font-medium mt-3">
                      {project.description || 'Project description'}
                    </p>

                    <div className="flex items-center gap-3 mt-6">
                      <Image
                        src={
                          project.creativeUser?.profilePicture ||
                          clientManagement.femaleClient
                        }
                        className="w-7 h-7 rounded-full object-cover"
                        alt=""
                        width={28}
                        height={28}
                        unoptimized
                      />
                      <p>
                        {project.creativeUser
                          ? `${project.creativeUser.firstName} ${project.creativeUser.lastName}`
                          : "Creative's name"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  className="border border-[#7C3AED] text-[#7C3AED] rounded-full px-4 py-2 flex items-center gap-2"
                  onClick={() => setCommentModal(true)}
                >
                  <Send className="h-4 w-4" />
                  <span>Write a comment</span>
                </button>
              </div>
            </div>

            <div className="block md:flex md:justify-between w-full">
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

              {projectStatusCode != null &&
              (projectStatusCode === statusEnum.AwaitingClientConfirmation ||
                projectStatusCode === statusEnum.Completed) ? (
                <p className="text-muted">{projectStatusLabel}</p>
              ) : (
                <ProjectProgressBar
                  percent={
                    allProjectsByIdData?.data?.metrics?.progressPercent ?? 0
                  }
                  daysLeft={
                    allProjectsByIdData?.data?.metrics?.daysLeftDisplay ??
                    'days left'
                  }
                />
              )}
            </div>

            <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4 border-[#E7E7E7] border-t border-b">
              <div className="border rounded-full border-[#262626] !text-[#262626] py-2 px-4">
                Deliverables
              </div>
            </div>

            <DeliverableTable
              deliverables={deliverables}
              loading={deliverablesLoading}
            />

            {shouldShowConfirmCompletion && (
              <div className="flex justify-center mt-6">
                <Button
                  size="xl"
                  isLoading={deliverablesLoading}
                  className="border border-[#7B37F0] text-[#7B37F0]"
                  onClick={() => setShowConfirmModal(true)}
                >
                  <Check />
                  Mark Project Completed
                </Button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
