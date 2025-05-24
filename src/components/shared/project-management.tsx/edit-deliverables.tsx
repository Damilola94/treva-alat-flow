/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';
import { useDeliverableById } from '@/hooks/Projects/useProjects';
import { useUpdateDeliverableMutation } from '@/services';

interface Deliverable {
  deliverableId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface IProps {
  onClose: () => void;
  projectId: string;
  item?: string;
  deliverableId: string;
  deliverable?: Deliverable | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditDeliverable: (values: any) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().optional(),
  description: Yup.string().optional(),
  startDate: Yup.date()
    .min(new Date(), 'Start date must be in the future')
    .optional(),
  endDate: Yup.date()
    .min(new Date(), 'Due date must be in the future')
    .optional(),
});

const initialValues = {
  name: '',
  description: '',
  startDate: '',
  endDate: ''
};

type InitialValues = ReturnType<() => typeof initialValues>;

export function EditDeliverables({
  onClose,
  projectId,
  deliverableId,
  onEditDeliverable
}: IProps) {
  
  const { allDeliverableIdData } = useDeliverableById(projectId, deliverableId);
  const [ updatedDeliverable, { isLoading} ] = useUpdateDeliverableMutation();
  
  const deliverableData = allDeliverableIdData?.data 

  const onSubmit = async (values: InitialValues) => {
    try {
      const response = await updatedDeliverable({
        projectId,
        deliverableId,
        ...values,
      }).unwrap();

      const deliverable = response?.data;
      if (deliverable?.id) {
        onEditDeliverable({
          ...deliverable,
          deliverableId: deliverable.id,
        });
        onClose();
      } else {
        console.warn('Deliverable ID not found in response.');
      }
    }
    catch (error) {
      console.error('Failed to update deliverable:', error);
    }
  }

  return (
    <div className="app_auth_login_container relative">
      <Image
        src={projectManagement.topGradient}
        alt="top gradient"
        className="w-full"
      />
      <div className="app_auth_login_container__upper !-mt-80">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title mb-5">Edit Deliverables</h3>
            <Formik
              enableReinitialize
              initialValues={{
                ...initialValues,
                name: deliverableData?.name ?? '',
                description: deliverableData?.description ?? '',
                startDate: deliverableData?.startDate ? deliverableData?.startDate.split('T')[0] : '',
                endDate: deliverableData?.endDate ? deliverableData?.endDate.split('T')[0] : ''
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                errors,
                touched,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 mt-14"
                >
                  <Input
                    name="name"
                    type="text"
                    placeholder="Deliverable Name"
                    size="xl"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />

                  <Input
                    name="description"
                    type="text"
                    placeholder="Description"
                    size="xl"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />

                  <div className="flex gap-5">
                    <Input
                      name="startDate"
                      type="date"
                      label="Start Date"
                      size="xl"
                      value={values.startDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />

                    <Input
                      name="endDate"
                      type="date"
                      label="End Date"
                      size="xl"
                      value={values.endDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5">
                    <Button
                      size="md"
                      type="button"
                      backgroundColor="transparent"
                      color="primary-blue-500"
                      onClick={onClose}
                      className="w-full hover:bg-transparent ml-10 app_auth_login__btn border border-[text-color-100]"
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      size="md"
                      isLoading={isLoading}
                      backgroundColor="primary-blue-500"
                      className="w-full app_auth_login__btn"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
