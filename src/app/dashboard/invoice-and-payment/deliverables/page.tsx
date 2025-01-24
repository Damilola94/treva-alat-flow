'use client';
import React, { Fragment, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import { AnimatedModal, CalendarWithMark, Delete, EditIcon, Money4, PlusIcon, RenderIf } from '@/components/shared';
import { Modal } from '@/components/shared/decisionModal';
import { AddDeliverables } from '@/components/shared/invoice-and-payment.tsx/add-deliverables';
import { EditDeliverables } from '@/components/shared/invoice-and-payment.tsx/edit-deliverables';

const validationSchema = Yup.object().shape({
  deliverableName: Yup.string().required('Please enter a deliverable name'),
  description: Yup.string().required('Please enter a description'),
  startDate: Yup.date().required('Please select a start date'),
  dueDate: Yup.date().required('Please select a due date'),
  amount: Yup.number()
    .required('Please enter an amount')
    .positive('Amount must be positive')
});

const initialValues = {
  deliverableName: '',
  description: '',
  startDate: '',
  dueDate: '',
  amount: ''
};

const staticDeliverables = [
  {
    deliverableName: '{Deliverable 1}',
    description: 'Description',
    startDate: '{Month day, year}',
    dueDate: '{Month day, year}',
    amount: '{Amount}'
  },
  {
    deliverableName: '{Deliverable 2}',
    description: 'Description',
    startDate: '{Month day, year}',
    dueDate: '{Month day, year}',
    amount: '{Amount}'
  }
];

export default function Page () {
  const router = useRouter();
  const [editForm, setEditForm] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deliverables, setDeliverables] = useState(staticDeliverables);

  const handleCloseModal = () => {
    setIsDecisionModalOpen(false)
  }

  const handleFormSubmit = () => {
    router.push('/dashboard/invoice-and-payment/payment');

    // router.push(routes.dashboard.invoiceAndPayment.payment.path);
  };

  //   const handleModalSubmit = (values: any) => {
  //     setDeliverables([...deliverables, values]);
  //     setIsModalOpen(false);
  //   };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //   const handleDelete = (index: any) => {
  //     const updatedDeliverables = deliverables.filter((_, i) => i !== index);
  //     setDeliverables(updatedDeliverables);
  //     setIsDecisionModalOpen(false);
  //   };

  const onEdit = () => {
    setEditForm(!editForm);
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
                <AddDeliverables />
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
                        <EditDeliverables />
                    </AnimatedModal>
                </Fragment>
            </RenderIf>

            <div className="flex justify-center items-center gap-4">
                <ProgressStatus label="Project details" checked />
                <ProgressStatus label="Deliverables" active />
                <ProgressStatus label="Payment" />
                <ProgressStatus label="Agreement" />
                <ProgressStatus label="Review" />
            </div>

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
                            onClick={handleCloseModal}
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
                        Add deliverable
                    </button>
                </div>
                <div>
                    {deliverables.map((item, index) => (
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
                                            onClick={onEdit}
                                        />
                                        <button
                                            onClick={() => { setIsDecisionModalOpen(true); }}
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
                    ))}

                    <div className='mt-10 text-[#262626] '>
                        <p className='flex justify-between mb-2'>Total deliverables: <span>2</span></p>
                        <p className='flex justify-between mb-2'>Timeline <span>{'{Month day, year} - {Month day, year} {number of days}'}</span></p>
                        <p className='flex justify-between mb-2'>Sub Total: <span>NGN 200,000.00</span></p>
                        <p className='flex justify-between'>Total <span className='font-bold'>NGN 200,000.00</span></p>
                    </div>
                </div>
                <div className="">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                                <div className="pt-4 flex justify-end">
                                    <Button
                                        type="submit"
                                        size="xl"
                                        backgroundColor="primary-blue-500"
                                        className="w-full py-3 px-12"
                                        onClick={() => { router.push(routes.dashboard.invoiceAndPayment.payment.path); }}
                                    >
                                        Save & Continue
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
  );
}
