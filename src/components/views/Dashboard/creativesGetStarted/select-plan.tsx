'use client'
import { ProgressStatus } from '@/components/shared/dashboard/get-started'
import PricingCards from '@/components/shared/dashboard/get-started/price-card'

export default function SelectPlan () {
  // const onSubmit = () => {};

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
       <div
        className="flex items-center gap-4 overflow-x-auto px-2 md:px-0 
                        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                        snap-x snap-mandatory md:justify-center"
      >
        <ProgressStatus label="Profile Setup" className="snap-start shrink-0" />
        <ProgressStatus
          label="BVN Verification"
          className="snap-start shrink-0"
        />
        <ProgressStatus
          label="NIN verification"
          className="snap-start shrink-0"
        />
        <ProgressStatus
          label="Address verification"
          className="snap-start shrink-0"
        />
        
        <ProgressStatus label="Select plan" checked  className="snap-start shrink-0" />
        <ProgressStatus label="Finish" className="snap-start shrink-0" />
      </div>

        <div className="">
          <div className="flex flex-col gap-8">
            <div className="flex gap-2">
              <PricingCards/>
            </div>
          </div>
      </div>
    </div>
  )
}
