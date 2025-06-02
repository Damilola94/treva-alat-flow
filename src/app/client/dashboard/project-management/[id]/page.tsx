'use client';

import {
  Calendar,
  FlagOutline,
  CenterModal,
  Label,
  SideModal,
  Check,
} from '@/components/shared';
import { Loader2, Send, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DeliverableTable } from '@/components/shared/client/dashboard/project-management/deliverable-table';
import { useProjectById } from '@/hooks/Projects';
import Image from 'next/image';
import clientManagement from '@/lib/assets/client-management';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar } from '@/components/shared/avatar';
import { useComment } from '@/hooks/Projects/useProjects';
import { useCreateCommentMutation } from '@/services/projectService/comment';
import {
  errorToast,
  successToast,
  useCreateRateProjectMutation,
  useUpdateProjectMutation,
} from '@/services';
import { getErrorMessage } from '@/utils';
import { ProjectProgressBar } from '@/components/shared/dashboard/progressbar';
import { statusEnum } from '@/constants';

export default function Page() {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;

  // const {  }

  const { allProjectsByIdData, loading, refetchAllProjectsById } =
    useProjectById(projectId);
  const { allCommentsData, refetchAllComments } = useComment(projectId);
  const [triggerComment, { isLoading: loadingComment }] =
    useCreateCommentMutation();
  const [createRating, { isLoading }] = useCreateRateProjectMutation();
  const [updateProject, { isLoading: sending }] = useUpdateProjectMutation();

  const [showModal, setShowModal] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await triggerComment({ content, projectId });
      setContent('');
      refetchAllComments();
    } catch (error) {
      errorToast('Failed to create comment:');
    }
  };

  const handleProjectConfirmation = async () => {
    try {
      const response = await updateProject({
        projectId,
        body: {
          status: 4,
        },
      }).unwrap();
      setShowRatingModal(true);
      setShowModal(false);
      refetchAllProjectsById();

      // if (response?.isSuccess && response?.data?.status === 4) {
      if (response?.isSuccess && response?.data?.status === statusEnum[4]) {
        successToast('Project completed');
      } else {
        errorToast(response?.message || 'Failed to update status to revision');
      }
    } catch (error) {
      errorToast(getErrorMessage(error) || 'Something went wrong');
    }
  };

  const handleProjectRevision = async () => {
    try {
      const response = await updateProject({
        projectId,
        body: {
          status: 10,
          revisionRequestDescription: revisionRequestDescription.trim(),
        },
      }).unwrap();

      console.log('Update response:', response);

      setShowRevisionModal(false);
      setShowModal(false);
      refetchAllProjectsById();

      // if (response?.isSuccess && response?.data?.status === 10) {
      if (response?.isSuccess && response?.data?.status === statusEnum[10]) {
        successToast('Revision sent Successfully');
      } else {
        errorToast(response?.message || 'Failed to update status to revision');
      }
    } catch (error) {
      errorToast(getErrorMessage(error) || 'Something went wrong');
    }
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      return errorToast('Something went wrong');
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
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const progress = allProjectsByIdData?.data?.metrics?.progressPercent;
    if (progress === 100) {
    }
  }, [allProjectsByIdData?.data?.metrics?.progressPercent]);

  return (
    <div className="app_dashboard_page app_dashboard_home">
      {/* Combined Rating + Review Modal */}
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

          {/* Rating */}
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

          {/* Review */}
          <div className="w-full my-6">
            <p className="mb-2 text-sm text-gray-500">
              Leave a review (Optional)
            </p>
            <Textarea
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[] w-full rounded-md border border-gray-200 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
            />
          </div>

          {/* Submit */}
          <div className="w-full flex items-center gap-5">
            <Button
              backgroundColor="treva-purple"
              size="xl"
              color="white"
              className="w-full"
              onClick={() => {
                handleRatingSubmit();
              }}
              isLoading={isLoading}
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

      {/* comment modal */}
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
                    comment.user.id === project?.clientUser?.id
                      ? 'bg-[#EEE4FF] border border-[#EEE4FF]'
                      : 'bg-[#CCFFFF] border border-[#CCFFFF]'
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
                    <p
                      className="mt-1 text-sm text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: comment.content.replace(/\n/g, '<br />'),
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

      {/* project completion modal */}
      <CenterModal
        headerImageType={4}
        title=""
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <div className="flex flex-col items-center justify-center p-6">
          <div className="mb-6 text-center">
            <h2 className="text-[21px] font-bold text-[#262626] mb-4">
              Confirm Project Completion
            </h2>
            <p>
              By confirming, you acknowledge that the creative has completed the
              project to your satisfaction.
            </p>
          </div>

          <div className="w-full flex items-center gap-5 ">
            <Button
              backgroundColor="transparent"
              size="xl"
              color="treva-purple"
              className=" border border-[#F1F1F1]"
              onClick={() => {
                setShowRevisionModal(true);
              }}
            >
              Request Revision
            </Button>
            <Button
              backgroundColor="treva-purple"
              color="white"
              size="xl"
              className=""
              isLoading={sending}
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onClick={() => {
                handleProjectConfirmation();
              }}
            >
              Confirm Completion
            </Button>
          </div>
        </div>
      </CenterModal>

      {/* project revision */}
      <CenterModal
        headerImageType={2}
        title=""
        isOpen={showRevisionModal}
        onClose={() => {
          setShowRevisionModal(false);
        }}
      >
        <div className="flex flex-col items-center justify-center p-6">
          <div className="mb-6 text-center">
            <h2 className="text-[21px] font-bold text-[#262626] mb-4">
              Request Revision
            </h2>
            <p>Tell the creative what needs to be changed.</p>
            {/* <Textarea
              placeholder="Enter revision notes (optional)"
              value={revisionRequestDescription}
              onChange={(e) => setRevisionRequestDescription(e.target.value)}
              className="mt-4 w-full border border-gray-200 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
            /> */}
            <Textarea
              placeholder="Explain what needs to be revised..."
              value={revisionRequestDescription}
              onChange={(e) => setRevisionRequestDescription(e.target.value)}
            />
          </div>

          <div className="w-full flex items-center ">
            <Button
              backgroundColor="transparent"
              size="xl"
              color="treva-purple"
              className="w-full border border-[#F1F1F1]"
              onClick={() => {
                setShowModal(true);
                setShowRevisionModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              backgroundColor="treva-purple"
              color="white"
              size="xl"
              className="w-full"
              isLoading={sending}
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onClick={() => {
                handleProjectRevision();
                // setShowRevisionModal(false);
                // setShowModal(false);
              }}
            >
              Request Revision
            </Button>
          </div>
        </div>
      </CenterModal>
      {loading ? (
        <div className="text-center flex justify-center items-center">
          <Loader2 size={18} className="animate-spin" />
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
                          clientManagement?.femaleClient
                        }
                        className="w-7 h-7 rounded-full object-cover"
                        alt=""
                        width={28}
                        height={28}
                      />
                      <p className="">
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
              <ProjectProgressBar
                percent={
                  allProjectsByIdData?.data?.metrics?.progressPercent ?? 0
                }
                daysLeft={
                  statusEnum[Number(project?.status)] !== 'Completed'
                    ? allProjectsByIdData?.data?.metrics?.daysLeftDisplay ??
                      'Days left'
                    : undefined
                }
                text={
                  statusEnum[Number(project?.status)] === 'Completed'
                    ? 'Completed'
                    : 'undefined'
                }
              />
            </div>

            <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4 border-[#E7E7E7] border-t border-b">
              <div className="border rounded-full border-[#262626] !text-[#262626] py-2 px-4">
                Deliverables
              </div>
            </div>
            <DeliverableTable />
            <div className="flex justify-center">
              <Button
                size="xl"
                isLoading={loading}
                // backgroundColor="primary-blue-500"
                className="border border-[#7B37F0] text-[#7B37F0] "
                onClick={() => setShowModal(true)}
              >
                <Check />
                Mark Project Completed
              </Button>
            </div>
            {/* )} */}
          </div>
        )
      )}
    </div>
  );
}
