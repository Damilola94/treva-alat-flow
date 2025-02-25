'use client'
import React, { Fragment, Suspense, useState } from 'react'
import { RenderIf } from '@/components/shared'
import { ProjectType } from '@/services/queries/projects/enums'
import { ProgressStatus } from '@/components/shared/dashboard/get-started/progress-status copy'
import { ProjectDetails } from '@/components/shared/project-management/client-project/add-details'
import { ProjectDeliverables } from '@/components/shared/project-management/client-project/add-deliverables'
import { ProjectPayment } from '@/components/shared/project-management/client-project/add-payment'
import { ProjectAgreement } from '@/components/shared/project-management/client-project/add-agreement'
import { ProjectReview } from '@/components/shared/project-management/client-project/review'

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

const step1Values = {
  title: '',
  description: '',
  expectedDeliveryDate: '',
  priority: AccountType.Low as `${AccountType}`,
  projectType: ProjectType.PersonalProject
}

// const step2Values = {
//   deliverableName: '',
//   description: '',
//   startDate: '',
//   dueDate: '',
//   amount: ''
// }

const step2Values = {
  deliverables: [
    {
      deliverableName: '',
      description: '',
      startDate: '',
      dueDate: '',
      amount: ''
    }
  ]
};

// const step3Values = {
//   perRequired: '',
//   dueDate: '',
//   reminderFrequency: ''
// }

const step3Values = {
  payment: [
    {
      perRequired: '',
      dueDate: '',
      reminderFrequency: ''
    }
  ]
}

// const step4Values = {
//   agreement: ''
// }

const step4Values = {
  agreement: [{
    projectId: '',
    projectAgreementUrl: ''
  }
  ]
}

const defaultValues = {
  step1Values,
  step2Values,
  step3Values,
  step4Values
}

interface FormDataType {
  step1Values: typeof step1Values
  step2Values: typeof step2Values
  step3Values: typeof step3Values
  step4Values: typeof step4Values
}

export type DefaultValues = ReturnType<() => typeof defaultValues>

export type InitialStep1Values = ReturnType<() => typeof step1Values>
export interface InitialStep2Values {
  deliverables: Array<{
    deliverableName: string
    description: string
    startDate: string
    dueDate: string
    amount: string
  }>
}
export interface InitialStep3Values {
  payment: Array<{
    perRequired: string
    dueDate: string
    reminderFrequency: string
  }>
}

export interface InitialStep4Values {
  agreement: Array<{
    projectId: string
    projectAgreementUrl: string
  }>
}
// export type InitialStep2Values = ReturnType<() => typeof step2Values>
// export type InitialStep3Values = ReturnType<() => typeof step3Values>
// export type InitialStep4Values = ReturnType<() => typeof step4Values>

function ClientProject () {
  const [currentStep, setCurrentStep] = useState(1)
  // const [formData, setFormData] = useState(defaultValues)
  const [formData, setFormData] = useState<FormDataType>(defaultValues);

  const [projectId, setProjectId] = useState<string>('');

  // const handleNext = (step: number, data: any) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [`step${step}Values`]: { ...prevData[`step${step}Values`], ...data }
  //   }));
  //   setCurrentStep(step + 1);
  // };

  const handleNext = (step: 1 | 2 | 3 | 4, data: Partial<FormDataType[keyof FormDataType]>) => {
    setFormData((prevData) => ({
      ...prevData,
      [`step${step}Values`]: {
        ...prevData[`step${step}Values` as keyof FormDataType],
        ...data
      }
    }));
    setCurrentStep(step + 1);
  };

  return (
    <Fragment>
      <RenderIf condition={true}>
        <div className="mt-7">
          <div className="flex justify-center items-center gap-4">
            <ProgressStatus label="Project details" checked={currentStep >= 1} />
            <ProgressStatus label="Deliverables" checked={currentStep >= 2} />
            <ProgressStatus label="Payment" checked={currentStep >= 3} />
            <ProgressStatus label="Agreement" checked={currentStep >= 4} />
            <ProgressStatus label="Review" checked={currentStep >= 5} />

          </div>
        </div>

        <RenderIf condition={currentStep === 1}>
          <ProjectDetails
            setProjectId={setProjectId}
            handleNext={(val) => {
              setFormData({
                ...formData,
                step1Values: { ...formData.step1Values, ...val }
              })
              setCurrentStep(2)
            }}
          />
        </RenderIf>

        <RenderIf condition={currentStep === 2}>
          <ProjectDeliverables
            projectId={projectId}
            key={projectId}
            handleNext={(data) => { handleNext(2, data); }}
          />
        </RenderIf>

        <RenderIf condition={currentStep === 3}>
          <ProjectPayment
            projectId={projectId}
            key={projectId}
            handleNext={(data) => { handleNext(3, data); }}

          />
        </RenderIf>

        <RenderIf condition={currentStep === 4}>
          <ProjectAgreement
            projectId={projectId}
            key={projectId}
            handleNext={(data) => { handleNext(4, data); }}
          />
        </RenderIf>

        <RenderIf condition={currentStep === 5}>
          <ProjectReview
            projectId={projectId}
            key={projectId}
          />
        </RenderIf>
      </RenderIf>
    </Fragment>
  )
}

export default function Page () {
  return (
    <Suspense>
      <ClientProject />
    </Suspense>
  )
}
