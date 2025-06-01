'use client';
import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { RenderIf } from '@/components/shared';
import {
  PersonalProjectDeliverables,
  PersonalProjectDetails,
} from '@/components/shared/project-management';
import { ProgressStatus } from '@/components/shared/dashboard/get-started/progress-status copy';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSearchParams } from 'next/navigation';
import { setCurrentStep, storeValues } from '@/store/slices/project';

const step1Values = {
  title: '',
  description: '',
  expectedDeliveryDate: '',
  type: 'Personal',
};

const step2Values = {
  name: '',
  description: '',
  startDate: '',
  dueDate: '',
};

const defaultValues = {
  step1Values,
  step2Values,
};
interface FormDataType {
  step1Values: typeof step1Values;
  step2Values: typeof step2Values;
}

export type DefaultValues = ReturnType<() => typeof defaultValues>;

export type InitialStep1Values = ReturnType<() => typeof step1Values>;
export type InitialStep2Values = ReturnType<() => typeof step2Values>;

function PersonalProject() {
  const searchParams = useSearchParams();
  const paramsProjectId = searchParams.get('projectId');

  const dispatch = useAppDispatch();
  const currentStep = useAppSelector((state) => state.project.currentStep);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState(defaultValues);
  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    if (paramsProjectId) {
      setProjectId(paramsProjectId);
    }
  }, [paramsProjectId]);

  const handleNext = (
    step: 1 | 2,
    data: Partial<FormDataType[keyof FormDataType]>,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [`step${step}Values`]: {
        ...prevData[`step${step}Values` as keyof FormDataType],
        ...data,
      },
    }));
    dispatch(storeValues(data));
    const nextStepNumber = step + 1;
    dispatch(setCurrentStep(nextStepNumber));
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      dispatch(setCurrentStep(stepNumber));
    }
  };

  return (
    <Fragment>
      <RenderIf condition={true}>
        <div className="mt-7">
          <div className="flex justify-center items-center gap-4">
            <ProgressStatus
              label="Project details"
              checked={currentStep >= 1 }
              onClick={() => handleStepClick(1)}
            />
            <ProgressStatus label="Deliverables" checked={currentStep >= 2} onClick={() => handleStepClick(2)}/>
          </div>
        </div>

        <RenderIf condition={currentStep === 1}>
          <PersonalProjectDetails
            setProjectId={setProjectId}
            handleNext={(data) => {
              handleNext(1, data);
              dispatch(storeValues(data));
            }}
          />
        </RenderIf>

        <RenderIf condition={currentStep === 2}>
          <PersonalProjectDeliverables projectId={projectId} key={projectId} />
        </RenderIf>
      </RenderIf>
    </Fragment>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PersonalProject />
    </Suspense>
  );
}
