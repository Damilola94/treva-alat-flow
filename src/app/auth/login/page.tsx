'use client'
import React from 'react'
import logos from '@/lib/assets/logos'
import Image from 'next/image'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import queries from '@/services/queries/auth'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email address')
    .required('Please enter your email address'),
  password: Yup.string().required('Please enter your password')
})

const initialValues = {
  email: process.env.NEXT_PUBLIC_CLIENT_EMAIL ?? '',
  password: process.env.NEXT_PUBLIC_CLIENT_PASSWORD ?? ''
}

export default function Login () {
  const { mutate, isLoading } = queries.login()

  return (
    <div className="app_auth_login_container">
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login_container__upper__logo">
          <Image src={logos.logoDashboard} alt="logo" className="w-full" />
        </div>

        <div className="app_auth_login">
          <div>
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
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-10"
                  >
                    <h3 className="app_auth_login__title">
                      Login to your account.
                    </h3>
                    <div className="flex flex-col gap-6">
                      <div className="">
                        <Input
                          name="email"
                          type="email"
                          id="email"
                          placeholder="Enter email address"
                          label="Email"
                          size="xl"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="">
                        <Input
                          name="password"
                          type="password"
                          id="password"
                          placeholder="Enter your Password"
                          label="Password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          size="xl"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>

                    <div className="">
                      <Button
                        size="xl"
                        isLoading={isLoading}
                        backgroundColor="primary-color"
                        className="w-full app_auth_login__btn"
                      >
                        Login
                      </Button>
                    </div>
                  </form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>

      <div className="app_auth_login_container__lower">
        <p className="app_auth_login_container__lower__text">
          Powered by IDEAx Labs- WEMA Bank Innovation Labs
        </p>
        <div className="app_auth_login__logo">
          <Image src={logos.logo} alt="logo" className="w-full" />
        </div>
      </div>
    </div>
  )
}
