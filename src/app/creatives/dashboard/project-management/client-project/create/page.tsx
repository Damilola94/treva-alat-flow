/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Fragment, Suspense, useEffect, useState } from 'react';
import { RenderIf } from '@/components/shared';
import { ProgressStatus } from '@/components/shared/dashboard/get-started/progress-status copy';
import { ProjectDetails } from '@/components/shared/dashboard/project-management/client-project/add-details';
import { ProjectDeliverables } from '@/components/shared/dashboard/project-management/client-project/add-deliverables';
import { ProjectPaymentSchedule } from '@/components/shared/dashboard/project-management/client-project/add-payment-schedule';
import { ProjectAgreement } from '@/components/shared/dashboard/project-management/client-project/add-agreement';
import { ProjectReview } from '@/components/shared/dashboard/project-management/client-project/review';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProjectPayment from '@/components/shared/dashboard/project-management/client-project/payment';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setCurrentStep,
  storeValues,
  previousStep,
} from '@/store/slices/project';

const step1Values = {
  title: '',
  description: '',
  expectedDeliveryDate: '',
  priority: '',
  type: 'Client',
};

const step2Values = {
  deliverables: [
    {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      unitAmount: '',
      unit: '',
    },
  ],
};

const step3Values = {
  extraCost: [
    {
      name: '',
      description: '',
      amount: '',
    },
  ],
};

const step4Values = {
  paymentSchedule: [
    {
      amount: '',
      dueDate: '',
    },
  ],
};

const step5Values = {
  agreement: [
    {
      // projectId: "",
      documentUrl: '',
    },
  ],
};

const defaultValues = {
  step1Values,
  step2Values,
  step3Values,
  step4Values,
  step5Values,
};

interface FormDataType {
  step1Values: typeof step1Values;
  step2Values: typeof step2Values;
  step3Values: typeof step3Values;
  step4Values: typeof step4Values;
  step5Values: typeof step5Values;
}

export type DefaultValues = ReturnType<() => typeof defaultValues>;
export type InitialStep1Values = ReturnType<() => typeof step1Values>;

export interface InitialStep2Values {
  deliverables: Array<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    unitAmount: string;
    unit: string;
  }>;
}

export interface InitialStep3Values {
  extraCost: Array<{
    name: string;
    description: string;
    amount: string;
  }>;
}

export interface InitialStep4Values {
  paymentSchedule: Array<{
    amount: string;
    dueDate: string;
  }>;
}

export interface InitialStep5Values {
  agreement: Array<{
    // projectId: string
    documentUrl: string;
  }>;
}

export interface InitialStep6Values {
  review: Array<{
    projectId: string;
    termsAndConditions: false;
  }>;
}

function ClientProject() {
  const searchParams = useSearchParams();
  const paramsProjectId = searchParams.get('projectId');

  const dispatch = useAppDispatch();
  const currentStep = useAppSelector((state) => state.project.currentStep);
  const { projectId: projectIdStore} = useAppSelector((state) => state?.project);
  
  const [projectId, setProjectId] = useState<string>('');
  const [, setFormData] = useState<FormDataType>(defaultValues);

  useEffect(() => {
    if (paramsProjectId) {
      setProjectId(paramsProjectId);
    }
     const savedStep = localStorage.getItem(`project-${paramsProjectId}-step`);
    if (savedStep) {
      dispatch(setCurrentStep(Number(savedStep)));
    }
  }, [paramsProjectId]);

  const handleNext = (
    step: 1 | 2 | 3 | 4 | 5 | 6,
    data: Partial<FormDataType[keyof FormDataType]>,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [`step${step}Values`]: {
        ...prevData[`step${step}Values` as keyof FormDataType],
        ...data,
      },
    }));
    dispatch(storeValues({...data, projectId}));
    const nextStepNumber = step + 1;
    dispatch(setCurrentStep(nextStepNumber));

  localStorage.setItem(`project-${projectId}-step`, nextStepNumber.toString());
  };

  const handlePrevious = () => {
    dispatch(previousStep());
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      dispatch(setCurrentStep(stepNumber));
    }else {
     dispatch(setCurrentStep(stepNumber));
    }
  };



  const steps = [
    {
      label: 'Project details',
      Component: ProjectDetails,
    },
    {
      label: 'Deliverables',
      Component: ProjectDeliverables,
    },
    {
      label: 'Payment',
      Component: ProjectPayment,
    },
    {
      label: 'Billing schedule',
      Component: ProjectPaymentSchedule,
    },
    {
      label: 'Agreement',
      Component: ProjectAgreement,
    },
    {
      label: 'Review',
      Component: ProjectReview,
    },
  ];

    return (
    <Fragment>
      {/* Mobile Step Indicator */}
      <div className="lg:hidden flex items-center justify-between my-4 mx-4">
        {currentStep > 1 && (
          <button onClick={handlePrevious} className="p-2 text-black">
            <ArrowLeft />
          </button>
        )}

        <p className="text-sm font-medium bg-[#7B37F00D] text-[#7B37F0] rounded px-3 py-1 w-fit">
          {currentStep} of 6
        </p>
      </div>

      <RenderIf condition={true}>
        <div className="mt-7">
          <div className="lg:flex lg:justify-center lg:items-center lg:gap-4 hidden">
            {steps.map((step, index) => (
              <>
              {
                projectIdStore ?
                <ProgressStatus
                  key={step.label}
                  label={step.label}
                  checked={currentStep >= index + 1}
                  onClick={() => handleStepClick(index + 1)}
                  className='cursor-pointer'
                />  
                : 
                <ProgressStatus
                  key={step.label}
                  label={step.label}
                  checked={currentStep >= index + 1}
                  onClick={() => handleStepClick(index + 1)}
                  className={
                    currentStep >= index + 1
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed opacity-50'
                  }
                /> 
              }
              </>
            ))}
          </div>
        </div>

        <RenderIf condition={currentStep === 1}>
          <ProjectDetails
            setProjectId={setProjectId}
            handleNext={(data) => {
              handleNext(1, data);
              dispatch(storeValues(data));
            }}
          />
        </RenderIf>

        <RenderIf condition={currentStep === 2}>
          <ProjectDeliverables
            projectId={projectId}
            key={projectId}
            handleNext={(data) => {
              handleNext(2, data);
              dispatch(storeValues(data));
            }}
          />
        </RenderIf>

        <RenderIf condition={currentStep === 3}>
          <ProjectPayment
            projectId={projectId}
            key={projectId}
            handleNext={(data) => {
              handleNext(3, data);
              dispatch(storeValues(data));
            }}
            deliverables={[]}
          />
        </RenderIf>

        <RenderIf condition={currentStep === 4}>
          <ProjectPaymentSchedule
            projectId={projectId}
            key={projectId}
            handleNext={(data) => {
              handleNext(4, data);
              dispatch(storeValues(data));
            }}
          />
        </RenderIf>

        <RenderIf condition={currentStep === 5}>
          <ProjectAgreement
            projectId={projectId}
            key={projectId}
            handleNext={(data) => {
              handleNext(5, data);
              dispatch(storeValues(data));
            }}
          />
        </RenderIf>

        <RenderIf condition={currentStep === 6}>
          <ProjectReview projectId={projectId} key={projectId} />
        </RenderIf>
      </RenderIf>
    </Fragment>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ClientProject />
    </Suspense>
  );
}
