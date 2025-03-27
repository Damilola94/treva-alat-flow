'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// import routes from '@/lib/routes';
import { AnimatedModal, CalendarWithMark, Delete, EditIcon, Money4, PlusIcon, RenderIf } from '@/components/shared';
import { Modal } from '@/components/shared/decisionModal';
import queries from '@/services/queries/projects';
import { type InitialStep3Values } from '@/app/dashboard/project-management/client-project/create/page'
import AddPayment from '../../../project-management.tsx/add-payment';
import routes from '@/lib/routes';
import EditPayment from '@/components/shared/project-management.tsx/edit-payment';
import { formatDate } from '@/lib/utils';

interface IProps {
  handleNext: (formData: InitialStep3Values) => void
  projectId: string
}

interface Payment {
  paymentId: string
  amountPercentage: string
  dueDate: string
  reminderFrequency: string
  totalDueDate?: string
  installments?: string
  totalPaymentAmount?: string
  amount?: string
}

export function ProjectPayment (props: IProps) {
  const { handleNext, projectId } = props
  const [editForm, setEditForm] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [payment, setPayment] = useState<Payment[]>([]);
  const [paymentId, setPaymentId] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const { data, refetch } = queries.readPayment({ projectId }, {
    onSuccess: (newData: any) => {
      if (Array.isArray(newData)) {
        const validPayment = newData.map((item) => {
          return {
            ...item,
            deliverableId: item.deliverableId || item.id || ''
          }
        })
        setPayment(validPayment)
      } else {
        setPayment([])
      }
    }
  });

  const { mutate: deletePayment } = queries.deletePayment({ },
    {
      onSuccess: () => {
        void refetch()
      }
    })

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        const validPayment = data.map((item) => ({
          ...item,
          paymentId: item.paymentId || item.id || ''
        }))
        setPayment(validPayment)
      }
    }
  }, [data])

  const handleCloseModal = () => {
    setIsDecisionModalOpen(false)
  }
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddPayment = (newPayment: Payment) => {
    const paymentWithId = {
      ...newPayment,
      paymentId: newPayment.paymentId || ''
    }
    setPayment((prev) => [...prev, paymentWithId]);
    void refetch()
  };

  const handleDelete = () => {
    setPayment((prev) => prev.filter((d) => d.paymentId !== paymentId));
    deletePayment({
      projectId,
      // eslint-disable-next-line object-shorthand
      paymentId: paymentId
    });
    setIsDecisionModalOpen(false);
  };

  const onEdit = (id: string) => {
    const paymentToEdit = payment.find((d) => d.paymentId === id)
    if (!paymentToEdit) {
      console.error('Cannot find deliverable with ID:', id)
      return
    }
    setPaymentId(id)
    setSelectedPayment(paymentToEdit)
    setEditForm(false)
  };

  const handleSkip = () => {
    window.location.href = routes.dashboard.projectManagement.path;
  };

  const handleNextStep = () => {
    const step3Data = {
      payment: payment.map(d => ({
        amountPercentage: d.amountPercentage,
        dueDate: d.dueDate,
        reminderFrequency: d.reminderFrequency
      }))
    };
    handleNext(step3Data);
  };

  return (
        <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
            <AnimatedModal
                {...{
                  isOpen: isModalOpen,
                  from: 'right',
                  onClose: closeModal,
                  className:
                        'lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7'
                }}
            >
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <AddPayment onClose={closeModal} projectId={projectId} onAddPayment={handleAddPayment} setPaymentId={setPaymentId}/>
            </AnimatedModal>

            <RenderIf condition={!editForm}>
                <Fragment>
                    <AnimatedModal
                        {...{
                          isOpen: true,
                          from: 'right',
                          onClose: onEdit,
                          className:
                                'lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7'
                        }}
                    >
                        <EditPayment onClose={() => {
                          setEditForm(true)
                          setSelectedPayment(null)
                        }} projectId={projectId} paymentId={paymentId}
                        payment={selectedPayment}
                        onEditPayment={(updatedPayment) => {
                          setPayment((prev) =>
                            prev.map((d) => (d.paymentId === updatedPayment.deliverableId ? updatedPayment : d))
                          )
                          void refetch()
                        }} />
                    </AnimatedModal>
                </Fragment>
            </RenderIf>

            <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
                <Modal {...{ open: isDecisionModalOpen, handleClose: handleCloseModal }}>
                    <div className="app_modal__ctt__mid">
                        <h2 className="app_modal__ctt__mid__h2">Are you sure you want to delete this payment?</h2>
                        <p className='text-[#888888]'>Payment will be deleted Permanently</p>
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
                            onClick={ handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </Modal>

                <h3 className="app_get_started_professional_details__form__title">
                    Payment <br />
                    <span className="text-[#6D6D6D] text-sm">
                    Setup how you want to be paid.
                    </span>
                </h3>
                <div className="">
                    <button
                        className="flex gap-3 text-[#7D6CE8]"
                        onClick={() => { setIsModalOpen(true); }}
                    >
                        <PlusIcon fill="var(--treva-purple-500)" />
                        {payment.length > 0 ? 'Add another payment' : 'Add payment'}
                    </button>
                </div>
                <div>
                    {payment.map((item, index) => (
                        <>
                            <div
                                key={index}
                                className="border p-4 rounded-md shadow mb-4 flex justify-between items-center bg-[#E7E7E7] "
                            >
                                <div>
                                    <div className='flex items-center gap-44 lg:gap-60'>
                                        <h4 className="font-semibold mb-3 flex gap-4">
                                          <p className='text-[#7D6CE8]'>%</p>
                                          {item.amountPercentage}</h4>
                                        <div className="flex gap-4">
                                            <EditIcon
                                                className="cursor-pointer"
                                                fill='#888888'
                                                onClick={() => {
                                                  if (item.paymentId) {
                                                    onEdit(item.paymentId)
                                                  }
                                                }} />
                                            <button
                                                onClick={() => {
                                                  setPaymentId(item.paymentId);
                                                  setIsDecisionModalOpen(true);
                                                }}
                                            >
                                                <Delete className="cursor-pointer" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className='flex gap-4 mb-3'>
                                        <CalendarWithMark fill='#6E50DB' />
                                        {formatDate(item.dueDate)}
                                    </p>
                                    <p className='flex gap-4'>
                                        <Money4 stroke='#6E50DB' /> {item.amount}
                                    </p>
                                    <p className='flex gap-4'>
                                        <Money4 stroke='#6E50DB' /> {item.reminderFrequency}
                                    </p>
                                </div>
                            </div>
                        </>
                    ))}
                {payment.length > 0 && (
  <div className="mt-10 text-[#262626]">
    <p className="flex justify-between mb-2">
      No. of Instalment: <span>{payment[0].installments}</span>
    </p>
    <p className="flex justify-between mb-2">
      Total payment due date: <span>{payment[0].totalDueDate}</span>
    </p>
    <p className="flex justify-between mb-2">
      Sub Total: <span>{payment[0].totalPaymentAmount}</span>
    </p>
    <p className="flex justify-between">
      Total <span className="font-bold">{payment[0].totalPaymentAmount}</span>
    </p>
  </div>
                )}

                </div>
                <div className="pt-4 flex gap-4">
                    <Button
                        type="button"
                        size="xl"
                        backgroundColor="primary-blue-500"
                        className="w-1/2 py-3 px-12"
                        onClick={handleSkip}
                    >
                        skip for now
                    </Button>

                    <Button
                        type="button"
                        size="xl"
                        backgroundColor="primary-blue-500"
                        className="w-1/2 py-3 px-12"
                        onClick={handleNextStep}
                        disabled={payment.length === 0}
                    >
                        Save and continue
                    </Button>
                </div>

            </div>
        </div>
  );
}
