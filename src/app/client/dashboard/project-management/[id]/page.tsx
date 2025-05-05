'use client';

import { Pill, Calendar, FlagOutline } from '@/components/shared';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DeliverableTable } from '@/components/shared/dashboard/project-management/project-table/deliverable-table';
import clientManagement from '@/lib/assets/client-management';
import { Send, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/shared/client/dashboard/review-modal';
import { Textarea } from '@/components/ui/textarea';

export default function Page () {
  const [progress, setProgress] = useState(10)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  useEffect(() => {
    if (progress >= 100 && !showReviewModal) {
      setShowRatingModal(true)
    }
  }, [progress, showReviewModal])

  const handleNext = () => {
    setShowReviewModal(true)
  }
  const handleCloseModal = () => {
    setShowReviewModal(false)
    setShowRatingModal(false)
  }

  const incrementProgress = () => {
    setProgress((prev) => Math.min(prev + 10, 100))
  }

  return (
        <div className="app_dashboard_page app_dashboard_home">
            <Modal {...{ open: showRatingModal, handleClose: handleCloseModal }}>
                <div className="app_modal__ctt__mid">
                    <h2 className="app_modal__ctt__mid__h2 !text-[21px]">Kindly share your experience with this creative</h2>
                    <div className=''>
                    <p className=''>Rate</p>
                    <div className='flex items-center'>
                    <Star
                        className="h-8 w-8"
                    />
                    <Star
                        className="h-8 w-8"
                    />
                     <Star
                        className="h-8 w-8"
                    />
                     <Star
                        className="h-8 w-8"
                    />
                     <Star
                        className="h-8 w-8"
                    />

                    </div>
                    </div>
                </div>

                <div className="app_modal__ctt__btm">
                    <Button
                        backgroundColor="treva-purple-500"
                        size="xl"
                        color="white"
                        className="w-full mb-4 "
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                    <Button
                        backgroundColor="transparent"
                        color='treva-purple-500'
                        size="xl"
                        className="w-full border border-[#F1F1F1]"
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </Button>
                </div>
            </Modal>

            <Modal {...{ open: showReviewModal, handleClose: handleCloseModal }}>
                <div className="app_modal__ctt__mid">
                    <h2 className="app_modal__ctt__mid__h2 !text-[21px] ">Kindly share your experience with this creative</h2>
                    <p className='text-[#888888]'>Leave a review (Optional)</p>
                    <Textarea
                        placeholder="Share your experience..."
                        // value={review}
                        // onChange={(e) => setReview(e.target.value)}
                        className="min-h-[100px] border border-red-900"
                    />
                </div>

                <div className="app_modal__ctt__btm">
                    <Button
                        backgroundColor="treva-purple-500"
                        size="xl"
                        color="white"
                        className="w-full mb-4"
                        onClick={handleCloseModal}
                    >
                        Submit
                    </Button>
                    <Button
                        backgroundColor="transparent"
                        color='treva-purple-500'
                        size="xl"
                        className="w-full border border-[#F1F1F1]"
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </Button>
                </div>
            </Modal>
            <div className="app_dashboard_home__task app_dashboard_page__px">
                <div className="app_dashboard_home__task__hdr flex items-center justify-between flex-wrap gap-2 mt-4">
                    <div className="flex justify-center items-center">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-xl font-bold">Project Title</h1>
                                <p className='text-[#888888] font-medium mt-3'> Project description</p>
                                <div className='flex items-center gap-3 mt-6  '>
                                    <Image
                                        src={clientManagement?.femaleClient}
                                        className="w-7 h-7 rounded-full  object-cover" alt={''} />
                                    <p className=''>Creative’s name</p>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="flex-shrink-0">
                        <button className=" border border-[#7C3AED] text-[#7C3AED] rounded-full px-4 py-2 flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            <span>Send a message</span>
                        </button>
                    </div>
                </div>

                <div className=" block md:flex md:justify-between w-full">
                    <div className="project_action_group">
                        <div className='flex items-center gap-1 mb-3 md:mb-0 md:gap-2'>
                            <Calendar />
                            Start:
                            <div className="project_action_group__button">Date </div>

                        </div>
                        <div className='flex items-center gap-1 mb-3 md:mb-0 md:gap-2'>
                            <Calendar />
                            End:
                            <div className="project_action_group__button">Date </div>

                        </div>
                        <div className='flex items-center gap-1 mb-3 md:mb-0 md:gap-2'>
                            <FlagOutline />
                            Priority:
                            <div className={'app_table__priority app_table__priority--High project_action_group__button'}>
                                <span className="app_table__priority__dot" />
                                High
                            </div>

                        </div>
                    </div>
                    <div className="md:w-1/4">
                        <div className="app_progress-bar__label">
                            Progress {progress}% <span className="app_progress-bar__label__days-left">Days left</span>
                        </div>
                        <div className="app_progress-bar-track">
                            <div className="app_progress-bar-track-fill" style={{ width: `${progress}%` }} />
                        </div>
                        {/* Demo button to increase progress - remove in production */}
                        <Button onClick={incrementProgress} variant="outline" size="sm" className="mt-2" disabled={progress >= 100}>
                            Increment Progress (Demo)
                        </Button>
                    </div>
                </div>

                <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4 border-[#E7E7E7] border-t border-b">
                    <div className="flex flex-wrap gap-2 border rounded-full border-[#262626] !text-[#262626]">
                        <Pill
                            size="md"
                        >
                            Deliverable
                        </Pill>
                    </div>

                </div>
                <DeliverableTable />
            </div>
        </div>
  );
}
