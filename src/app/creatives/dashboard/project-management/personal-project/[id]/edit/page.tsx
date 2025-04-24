'use client'
import { useState } from 'react'
import { ProgressStatus } from '@/components/shared/dashboard/get-started/progress-status'
import { RenderIf } from '@/components/shared'
import { useParams } from 'next/navigation'
import { EditProjectDetails } from '@/components/shared/dashboard/project-management/personal-project/edit-project-details'
import { EditProjectDeliverables } from '@/components/shared/dashboard/project-management/personal-project/edit-project-deliverables'

export default function EditPersonalProject () {
  const [currentStep, setCurrentStep] = useState(1)
  const { id } = useParams()

  return (
    <div className="mt-7">
      <div className="flex justify-center items-center gap-4 mb-8">
        <ProgressStatus label="Project details" checked={currentStep >= 1} />
        <ProgressStatus label="Deliverables" checked={currentStep >= 2} />
      </div>

      <RenderIf condition={currentStep === 1}>
        <EditProjectDetails projectId={id as string} handleNext={() => { setCurrentStep(2); }} />
      </RenderIf>

      <RenderIf condition={currentStep === 2}>
        <EditProjectDeliverables projectId={id as string} />
      </RenderIf>
    </div>
  )
}
