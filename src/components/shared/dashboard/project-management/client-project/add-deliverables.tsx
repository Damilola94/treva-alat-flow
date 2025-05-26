'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// import routes from '@/lib/routes';
import {
  AnimatedModal,
  CalendarWithMark,
  Delete,
  EditIcon,
  Money4,
  PlusIcon,
  RenderIf,
} from '@/components/shared';
import { Modal } from '@/components/shared/decisionModal';
import { AddDeliverables } from '@/components/shared/project-management.tsx/add-deliverables';
import { EditDeliverables } from '@/components/shared/project-management.tsx/edit-deliverables';
import { type InitialStep2Values } from '@/app/creatives/dashboard/project-management/client-project/create/page';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
// import { useAppDispatch } from '@/store';
import { useGetDeliverablesQuery } from '@/services';

interface IProps {
  handleNext: (formData: InitialStep2Values) => void;
  projectId: string;
}

interface Deliverable {
  deliverableId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  unitAmount: string;
  unit: string;
  total?: string;
}

export function ProjectDeliverables(props: IProps) {
  const { handleNext, projectId } = props;
  // const dispatch = useAppDispatch();

  const [editForm, setEditForm] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [deliverableId, setDeliverableId] = useState<string>('');
  // const [deleteForm, setDeleteForm] = useState(false);
    // const [deleteDeliverableId, setDeleteDeliverableId] = useState<string | null>(
    //   null,
    // );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDeliverable, setSelectedDeliverable] =
    useState<Deliverable | null>(null);
  const { data: deliverablesData, isLoading, refetch} = useGetDeliverablesQuery({ projectId },{ refetchOnMountOrArgChange: true },);
    
   useEffect(() => {
  if (deliverablesData?.data) {
    setDeliverables(
      deliverablesData.data.map((item) => ({
        deliverableId: item.id ?? '',
        name: item.name ?? '',
        description: item.description ?? '',
        startDate: item.startDate ?? '',
        endDate: item.endDate ?? '',
        unitAmount: item.unitAmount !== undefined && item.unitAmount !== null ? String(item.unitAmount) : '',
        unit: item.unit !== undefined && item.unit !== null ? String(item.unit) : '',
        total: item.total !== undefined && item.total !== null ? String(item.total) : '',
      }))
    );
  }
}, [deliverablesData]);

  
  const handleCloseModal = () => {
    setIsDecisionModalOpen(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddDeliverables = (newDeliverable: Deliverable) => {
    const deliverableWithId = {
      ...newDeliverable,
      deliverableId: newDeliverable.deliverableId || '',
    };
    setDeliverables((prev) => [...prev, deliverableWithId]);
    void refetch();
  };

  const handleDelete = () => {
    if (!deliverableId) {
      console.error('Deliverable ID is undefined. Cannot delete.');
      return;
    }
    setDeliverables((prev) =>
      prev.filter((d) => d.deliverableId !== deliverableId),
    );
    // deleteDeliverables({ projectId, deliverableId });
    setIsDecisionModalOpen(false);
  };

  const onEdit = (id: string) => {
    const deliverableToEdit = deliverables.find((d) => d.deliverableId === id);
    if (!deliverableToEdit) {
      console.error('Cannot find deliverable with ID:', id);
      return;
    }
    setDeliverableId(id);
    setSelectedDeliverable(deliverableToEdit);
    setEditForm(false);
  };

  const handleNextStep = () => {
    const step2Data = {
      deliverables: deliverables.map((d) => ({
        name: d.name,
        description: d.description,
        startDate: d.startDate,
        endDate: d.endDate,
        unitAmount: d.unitAmount,
        unit: d.unit,
      })),
    };
    handleNext(step2Data);
  };

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <AnimatedModal
        {...{
          isOpen: isModalOpen,
          from: 'right',
          onClose: closeModal,
          className:
            'lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7',
        }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <AddDeliverables
          onClose={closeModal}
          projectId={projectId}
          onAddDeliverable={handleAddDeliverables}
          setDeliverableId={setDeliverableId}
        />
      </AnimatedModal>

      <RenderIf condition={!editForm}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'right',
              onClose: onEdit,
              className:
                'lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7',
            }}
          >
            <EditDeliverables
              onClose={() => {
                setEditForm(true);
                setSelectedDeliverable(null);
              }}
              projectId={projectId}
              deliverableId={deliverableId}
              // deliverable={selectedDeliverable}
              onEditDeliverable={(updatedDeliverable) => {
                setDeliverables((prev) =>
                  prev.map((d) =>
                    d.deliverableId === updatedDeliverable.deliverableId
                      ? updatedDeliverable
                      : d,
                  ),
                );
                void refetch();
              }}
            />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        <Modal
          {...{ open: isDecisionModalOpen, handleClose: handleCloseModal }}
        >
          <div className="app_modal__ctt__mid">
            <h2 className="app_modal__ctt__mid__h2">
              Are you sure you want to delete this deliverable?
            </h2>
            <p className="text-[#888888]">
              Deliverable will be deleted Permanently
            </p>
          </div>

          <div className="app_modal__ctt__btm flex gap-4">
            <Button
              backgroundColor="transparent"
              size="xl"
              color="treva-purple-500"
              className="w-full border border-[#F1F1F1]"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              backgroundColor="error-500"
              color="white"
              size="xl"
              className="w-full"
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              // onClick={() => { handleDelete(); }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </Modal>

        <h3 className="app_get_started_professional_details__form__title">
          Deliverables <br />
          <span className="text-[#6D6D6D]">
            Add all deliverables for this project.
          </span>
        </h3>
        <div className="">
          <button
            className="flex gap-3 text-[#7D6CE8]"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <PlusIcon fill="var(--treva-purple-500)" />
            {deliverables.length > 0
              ? 'Add another deliverable'
              : 'Add deliverable'}
          </button>
        </div>
        <div>
          <div>
          {isLoading ? (
            <div className="text-center flex justify-center items-center">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : deliverables.length > 0 ? (
            deliverables.map((deliverable) => (
              <div
                key={deliverable.deliverableId}
                className="border p-4 rounded-md shadow mb-4 flex justify-between items-center bg-[#E7E7E7]"
              >
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold mb-3">{deliverable.name}</h4>
                    <div className="flex gap-4">
                      <EditIcon
                        className="cursor-pointer"
                        fill="#888888"
                        onClick={() => onEdit(deliverable.deliverableId)}
                      />
                      <button
                        onClick={() => {
                         if (!deliverable?.deliverableId) {
                          console.error('Item ID is undefined. Cannot delete.');
                          return;
                        }
                      //  onDelete(deliverable?.deliverableId);
                        // setDeleteDeliverableId(deliverable.deliverableId);
                      }}
                      
                      >
                        <Delete className="cursor-pointer" />
                      </button>
                    </div>
                  </div>
                  <p className="mb-2">{deliverable.description}</p>
                  <p className="flex gap-4 mb-3">
                    <CalendarWithMark fill="#6E50DB" />
                    {formatDate(deliverable.startDate)}
                  </p>
                  <p className="flex gap-4 mb-3">
                    <CalendarWithMark fill="#6E50DB" />
                    {formatDate(deliverable.endDate)}
                  </p>
                  <p className="flex gap-4 mb-3">
                    <Money4 />
                    {deliverable.unit}
                  </p>
                   <p className="flex gap-4 mb-3">
                    <Money4 />
                    {deliverable.unitAmount}
                  </p>
                   <p className="flex gap-4 mb-3">
                    <Money4 />
                    {deliverable.total}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No deliverables added yet.</p>
          )}
        </div>
        </div>
        <div className="pt-4 flex gap-5 text-right">
          <Button
            type="button"
            size="xl"
            backgroundColor="primary-blue-500"
            className="w-full py-3 px-12 "
            onClick={handleNextStep}
            // onClick={handleSkip}
          >
            Save and continue
          </Button>
        </div>
      </div>
    </div>
  );
}
