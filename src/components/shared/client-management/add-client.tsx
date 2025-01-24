/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import queries from '@/services/queries/auth'
import { Upload } from '@/components/shared'
import Image from 'next/image'
import projectManagement from '@/lib/assets/project-management'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email address')
})

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

const initialValues = {
  email: process.env.NEXT_PUBLIC_CLIENT_EMAIL ?? '',
  password: process.env.NEXT_PUBLIC_CLIENT_PASSWORD ?? '',
  accountType: AccountType.Low as `${AccountType}`
}

export function AddClient () {
  const { mutate, isLoading } = queries.login()
  return (
    <div className="app_auth_login_container relative">
        <Image src={projectManagement.topGradient} alt="top gradient" className="w-full" />

      <div className="app_auth_login_container__upper !-mt-96">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title mb-5">
            Add new client
            </h3>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={mutate}
            >
              {(props) => {
                const {
                  values,
                  handleChange,
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
                          name="email"
                          type="email"
                          id="email"
                          placeholder="Client full name"
                          size="xl"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="flex justify-center items-center space-x-5">
                        <Input
                          name="email"
                          type="text"
                          id="email"
                          placeholder="Email address"
                          size="xl"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                        <Input
                          name="pNumber"
                          type="text"
                          id="pNumber"
                          placeholder="Phone number"
                          size="xl"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <Input
                        name="birthday"
                        type="date"
                        id="birthday"
                        placeholder="Birthday"
                        size="xl"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="app_upload_con py-5 px-4 flex flex-col gap-3 items-center">
                      <Upload />
                      <div className="flex flex-col gap-1">
                        <p className="app_upload_con__title">Upload your CV</p>
                        <p className="app_upload_con__description">
                          PDF, PNG, JPG, GIF | 10MB max.
                        </p>
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
                        Close
                      </Button>
                      <Button
                        size="md"
                        isLoading={isLoading}
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn"
                      >
                        Add client
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
