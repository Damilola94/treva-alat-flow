'use client'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { ProgressStatus } from '@/components/shared/dashboard/get-started'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import routes from '@/lib/routes'

const validationSchema = Yup.object().shape({
  // startTour: Yup.string().required('Please enter company name'),
})

const initialValues = {
  startTour: '',
  startTour2: ''
}

export default function Page () {
  const router = useRouter()

  const onSubmit = () => {
    router.push(routes.dashboard.getStarted.bio.path)
  }

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Professional details" checked />
        <ProgressStatus label="Social media details" active />
        <ProgressStatus label="Bio" />
        <ProgressStatus label="Select plan" />
        <ProgressStatus label="Finish" />
        {/* <ProgressStatus label="Team setup" /> */}
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10">
        <h3 className="app_get_started_professional_details__form__title">
          Social media details
        </h3>
        <div className="">
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
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
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-8">
                      <div className="">
                        <Input
                          name="startTour"
                          type="text"
                          id="startTour"
                          label="Instagram"
                          placeholder="Enter company name"
                          size="lg"
                          value={values.startTour}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="">
                        <Input
                          name="startTour2"
                          type="text"
                          id="startTour2"
                          label="Facebook"
                          placeholder="Enter company name"
                          size="lg"
                          value={values.startTour2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="">
                        <Input
                          name="startTour2"
                          type="text"
                          id="startTour2"
                          label="X"
                          placeholder="Enter company name"
                          size="lg"
                          value={values.startTour2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="">
                        <Input
                          name="startTour2"
                          type="text"
                          id="startTour2"
                          label="Tiktok"
                          placeholder="Enter company name"
                          size="lg"
                          value={values.startTour2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex">
                      <div className="">
                        <Button
                          size="xl"
                          backgroundColor="primary-blue-500"
                          className="w-full py-3 px-12"
                        >
                          Save & Continue
                        </Button>
                      </div>
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
