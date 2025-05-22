'use client'
import { CheckCircle } from '@/components/shared'
import { Button } from '@/components/ui/button'
import routes from '@/lib/routes'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Finish () {
  const rt = useRouter();

  const handleNext = () => {
    rt.push(routes.client.dashboard.entry.path);
  }
  
  return (
    <div className="app_get_started_professional_details app_get_started_done py-6 px-4 h-full flex">
      <div className="flex-1 flex flex-col items-center justify-center gap-11">
        <CheckCircle width={58} height={58} />

        <div className="flex flex-col gap-9">
          <p className="app_get_started_done__text">All done</p>

          <div className="">
            <Button
              size="xl"
              backgroundColor="primary-blue-500"
              className="w-full py-3 px-12"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
