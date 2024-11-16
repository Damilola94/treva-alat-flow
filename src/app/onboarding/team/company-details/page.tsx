'use client'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import queries from '@/services/queries/auth'
import routes from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/onboarding'
import { Pill } from '@/components/shared'

enum CompanySize {
  '1-10' = '1-10',
  '11-50' = '11-50',
  '101 - 500' = '101 - 500',
  '501 - 2000+' = '501 - 2000+',
}

const validationSchema = Yup.object().shape({
  companyName: Yup.string().min(3).required()
})

const initialValues = {
  companyName: '',
  companySize: CompanySize['1-10']
}

type InitialValues = ReturnType<() => typeof initialValues>

export default function Page () {
  const rt = useRouter()
  const { isLoading } = queries.login()
  const [show, setShow] = useState(false)

  const onSubmit = () => {
    if (show) {
      rt.push(routes.onboarding.team.profession.path)
    } else {
      setShow(true)
    }
  }

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
                  values,
                  setFieldValue,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  errors,
                  touched
                } = props

                const getProps = (args: { name: keyof InitialValues }) => {
                  const name = args.name

                  return {
                    name,
                    id: name,
                    value: values[name],
                    onChange: handleChange,
                    onBlur: handleBlur,
                    errors,
                    touched
                  }
                }

                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <h3 className="app_auth_login__title">
                      Your company {show ? 'size' : 'name'}
                    </h3>

                    <div className="flex flex-col gap-6">
                      {show
                        ? (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(CompanySize).map(([label]) => (
                              <Pill
                                key={label}
                                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                onClick={async () => await setFieldValue('companySize', label)}
                                active={values.companySize === label}
                              >
                                {label}
                              </Pill>
                            ))}
                          </div>
                          )
                        : (
                          <div className="">
                            <Input
                              {...getProps({ name: 'companyName' })}
                              placeholder="Enter company name"
                              size="xl"
                            />
                          </div>
                          )}
                    </div>

                    <div className="">
                      <Button
                        size="xl"
                        isLoading={isLoading}
                        backgroundColor="primary-blue-500"
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
