'use client'

import { Pill, Calendar, FlagOutline, CenterModal } from '@/components/shared'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import clientManagement from '@/lib/assets/client-management'
import { Send, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DeliverableTable } from '@/components/shared/client/dashboard/project-management/deliverable-table'

export default function Page () {
    const [progress, setProgress] = useState(10)
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)

    useEffect(() => {
        if (progress >= 100 && !showReviewModal) {
            setShowRatingModal(true)
        }
    }, [progress, showReviewModal])

    const incrementProgress = () => {
        setProgress((prev) => Math.min(prev + 10, 100))
    }

    return (
        <div className="app_dashboard_page app_dashboard_home">
            {/* Rating Modal - First Modal */}
            <CenterModal
                headerImageType={2}
                title=""
                isOpen={showRatingModal}
                onClose={() => {
                    setShowRatingModal(false)
                }}
            >
                <div className="flex flex-col items-center justify-center p-6">
                    <div className="mb-6 mt-2 text-center">
                        <h2 className="text-[21px] text-[#262626] font-bold">Kindly share your experience with this creative</h2>
                    </div>

                    <div className="mb-8 -ml-12 -mr-12">
                        <p className="mb-2 text-[#262626] font-bold ">Rate</p>
                        <div className="flex items-center justify-between space-x-2 gap-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-10 w-10 cursor-pointer stroke-[1.5px] ${hoveredRating >= star || rating >= star ? 'fill-current text-[#7B37F0]' : 'fill-none text-[#262626]'
                                        }`}
                                    onMouseEnter={() => { setHoveredRating(star); }}
                                    onMouseLeave={() => { setHoveredRating(0); }}
                                    onClick={() => { setRating(star); }}
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
                                setShowRatingModal(false)
                                setShowReviewModal(true)
                            }}
                        >
                            Next
                        </Button>
                        <Button
                        backgroundColor="transparent"
                        color='treva-purple'
                        size="xl"
                        className="w-full border border-[#F1F1F1]"
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        onClick={() => {
                            setShowRatingModal(false)
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
                    setShowReviewModal(false)
                }}
            >
                <div className="flex flex-col p-6">
                    <div className="mb-6 text-center">
                        <h2 className="text-[21px] font-bold text-[#262626]">Kindly share your experience with this creative</h2>
                    </div>

                    <div className="mb-6">
                        <p className="mb-2 text-sm text-gray-500">Leave a review (Optional)</p>
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
                        onClick={() => { setShowReviewModal(false); }
                        }
                    >
                            Submit
                        </Button>
                        <Button
                        backgroundColor="transparent"
                        color='treva-purple'
                        size="xl"
                        className="w-full border border-[#F1F1F1] cursor-pointer"
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        onClick={() => {
                            setShowReviewModal(false)
                        }}
                    >
                            Cancel
                        </Button>
                    </div>
                </div>
            </CenterModal>

            <div className="app_dashboard_home__task app_dashboard_page__px">
                <div className="app_dashboard_home__task__hdr flex items-center justify-between flex-wrap gap-2 mt-4">
                    <div className="flex justify-center items-center">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-xl font-bold">Project Title</h1>
                                <p className="text-[#888888] font-medium mt-3"> Project description</p>
                                <div className="flex items-center gap-3 mt-6  ">
                                    <Image
                                        src={clientManagement?.femaleClient || '/placeholder.svg'}
                                        className="w-7 h-7 rounded-full  object-cover"
                                        alt=''
                                        width={28}
                                        height={28}
                                    />
                                    <p className="">Creative&apos;s name</p>
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
                        <div className="flex items-center gap-1 mb-3 md:mb-0 md:gap-2">
                            <Calendar />
                            Start:
                            <div className="project_action_group__button">Date </div>
                        </div>
                        <div className="flex items-center gap-1 mb-3 md:mb-0 md:gap-2">
                            <Calendar />
                            End:
                            <div className="project_action_group__button">Date </div>
                        </div>
                        <div className="flex items-center gap-1 mb-3 md:mb-0 md:gap-2">
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
                        <Pill size="md">Deliverable</Pill>
                    </div>
                </div>
                <DeliverableTable />
            </div>
        </div>
    )
}
