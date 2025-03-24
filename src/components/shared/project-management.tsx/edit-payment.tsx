/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import projectManagement from '@/lib/assets/project-management'
import Image from 'next/image'
import queries from '@/services/queries/projects'

interface Payment {
  paymentId: string
  amountPercentage: string
  dueDate: string
  reminderFrequency: string
}

interface IProps {
  onClose: () => void
  projectId: string
  paymentId: string
  payment?: Payment | null
  onEditPayment: (values: any) => void

}

const validationSchema = Yup.object().shape({
  amountPercentage: Yup.string().optional(),
  dueDate: Yup.date()
    .min(new Date(), 'Due date must be in the future')
    .optional(),
  reminderFrequency: Yup.string().optional()
});

const options = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' }
];

const initialValues = {
  amountPercentage: '',
  dueDate: '',
  reminderFrequency: ''
};

type InitialValues = ReturnType<() => typeof initialValues>

export default function EditPayment (props: IProps) {
  const { onClose, projectId, paymentId, payment } = props

  const [, setPaymentData] = useState<any>(null)

  const { data, refetch } = queries.readPaymentOne({ projectId, paymentId })

  const { mutate, isLoading } = queries.updatePayment({ paymentId, projectId },
    {
      onSuccess: () => {
        void refetch()
        onClose();
      }
    }
  )

  useEffect(() => {
    if (payment) {
      setPaymentData(payment)
    }
  }, [payment, paymentId])

  useEffect(() => {
    if (data) { /* empty */ }
  }, [data, projectId, paymentId])

  const onSubmit = (values: InitialValues) => {
    const formData = {
      projectId,
      paymentId,
      amountPercentage: values.amountPercentage,
      dueDate: values.dueDate,
      reminderFrequency: values.reminderFrequency
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
                            Edit payment date
                        </h3>
                        <Formik
                        enableReinitialize
                        initialValues={
                                {
                                  ...initialValues,
                                  amountPercentage: data?.amountPercentage ?? '',
                                  dueDate: data.dueDate ? data?.dueDate.split('T')[0] : '',
                                  reminderFrequency: data?.reminderFrequency ?? ''
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
                              setFieldValue,
                              errors,
                              touched
                            }) => (
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col gap-4 mt-14"
                                >
                                    <Input
                                        name="amountPercentage"
                                        type="number"
                                        placeholder="% Required"
                                        size="xl"
                                        value={values.amountPercentage}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                    />

                                    <Input
                                        name="dueDate"
                                        type="date"
                                        label="Due date"
                                        size="xl"
                                        value={values.dueDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                    />

                                    <div className="w-full mt-5">
                                        <select
                                            name="reminderFrequency"
                                            value={values.reminderFrequency}
                                            onChange={async (e) => await setFieldValue('reminderFrequency', e.target.value)}
                                            className="w-full border-b-[#d1d5db] p-2 focus:ring-1 focus:ring-[#7B37F0] bg-white text-left"
                                        >
                                            <option value="" disabled>
                                                Select Reminder Frequency
                                            </option>
                                            {options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>

                                    </div>

                                    <div className="flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5">
                                        <Button
                                            size="md"
                                            backgroundColor="transparent"
                                            type='button'
                                            onClick={onClose}
                                            color="primary-blue-500"
                                            className="w-full hover:bg-transparent ml-10 app_auth_login__btn border border-[text-color-100]"
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
