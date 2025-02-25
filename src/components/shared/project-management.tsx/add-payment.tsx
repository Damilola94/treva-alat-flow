/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '../select'
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
//   perRequired: Yup.string().required('Please enter a percentage required'),
//   dueDate: Yup.date().required('Please select a due date'),
//   reminderFrequency: Yup.string().required('Please enter a reminder frequency')
});

const options = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quartely', label: 'Quartely' },
  { value: 'Yearly', label: 'Yearly' }
];

export default function AddPayment (props: IProps) {
  const { onClose, projectId, setPaymentId } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    perRequired: '',
    dueDate: '',
    reminderFrequency: ''

  };

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
                            onSubmit={mutate}
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
                                        name="%Required"
                                        type="text"
                                        placeholder="% Required"
                                        size="xl"
                                        value={values.perRequired}
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
                                        <Select
                                            options={options}
                                            placeholder="Reminder frequency"
                                        // onChange={handleViewChange}
                                        />
                                    </div>

                                    <div className='mt-10 text-[#262626] '>
                                        <p className='flex justify-between mb-2'>% percentage <span>% 50</span></p>
                                        <p className='flex justify-between mb-2'>Sub Total: <span>NGN 100,000.00</span></p>
                                        <p className='flex justify-between'>Total <span className='font-bold'>NGN 100,000.00</span></p>
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
