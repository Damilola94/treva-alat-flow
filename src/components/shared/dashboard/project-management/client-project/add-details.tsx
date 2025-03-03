'use client'
import { Fragment, useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AnimatedModal, Pill, RenderIf } from '@/components/shared'
import queries from '@/services/queries/projects'
import type { InitialStep1Values } from '@/app/dashboard/project-management/client-project/create/page'
import { ProjectType } from '@/services/queries/projects/enums'
import clientQueries from '@/services/queries/client-management'
import { AddClient } from '../../../client-management'

interface IProps {
  handleNext: (formData: InitialStep1Values) => void
  setProjectId: (id: string) => void
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Please enter a project title'),
  description: Yup.string().required('Please enter a project description'),
  expectedDeliveryDate: Yup.date()
    .min(new Date(), 'Expected delivery date must be in the future')
    .required('Please enter an expected delivery date'),
  priority: Yup.string().required('Please select a priority'),
  clientId: Yup.string().required('Please select a client')
})

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export function ProjectDetails (props: IProps) {
  const { handleNext, setProjectId } = props

  const [userType] = useState<ProjectType>(ProjectType.ClientProject)
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string | null>(null)
  const { data, refetch } = clientQueries.read()

  const { mutate, isLoading } = queries.create({
    onSuccess: (response) => {
      if (response?.data?.id) {
        const projectId = response.data.id
        setProjectId(projectId)
      } else {
        console.warn('Project ID not found. Polling...')
      }
    }
  })

  const initialValues = {
    title: '',
    description: '',
    expectedDeliveryDate: '',
    priority: AccountType.Low as `${AccountType}`,
    projectType: userType,
    clientId: ''
  }

  type InitialValues = ReturnType<() => typeof initialValues>

  const onSubmit = (values: InitialValues) => {
    if (!values.clientId) {
      return
    }
    mutate(values)
    handleNext(values)
  }

  useEffect(() => {
    if (data && userType === ProjectType.ClientProject) {
      void refetch()
    }
  }, [userType, refetch, data])

  const handleAddClientClick = () => {
    setIsAddClientModalOpen(true)
  }

  const handleCloseAddClientModal = () => {
    setIsAddClientModalOpen(false)
    void refetch()
  }

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        <h3 className="app_get_started_professional_details__form__title">Project details</h3>
        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ values, handleChange, setFieldValue, handleBlur, errors, touched }) => (
              <Form className="flex flex-col gap-8">
                <div className="flex flex-col gap-8">
                  <div className="">
                    <Input
                      name="title"
                      type="text"
                      id="title"
                      placeholder="Project title"
                      size="xl"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <Input
                    name="description"
                    type="text"
                    id="description"
                    placeholder="Project description"
                    size="xl"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                  <div>
                    <label htmlFor="">Expected delivery date</label>
                    <Input
                      name="expectedDeliveryDate"
                      type="date"
                      id="expectedDeliveryDate"
                      placeholder="Expected delivery date"
                      size="xl"
                      value={values.expectedDeliveryDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8 my-5">
                  <p className="text-[#6D6D6D]">Project Priority</p>
                  <div className="flex gap-2">
                    <Pill
                      size="md"
                      // eslint-disable-next-line no-void
                      onClick={() => void setFieldValue('priority', AccountType.Low)}
                      active={values.priority === AccountType.Low}
                      className="w-full"
                    >
                      Low
                    </Pill>
                    <Pill
                      size="md"
                      // eslint-disable-next-line no-void
                      onClick={() => void setFieldValue('priority', AccountType.Medium)}
                      active={values.priority === AccountType.Medium}
                      className="w-full"
                    >
                      Medium
                    </Pill>
                    <Pill
                      size="md"
                      // eslint-disable-next-line no-void
                      onClick={() => void setFieldValue('priority', AccountType.High)}
                      active={values.priority === AccountType.High}
                      className="w-full"
                    >
                      High
                    </Pill>
                  </div>
                </div>
                <div className="relative w-full">
                  <select
                    name="clientId"
                    value={values.clientId ?? ''}
                    onChange={(e) => {
                      const { value } = e.target
                      if (value === 'new-client') {
                        handleAddClientClick()
                      } else {
                        setSelected(value)
                        void setFieldValue('clientId', value)
                      }
                    }}
                    className="w-full border-b-[#d1d5db] p-2 focus:ring-1 focus:ring-[#7B37F0] bg-white text-left"
                  >
                    <option value="" disabled>
                      Select client
                    </option>
                    {data?.data?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.fullName}
                      </option>
                    ))}
                    <option value="new-client" className="text-blue-400">
                      {' '}
                      + Add new client
                    </option>
                  </select>
                </div>
                <RenderIf condition={!!errors.clientId}>
                  <div>
                    <p className="app_input_con__spt--error">{errors.clientId}</p>
                  </div>
                </RenderIf>
                <div className="">
                  <Button
                    type="submit"
                    size="md"
                    isLoading={isLoading}
                    backgroundColor="primary-blue-500"
                    className="w-1/2 app_auth_login__btn flex items-center justify-center gap-2"
                  >
                    Save and Continue
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <RenderIf condition={isAddClientModalOpen}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'right',
              onClose: handleCloseAddClientModal,
              className:
                'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2'
            }}
          >
            <AddClient onClose={handleCloseAddClientModal} />
          </AnimatedModal>
        </Fragment>
      </RenderIf>
    </div>
  )
}
