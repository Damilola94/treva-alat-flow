'use client'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import queries from '@/services/queries/auth'
import routes from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/onboarding'

const validationSchema = Yup.object().shape({})

const initialValues = {
  password: ''
}

export default function Page () {
  const rt = useRouter()
  const { isLoading } = queries.login()

  const onSubmit = () => { rt.push(routes.auth.verification.path) }

  const email = process.env.NEXT_PUBLIC_CLIENT_EMAIL ?? ''

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(props) => {
                const {
                  handleSubmit
                } = props

                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <h3 className="app_auth_login__title">
                      Email Verification
                    </h3>

                    <div className="flex flex-col gap-8">
                      <p className="app_auth_verification__p">
                        We have sent an email to
                        <br />
                        <span className="app_auth_verification__p__span">{email}.</span>
                        <br />
                        <br />
                        Verify your email to begin
                      </p>
                      <Button
                        size="xl"
                        isLoading={isLoading}
                        backgroundColor="shark-950"
                        className="w-full app_auth_login__btn"
                      >
                        Next
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
