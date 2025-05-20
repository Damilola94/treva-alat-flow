'use client';

import {
  Calendar,
  FlagOutline,
  CenterModal,
  Label,
  SideModal,
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
import { Input } from '@/components/ui/input';
import { mockComments } from '@/constants';
import { Avatar } from '@/components/shared/avatar';

export default function Page() {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { allProjectsByIdData, loading } = useProjectById(projectId);
  const project = allProjectsByIdData?.data;

  useEffect(() => {
    const progress = allProjectsByIdData?.data?.metrics?.progressPercent;
    if (progress === 100) {
      setShowReviewModal(true);
    }
  }, [allProjectsByIdData?.data?.metrics?.progressPercent]);

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <CenterModal
        headerImageType={2}
        title=""
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
        }}
      >
        <div className="flex flex-col items-center justify-center p-6">
          <div className="mb-6 mt-2 text-center">
            <h2 className="text-[21px] text-[#262626] font-bold">
              Kindly share your experience with this creative
            </h2>
          </div>

          <div className="mb-8 -ml-12 -mr-12">
            <p className="mb-2 text-[#262626] font-bold ">Rate</p>
            <div className="flex items-center justify-between space-x-2 gap-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-10 w-10 cursor-pointer stroke-[1.5px] ${
                    hoveredRating >= star || rating >= star
                      ? 'fill-current text-[#7B37F0]'
                      : 'fill-none text-[#262626]'
                  }`}
                  onMouseEnter={() => {
                    setHoveredRating(star);
                  }}
                  onMouseLeave={() => {
                    setHoveredRating(0);
                  }}
                  onClick={() => {
                    setRating(star);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="w-full space-y-3">
            <Button
              backgroundColor="treva-purple"
              size="xl"
              color="white"
              className="w-full mb-4"
              onClick={() => {
                setShowRatingModal(false);
                setShowReviewModal(true);
              }}
            >
              Next
            </Button>
            <Button
              backgroundColor="transparent"
              color="treva-purple"
              size="xl"
              className="w-full border border-[#F1F1F1]"
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onClick={() => {
                setShowRatingModal(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </CenterModal>

      {/* Review Modal - Second Modal */}
      <CenterModal
        headerImageType={2}
        title=""
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
        }}
      >
        <div className="flex flex-col p-6">
          <div className="mb-6 text-center">
            <h2 className="text-[21px] font-bold text-[#262626]">
              Kindly share your experience with this creative
            </h2>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-sm text-gray-500">
              Leave a review (Optional)
            </p>
            <Textarea
              placeholder="Share your experience..."
              className="min-h-[120px] w-full rounded-md border border-gray-200 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
            />
          </div>

          <div className="w-full space-y-3">
            <Button
              backgroundColor="treva-purple"
              size="xl"
              color="white"
              className="w-full mb-4"
              onClick={() => {
                setShowReviewModal(false);
              }}
            >
              Submit
            </Button>
            <Button
              backgroundColor="transparent"
              color="treva-purple"
              size="xl"
              className="w-full border border-[#F1F1F1] cursor-pointer"
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onClick={() => {
                setShowReviewModal(false);
              }}
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
          <div className="w-full flex justify-between px-3 py-1 bg-[#F6F6F6] border border-[#E7E7E7] rounded-full">
            <Input
              name="comment"
              type="text"
              id="comment"
              placeholder="Add a comment"
              className="w-full"
            />
             <Button size="icon" variant="ghost" className='bg-[#7C3AED] '>
            <Send className="h-5 w-5  text-white" />
          </Button>
          </div>
        }
      >
         <div className="flex flex-col space-y-6 p-1">
        {mockComments.map((comment) => (
          <div key={comment.id} className={`flex gap-3 rounded-lg p-3 ${
                comment.author.isClient
                  ? "bg-[#EEE4FF] border border-[#EEE4FF]"
                  : "bg-[#CCFFFF] border border-[#CCFFFF]"
              } `}>
            <Avatar
              size="sm"
              className="h-8 w-8 rounded-full bg-muted"
              src={comment.author.avatar || "/placeholder.svg"}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {comment.author.isClient ? (
                    <span className="text-blue-600">{comment.author.name}</span>
                  ) : (
                    <span className="text-purple-600">{comment.author.name}</span>
                  )}
                </p>
                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
              </div>
              <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      </SideModal>

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
              <div className="md:w-1/4">
                <div className="app_progress-bar__label">
                  Progress{' '}
                  {allProjectsByIdData?.data?.metrics?.progressPercent ?? 0}%{' '}
                  <span className="app_progress-bar__label__days-left">
                    {allProjectsByIdData?.data?.metrics?.daysLeftDisplay ??
                      'Days left'}
                  </span>
                </div>
                <div className="app_progress-bar-track">
                  <div
                    className="app_progress-bar-track-fill"
                    style={{
                      width: `${
                        allProjectsByIdData?.data?.metrics?.progressPercent ?? 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4 border-[#E7E7E7] border-t border-b">
              <div className="border rounded-full border-[#262626] !text-[#262626] py-2 px-4">
                Deliverables
              </div>
            </div>
            <DeliverableTable />
          </div>
        )
      )}
    </div>
  );
}
