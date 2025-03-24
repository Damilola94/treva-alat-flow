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
  onAddPayment: (values: any) => void
  setPaymentId: (id: string) => void

}

const validationSchema = Yup.object().shape({
  amountPercentage: Yup.string().required('Please enter a percentage required'),
  dueDate: Yup.date()
    .min(new Date(), 'Due date must be in the future')
    .required('Please select a due date'),
  reminderFrequency: Yup.string().required('Please enter a reminder frequency')
});

const options = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' }
];

export default function AddPayment (props: IProps) {
  const { onClose, projectId, setPaymentId } = props

  const { mutate, isLoading } = queries.createPayment({
    onSuccess: (response) => {
      if (response?.data?.id) {
        const paymentId = response.data.id;
        setPaymentId(paymentId);
      } else {
        console.warn('Project ID not found. Polling...');
      }
      onClose();
    }
  });

  const initialValues = {
    projectId,
    amountPercentage: '',
    dueDate: '',
    reminderFrequency: ''

  };

  type InitialValues = ReturnType<() => typeof initialValues>

  const onSubmit = (_values: InitialValues) => {
    mutate({ ..._values })
  }

  return (
        <div className="app_auth_login_container relative">
            <Image src={projectManagement.topGradient} alt="top gradient" className="w-full" />
            <div className="app_auth_login_container__upper !-mt-80">
                <div className="app_auth_login">
                    <div>
                        <h3 className="app_auth_login__title mb-5">
                            Add payment date
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
