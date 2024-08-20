'use client'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import queries from '@/services/queries/auth'
import { Logo } from '@/components/shared'
import Link from 'next/link'
import routes from '@/lib/routes'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email address')
})

const initialValues = {
  email: process.env.NEXT_PUBLIC_CLIENT_EMAIL ?? '',
  password: process.env.NEXT_PUBLIC_CLIENT_PASSWORD ?? ''
}

export default function Login () {
  const { mutate, isLoading } = queries.login()

  return (
    <div className="app_auth_login_container">
      <div className="app_auth_login_container__header flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo />
          <h2 className="app_auth_login_container__header__logo__title">
            Creathrivity
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <p className="app_auth_login_container__header__account">
            Don’t have an account?
          </p>
          <Link href={routes.onboarding.path}>
            <p className="app_auth_login_container__header__signin">Sign up</p>
          </Link>
        </div>
      </div>
      <div className="app_auth_login_container__upper">
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
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <h3 className="app_auth_login__title">
                      Sign in
                    </h3>
                    <div className="flex flex-col gap-8">
                      <div className="">
                        <Input
                          name="email"
                          type="email"
                          id="email"
                          placeholder="Email address"
                          size="xl"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <Input
                        name="password"
                        type="password"
                        id="password"
                        placeholder="Password"
                        size="xl"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="">
                      <Button
                        size="xl"
                        isLoading={isLoading}
                        backgroundColor="shark-950"
                        className="w-full app_auth_login__btn"
                      >
                        Submit
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
