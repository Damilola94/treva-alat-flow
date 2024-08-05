'use client'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import queries from '@/services/queries/auth'
import routes from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/onboarding'

const validationSchema = Yup.object().shape({
  password: Yup.string().min(8).required()
})

const initialValues = {
  password: ''
}

export default function Page () {
  const rt = useRouter()
  const { isLoading } = queries.login()

  const onSubmit = () => { rt.push(routes.onboarding.accountType.path) }

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
                    <div className="flex flex-col gap-6">
                    </div>

                    <div className="">
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
