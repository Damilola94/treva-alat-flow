'use client';
import React, { Fragment, Suspense, useState } from 'react';
import { RenderIf } from '@/components/shared';
import {
  PersonalProjectDeliverables,
  PersonalProjectDetails,
} from '@/components/shared/project-management';
import { ProgressStatus } from '@/components/shared/dashboard/get-started/progress-status copy';
import { useAppDispatch } from '@/store';
import { clearValues } from '@/store/slices/project';

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

export type DefaultValues = ReturnType<() => typeof defaultValues>;

export type InitialStep1Values = ReturnType<() => typeof step1Values>;
export type InitialStep2Values = ReturnType<() => typeof step2Values>;

function PersonalProject() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(defaultValues);
  const [projectId, setProjectId] = useState<string>('');
  const dispatch = useAppDispatch();

  dispatch(clearValues());

  return (
    <Fragment>
      <RenderIf condition={true}>
        <div className="mt-7">
          <div className="flex justify-center items-center gap-4">
            <ProgressStatus
              label="Project details"
              checked={currentStep >= 1}
            />
            <ProgressStatus label="Deliverables" checked={currentStep >= 2} />
          </div>
        </div>

        <RenderIf condition={currentStep === 1}>
          <PersonalProjectDetails
            setProjectId={setProjectId}
            handleNext={(val) => {
              setFormData({
                ...formData,
                step1Values: { ...formData.step1Values, ...val },
              });
              setCurrentStep(2);
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
