/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import queries from '@/services/queries/auth'
import { ArrowRight, Pill } from '@/components/shared'
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management'

type UserType = 'Client' | 'Personal'

const validationSchema = Yup.object().shape({
  ProjecTitle: Yup.string().required('Please enter a project title'),
  ProjectDescription: Yup.string().required('Please enter a project description'),
  ExpectedDeliveryDate: Yup.string().required('Please enter a expected delivery date')
})

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

const initialValues = {
  ProjecTitle: '',
  ProjectDescription: '',
  ExpectedDeliveryDate: '',
  accountType: AccountType.Low as `${AccountType}`
}

export function AddProject () {
  const { mutate, isLoading } = queries.login()
  const [userType, setUserType] = useState<UserType>('Client')
  return (
    <div className="app_auth_login_container relative">
      <div className="project_management_card__bg">
        <Image src={projectManagement.topGradient} alt="top gradient" className="w-full" />
      </div>
      <div className="app_auth_login_container__upper !-mt-80">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title">{userType === 'Personal' ? 'Add new project' : 'Add personal project'}</h3>
            <div className="billing-toggle">
              <button
                className={userType === 'Personal' ? '' : 'active'}
                onClick={() => {
                  setUserType('Client')
                }}
              >
                Personal
              </button>
              <button
                className={userType === 'Client' ? '' : 'active'}
                onClick={() => {
                  setUserType('Personal')
                }}
              >
                Client
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={mutate}
            >
              {(props) => {
                const {
                  values,
                  handleChange,
                  setFieldValue,
                  handleBlur,
                  handleSubmit,
                  errors,
                  touched
                } = props
                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8">
                      <div className="">
                        <Input
                          name="ProjecTitle"
                          type="text"
                          id="ProjecTitle"
                          placeholder="Project title"
                          size="xl"
                          value={values.ProjecTitle}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <Input
                        name="ProjectDescription"
                        type="text"
                        id="ProjectDescription"
                        placeholder="Project description"
                        size="xl"
                        value={values.ProjectDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                      <Input
                        name="ExpectedDeliveryDate"
                        type="date"
                        id="ExpectedDeliveryDate"
                        placeholder="Expected delivery date"
                        size="xl"
                        value={values.ExpectedDeliveryDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="flex flex-col gap-8 my-5">
                      <p className='text-[#6D6D6D]'>Project Priority</p>
                      <div className="flex gap-2">
                        <Pill
                          size="md"
                          onClick={async () =>
                            await setFieldValue('accountType', AccountType.Low)
                          }
                          active={values.accountType === AccountType.Low}
                          className="w-full"
                        >
                          Low
                        </Pill>

                        <Pill
                          size="md"
                          onClick={async () =>
                            await setFieldValue(
                              'accountType',
                              AccountType.Medium
                            )
                          }
                          active={values.accountType === AccountType.Medium}
                          className="w-full"
                        >
                          Medium
                        </Pill>
                        <Pill
                          size="md"
                          onClick={async () =>
                            await setFieldValue('accountType', AccountType.High)
                          }
                          active={values.accountType === AccountType.High}
                          className="w-full"
                        >
                          High
                        </Pill>
                      </div>
                    </div>
                    <div className="flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5 m">
                      <Button
                        size="md"
                        isLoading={isLoading}
                        backgroundColor="transparent"
                        color="primary-blue-500"
                        className="w-full hover:bg-transparent ml-10 app_auth_login__btn border border-[#F1F1F1]"
                      >
                        Save
                      </Button>
                      <Button
                        size="md"
                        isLoading={isLoading}
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn flex items-center justify-center gap-2"
                      >
                        {userType === 'Personal'
                          ? (
                          <>
                            Proceed to Invoice
                            <ArrowRight stroke='#fff' />
                          </>
                            )
                          : (
                              'Create Project'
                            )}
                      </Button>
                    </div>
                  </form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}
