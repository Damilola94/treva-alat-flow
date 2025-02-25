'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// import routes from '@/lib/routes';
import { AnimatedModal, CalendarWithMark, Delete, EditIcon, Money4, PlusIcon, RenderIf } from '@/components/shared';
import { Modal } from '@/components/shared/decisionModal';
import { AddDeliverables } from '@/components/shared/project-management.tsx/add-deliverables';
import { EditDeliverables } from '@/components/shared/project-management.tsx/edit-deliverables';
import queries from '@/services/queries/projects';
import { type InitialStep2Values } from '@/app/dashboard/project-management/client-project/create/page'
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';

interface IProps {
  handleNext: (formData: InitialStep2Values) => void
  projectId: string
}

interface Deliverable {
  deliverableId: string
  deliverableName: string
  description: string
  startDate: string
  dueDate: string
  amount: string
}

export function ProjectDeliverables (props: IProps) {
  const { handleNext, projectId } = props
  const router = useRouter();
  const [editForm, setEditForm] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [deliverableId, setDeliverableId] = useState<string>('');

  const { data, refetch } = queries.readDeliverables({ projectId }, {
    onSuccess: (newData: any) => {
      setDeliverables(newData);
    }
  });
  const { mutate: deleteDeliverables } = queries.deleteDeliverables({ projectId, deliverableId },
    {
      onSuccess: () => {
        setDeliverables(data)
        void refetch()
      }
    })

  useEffect(() => {
    if (data) {
      setDeliverables(data);
    }
  }, [data])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const handleCloseModal = () => {
    setIsDecisionModalOpen(false)
  }
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddDeliverables = (newDeliverable: Deliverable) => {
    setDeliverables((prev) => [...prev, newDeliverable]);
    void refetch();
  };

  const handleDelete = () => {
    setDeliverables(prev => prev.filter(d => d.deliverableId !== deliverableId));
    deleteDeliverables({ projectId, deliverableId });
    setIsDecisionModalOpen(false);
  };

  const onEdit = () => {
    setEditForm(!editForm);
  };

  const handleSkip = () => {
    router.push(routes.dashboard.projectManagement.path);
  };

  const handleNextStep = () => {
    // Prepare the data to pass to the next step
    const step2Data = {
      deliverables: deliverables.map(d => ({
        deliverableName: d.deliverableName,
        description: d.description,
        startDate: d.startDate,
        dueDate: d.dueDate,
        amount: d.amount
      }))
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
                        'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2'
                }}
            >
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <AddDeliverables onClose={closeModal} projectId={projectId} onAddDeliverable={handleAddDeliverables} setDeliverableId={setDeliverableId} />
            </AnimatedModal>

            <RenderIf condition={!editForm}>
                <Fragment>
                    <AnimatedModal
                        {...{
                          isOpen: true,
                          from: 'right',
                          onClose: onEdit,
                          className:
                                'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2'
                        }}
                    >
                        <EditDeliverables onClose={onEdit} projectId={projectId} deliverableId={deliverableId} onAddDeliverable={handleAddDeliverables} />
                    </AnimatedModal>
                </Fragment>
            </RenderIf>

            <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
                <Modal {...{ open: isDecisionModalOpen, handleClose: handleCloseModal }}>
                    <div className="app_modal__ctt__mid">
                        <h2 className="app_modal__ctt__mid__h2">Are you sure you want to delete this deliverable?</h2>
                        <p className='text-[#888888]'>Deliverable will be deleted Permanently</p>
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
                            color='white'
                            size="xl"
                            className="w-full"
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            onClick={() => { handleDelete(); }}
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
                        onClick={() => { setIsModalOpen(true); }}
                    >
                        <PlusIcon fill="var(--treva-purple-500)" />
                        {deliverables.length > 0 ? 'Add another deliverable' : 'Add deliverable'}
                    </button>
                </div>
                <div>
                    {deliverables.map((item, index) => (
                        <>
                            <div
                                key={index}
                                className="border p-4 rounded-md shadow mb-4 flex justify-between items-center bg-[#E7E7E7] "
                            >
                                <div>
                                    <div className='flex items-center gap-60'>
                                        <h4 className="font-semibold mb-3">{item.deliverableName}</h4>
                                        <div className="flex gap-4">
                                            <EditIcon
                                                className="cursor-pointer"
                                                fill='#888888'
                                                onClick={onEdit} />
                                            <button
                                                onClick={() => {
                                                  setDeliverableId(item.deliverableId);
                                                  setIsDecisionModalOpen(true);
                                                }}
                                            >
                                                <Delete className="cursor-pointer" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className='mb-2'>{item.description}</p>
                                    <p className='flex gap-4 mb-3 '>
                                        <CalendarWithMark fill='#6E50DB' />
                                        {item.startDate}
                                    </p>
                                    <p className='flex gap-4 mb-3'>
                                        <CalendarWithMark fill='#6E50DB' />
                                        {item.dueDate}
                                    </p>
                                    <p className='flex gap-4'>
                                        <Money4 stroke='#6E50DB' /> {item.amount}
                                    </p>
                                </div>
                            </div>
                        </>
                    ))}
                    {deliverables.length > 0 && (
                        <div className='mt-10 text-[#262626] '>
                            <p className='flex justify-between mb-2'>Total deliverables: <span>2</span></p>
                            <p className='flex justify-between mb-2'>Timeline <span>{'{Month day, year} - {Month day, year} {number of days}'}</span></p>
                            <p className='flex justify-between mb-2'>Sub Total: <span>NGN 200,000.00</span></p>
                            <p className='flex justify-between'>Total <span className='font-bold'>NGN 200,000.00</span></p>
                        </div>

                    )}

                </div>
                <div className="pt-4 flex gap-5">
                    <Button
                        type="button"
                        size="xl"
                        backgroundColor="primary-blue-500"
                        className="w-full py-3 px-12"
                        onClick={handleNextStep}
                        // onClick={handleSkip}
                    >
                        Save and continue
                    </Button>
                    <Button
                        type="button"
                        size="xl"
                        backgroundColor="primary-blue-500"
                        className="w-full py-3 px-12"
                        onClick={handleSkip}
                    >
                        Close
                    </Button>
                </div>

            </div>
        </div>
  );
}
