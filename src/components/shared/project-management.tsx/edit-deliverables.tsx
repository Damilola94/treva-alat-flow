/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import React, { useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import projectManagement from '@/lib/assets/project-management'
import queries from '@/services/queries/projects'

interface IProps {
  onClose: () => void
  projectId: string
  deliverableId: string
  onAddDeliverable: (values: any) => void
}

const validationSchema = Yup.object().shape({
  deliverableName: Yup.string().required('Please enter a deliverable name'),
  description: Yup.string().required('Please enter a description'),
  startDate: Yup.date()
    .min(new Date(), 'Start date must be in the future')
    .required('Please select a start date'),
  dueDate: Yup.date()
    .max(new Date(), 'Due date cannot be in the future')
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

const initialValues = {
  deliverableName: '',
  deliverableDescription: '',
  startDate: '',
  dueDate: '',
  deliverableAmount: '',
  accountType: AccountType.Low as `${AccountType}`

};

type InitialValues = ReturnType<() => typeof initialValues>

export function EditDeliverables ({ onClose, projectId, deliverableId }: IProps) {
  const { data, refetch } = queries.readDeliverablesOne({ projectId, deliverableId })

  const { mutate, isLoading } = queries.updateDeliverables({ deliverableId, projectId },
    {
      onSuccess: () => {
        void refetch()
        onClose();
      }
    }
  )

  useEffect(() => {
    if (data) { /* empty */ }
  }, [data, projectId, deliverableId])

  const onSubmit = (values: InitialValues) => {
    const formData = {
      projectId,
      deliverableId,
      deliverableName: values.deliverableName,
      deliverableDescription: values.deliverableDescription,
      startDate: values.startDate,
      dueDate: values.dueDate,
      deliverableAmount: values.deliverableAmount
    };

    mutate(formData);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
  <div className="app_auth_login_container relative">
    <Image src={projectManagement.topGradient} alt="top gradient" className="w-full" />
    <div className="app_auth_login_container__upper !-mt-80">
      <div className="app_auth_login">
        <div>
          <h3 className="app_auth_login__title mb-5">
            Edit Deliverables
          </h3>
          <Formik
              enableReinitialize
            initialValues={
              {
                ...initialValues,
                deliverableName: data?.deliverableName ?? '',
                deliverableDescription: data?.deliverableDescription ?? '',
                startDate: data.startDate ? data?.startDate.split('T')[0] : '',
                dueDate: data.dueDate ? data?.dueDate.split('T')[0] : '',
                deliverableAmount: (data?.deliverableAmount ??
                  '')
              }
            }
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
                  name="deliverableDescription"
                  type="text"
                  placeholder="Description"
                  size="xl"
                  value={values.deliverableDescription}
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
                  name="deliverableAmount"
                  placeholder="Amount"
                  type="number"
                  size="xl"
                  value={values.deliverableAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />

                <div className="flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5">
                  <Button
                    size="md"
                    type='button'
                    backgroundColor="transparent"
                    color="primary-blue-500"
                    onClick={onClose}
                    className="w-full hover:bg-transparent ml-10 app_auth_login__btn border border-[text-color-100]"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    size="md"
                    isLoading={isLoading}
                    backgroundColor="primary-blue-500"
                    className="w-full app_auth_login__btn"
                  >
                    Update
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
