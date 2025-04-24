'use client'
import { ProgressStatus } from '@/components/shared/dashboard/get-started'
import PricingCards from '@/components/shared/dashboard/get-started/price-card'

export default function Page () {
  // const onSubmit = () => {};

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Professional details" checked />
        <ProgressStatus label="Social media details" checked />
        <ProgressStatus label="Bio" checked />
        <ProgressStatus label="Select plan" active />
        <ProgressStatus label="Finish" />
        {/* <ProgressStatus label="Team setup" /> */}
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
