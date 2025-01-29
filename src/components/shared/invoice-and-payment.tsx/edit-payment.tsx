/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import queries from '@/services/queries/auth'
import { Select } from '../select'
import Image from 'next/image'
import projectManagement from '@/lib/assets/project-management'

const validationSchema = Yup.object().shape({
  deliverableName: Yup.string().required('Please enter a deliverable name'),
  description: Yup.string().required('Please enter a description'),
  startDate: Yup.date().required('Please select a start date'),
  dueDate: Yup.date().required('Please select a due date'),
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
  description: '',
  startDate: '',
  dueDate: '',
  amount: '',
  accountType: AccountType.Low as `${AccountType}`

};

const options = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quartely', label: 'Quartely' },
  { value: 'Yearly', label: 'Yearly' }
];

export function EditPayment () {
  const { mutate, isLoading } = queries.login()
  return (
        <div className="app_auth_login_container relative">
                  <Image src={projectManagement.topGradient} alt="top gradient" className="w-full" />
            <div className="app_auth_login_container__upper !-mt-80">
                <div className="app_auth_login">
                    <div>
                        <h3 className="app_auth_login__title mb-5">
                            Edit Payment
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
                                        value={values.deliverableName}
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
                                        value={values.startDate}
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
                                            isLoading={isLoading}
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
