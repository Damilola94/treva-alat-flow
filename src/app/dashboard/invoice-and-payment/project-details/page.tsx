'use client'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { ProgressStatus } from '@/components/shared/dashboard/get-started'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import routes from '@/lib/routes'
import { AnimatedModal, Pill } from '@/components/shared'
import { Select } from '@/components/shared/select'
import { AddClient } from '@/components/shared/client-management'

const validationSchema = Yup.object().shape({})

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

const initialValues = {
  startTour: '',
  startTour2: '',
  accountType: AccountType.Low as `${AccountType}`
}

const options = [
  { value: 'Moyin Akindele', label: 'Moyin Akindele' },
  { value: 'Tomi Sunny', label: 'Tomi Sunny' },
  { value: 'Adebayo Ademola', label: 'Adebayo Ademola' },
  { value: '+ Add new client', label: '+ Add new client' }
];

export default function Page () {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleViewChange = (selectedOption: { value: string, label: string }) => {
    if (selectedOption.value === '+ Add new client') {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const onSubmit = () => {
    router.push(routes.dashboard.invoiceAndPayment.deliverables.path);
  };

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <AnimatedModal
        {...{
          isOpen: isModalOpen,
          from: 'right',
          onClose: closeModal,
          className:
            'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2'
        }}
      >
        <AddClient />
      </AnimatedModal>
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Project details" checked />
        <ProgressStatus label="Deliverables" />
        <ProgressStatus label="Payment" />
        <ProgressStatus label="Agreement" />
        <ProgressStatus label="Review" />
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        <h3 className="app_get_started_professional_details__form__title">
          Project details
        </h3>
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
                setFieldValue,
                handleSubmit,
                errors,
                touched
              } = props;
              return (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-8">
                    <Input
                      name="projectTitle"
                      type="text"
                      id="projectTitle"
                      placeholder="Project title"
                      size="lg"
                      value={values.startTour}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                    <Input
                      name="projectDescription"
                      type="text"
                      id="projectDescription"
                      placeholder="Project description"
                      size="lg"
                      value={values.startTour}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                    <Input
                      name="expectedDeliveryDate"
                      type="date"
                      id="expectedDeliveryDate"
                      placeholder="Expected delivery date"
                      size="lg"
                      value={values.startTour2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />

                    <div className="flex flex-col gap-8 my-5">
                      <p className="text-[#6D6D6D]">Project Priority</p>
                      <div className="flex gap-2">
                        <Pill
                          size="md"
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () => await setFieldValue('accountType', AccountType.Low)}
                          active={values.accountType === AccountType.Low}
                          className="w-full"
                        >
                          Low
                        </Pill>
                        <Pill
                          size="md"
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () => await setFieldValue('accountType', AccountType.Medium)}
                          active={values.accountType === AccountType.Medium}
                          className="w-full"
                        >
                          Medium
                        </Pill>
                        <Pill
                          size="md"
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () => await setFieldValue('accountType', AccountType.High)}
                          active={values.accountType === AccountType.High}
                          className="w-full"
                        >
                          High
                        </Pill>
                      </div>
                    </div>

                    <Select
                      options={options}
                      placeholder="Select Client"
                      onChange={handleViewChange}
                    />

                    <Button
                      size="xl"
                      backgroundColor="primary-blue-500"
                      className="w-full py-3 px-12"
                      type="submit"
                    >
                      Save & Continue
                    </Button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
