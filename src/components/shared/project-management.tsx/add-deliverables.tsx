/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import projectManagement from '@/lib/assets/project-management'
import Image from 'next/image'
import queries from '@/services/queries/projects'

interface IProps {
  onClose: () => void
  projectId: string
  onAddDeliverable: (values: any) => void
  setDeliverableId: (id: string) => void

}

const validationSchema = Yup.object().shape({
  deliverableName: Yup.string().required('Please enter a deliverable name'),
  description: Yup.string().required('Please enter a description'),
  startDate: Yup.date()
    .min(new Date(), 'Start date must be in the future')
    .required('Please select a start date'),
  dueDate: Yup.date()
    .min(new Date(), 'Due date must be in the future')
    .required('Please select a due date'),
  amount: Yup.number()
    .required('Please enter an amount')
    .positive('Amount must be positive')
});

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export function AddDeliverables (props: IProps) {
  const { onClose, projectId, setDeliverableId } = props

  const { mutate, isLoading } = queries.createDeliverables({
    onSuccess: (response) => {
      if (response?.data?.id) {
        const deliverableId = response.data.id; // Extract ID directly
        setDeliverableId(deliverableId);
      } else {
        console.warn('Project ID not found. Polling...');
      }
      onClose();
    }
  });

  const initialValues = {
    projectId,
    deliverableName: '',
    description: '',
    startDate: '',
    dueDate: '',
    amount: '',
    accountType: AccountType.Low as `${AccountType}`

  };

  type InitialValues = ReturnType<() => typeof initialValues>

  const onSubmit = (_values: InitialValues) => {
    mutate({ ..._values });
  };

  return (
        <div className="app_auth_login_container relative">
            <Image src={projectManagement.topGradient} alt="top gradient" className="w-full" />
            <div className="app_auth_login_container__upper !-mt-80">
                <div className="app_auth_login">
                    <div>
                        <h3 className="app_auth_login__title mb-5">
                            Add new deliverable
                        </h3>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({
                              values,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              errors,
                              touched
                            }) => (
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col gap-4 mt-14"
                                >
                                    <Input
                                        name="deliverableName"
                                        type="text"
                                        placeholder="Deliverable Name"
                                        size="xl"
                                        value={values.deliverableName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                    />

                                    <Input
                                        name="description"
                                        type="text"
                                        placeholder="Description"
                                        size="xl"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                    />

                                    <Input
                                        name="startDate"
                                        type="date"
                                        label="Start Date"
                                        size="xl"
                                        value={values.startDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                    />

                                    <Input
                                        name="dueDate"
                                        type="date"
                                        label="Due Date"
                                        size="xl"
                                        value={values.dueDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                    />

                                    <Input
                                        name="amount"
                                        placeholder="Amount"
                                        type="number"
                                        size="xl"
                                        value={values.amount}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                    />

                                    <div className="flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5">
                                        <Button
                                            size="md"
                                            type="button"
                                            backgroundColor="transparent"
                                            color="primary-blue-500"
                                            className="w-full hover:bg-transparent ml-10 app_auth_login__btn border border-[text-color-100]"
                                             onClick={onClose}

                                        >
                                            Close
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="md"
                                            backgroundColor="primary-blue-500"
                                            className="w-full app_auth_login__btn"
                                            isLoading={isLoading}

                                        >
                                            Add
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
  )
}
