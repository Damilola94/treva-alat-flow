'use client';
import { Fragment, useEffect, useState } from 'react';
import { EditProject } from './edit-project';
import { EditDeliverables } from '@/components/shared/project-management.tsx/edit-deliverables';
import queries from '@/services/queries/projects';
import { RenderIf } from '@/components/shared/render-if';
import { AnimatedModal } from '@/components/shared/modal';
import { ProjectType } from '@/services/queries/projects/enums';

interface IProps {
  projectId: string;
  setProjectId: (id: string) => void;
  onClose: () => void;
  onProceedToDeliverables: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleNext: (val: any) => void;
}

interface Deliverable {
  deliverableId: string;
  deliverableName: string;
  description: string;
  startDate: string;
  dueDate: string;
  amount: string;
}

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
  projectType: ProjectType.PersonalProject,
};

const step2Values = {
  deliverableName: '',
  description: '',
  startDate: '',
  dueDate: '',
  amount: '',
};

const defaultValues = {
  step1Values,
  step2Values,
};

export type DefaultValues = ReturnType<() => typeof defaultValues>;

export type InitialStep1Values = ReturnType<() => typeof step1Values>;
export type InitialStep2Values = ReturnType<() => typeof step2Values>;

export function ProjectEditor({ projectId, setProjectId }: IProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(defaultValues);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [deliverableId, setDeliverableId] = useState<string>('');
  const [editForm, setEditForm] = useState(true);

  const onEdit = () => {
    setEditForm(!editForm);
  };

  const { data, refetch } = queries.readDeliverables(
    { projectId },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (newData: any) => {
        setDeliverables(newData);
      },
    },
  );

  useEffect(() => {
    if (data) {
      setDeliverables(data);
    }
  }, [data]);

  const handleProceedToDeliverables = () => {
    setCurrentStep(2);
  };

  const handleEditDeliverable = (newDeliverable: Deliverable) => {
    setDeliverables((prev) => [...prev, newDeliverable]);
    void refetch();
    // setStep("deliverables")
  };
  return (
    <Fragment>
      <RenderIf condition={currentStep === 1}>
        <EditProject
          id={projectId}
          onClose={onEdit}
          onProceedToDeliverables={handleProceedToDeliverables}
          item={projectId}
          handleClick={() => {
            setEditForm(false);
          }}
          setProjectId={setProjectId}
          setDeliverableId={setDeliverableId}
          handleNext={(val) => {
            setFormData({
              ...formData,
              step1Values: { ...formData.step1Values, ...val },
            });
            setCurrentStep(2);
          }}
          onAddDeliverable={handleEditDeliverable}
        />
      </RenderIf>

      <RenderIf condition={currentStep === 2}>
        <AnimatedModal
          isOpen={true}
          from="right"
          onClose={onEdit}
          className="absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2"
        >
          <EditDeliverables
            projectId={projectId}
            deliverableId={deliverableId}
            onClose={onEdit}
            onEditDeliverable={handleEditDeliverable}
          />
        </AnimatedModal>
      </RenderIf>
    </Fragment>
  );

  // onClose={() => setStep("project")}
}
