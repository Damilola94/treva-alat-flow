/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pill } from '@/components/shared';
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';
import queries from '@/services/queries/projects';
import { type InitialStep1Values } from '@/app/dashboard/project-management/personal-project/create/page';

interface IProps {
  id: string
  item?: string
  handleClick: () => void
  onClose: () => void
  onProceedToDeliverables?: () => void
  setProjectId: (id: string) => void
  setDeliverableId: (id: string) => void
  handleNext: (formData: InitialStep1Values) => void
  onAddDeliverable: (values: any) => void

}

type UserType = 1 | 2;

const validationSchema = Yup.object().shape({
  title: Yup.string().optional(),
  description: Yup.string().optional(),
  expectedDeliveryDate: Yup.string().optional(),
  priority: Yup.string().required('Please select a priority')
})

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

const priorityMapping: Record<number, AccountType> = {
  1: AccountType.Low,
  2: AccountType.Medium,
  3: AccountType.High
};

export function EditProject (props: IProps) {
  const { id, onClose, handleNext, setProjectId, setDeliverableId } = props;
  const projectId = id;
  const { data, refetch } = queries.readone({ projectId });

  const { mutate, isLoading } = queries.update({
    onSuccess: (response) => {
      if (response?.data?.id) {
        const projectId = response.data.id;
        setProjectId(projectId);
        setDeliverableId(projectId);
      } else {
        console.warn('Project ID not found. Polling...');
      }
    }
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userType, setUserType] = useState<UserType>(1);

  useEffect(() => {
    if (data) { void refetch() }
  }, [data, projectId, refetch])

  const initialValues = {
    title: '',
    description: '',
    expectedDeliveryDate: '',
    priority: AccountType.Low as `${AccountType}`,
    totalAmount: '',
    projectType: userType
  };

  type InitialValues = ReturnType<() => typeof initialValues>

  const onSubmit = (_values: InitialValues) => {
    const payload: {
      projectId: string
      title: string
      description: string
      expectedDeliveryDate: string
      priority: string
      totalAmount: string
      projectType: UserType
    } = {
      projectId,
      title: _values.title,
      description: _values.description,
      expectedDeliveryDate: _values.expectedDeliveryDate,
      priority: _values.priority,
      totalAmount: _values.totalAmount,
      projectType: _values.projectType
    };

    mutate(payload);
    handleNext(_values)
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app_auth_login_container relative !overflow-y-auto">
      <Image
        src={projectManagement.topGradient}
        alt="take a tour"
        className=""
      />
      <div className="app_auth_login_container__upper !-mt-60">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title !mb-6">Edit Project</h3>
            <Formik
              enableReinitialize
              initialValues={{
                ...initialValues,
                title: data?.title ?? '',
                description: data?.description ?? '',
                expectedDeliveryDate: data.expectedDeliveryDate ? data.expectedDeliveryDate.split('T')[0] : '',
                priority: priorityMapping[data?.priority] ?? AccountType.Low,
                totalAmount: data?.totalAmount ?? '',
                projectType: data?.projectType ?? userType
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(props) => {
                const {
                  values,
                  handleChange,
                  setFieldValue,
                  handleBlur,
                  handleSubmit,
                  errors,
                  touched
                } = props;

                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
                    <div className="flex flex-col gap-8 my-5">
                      <p className='text-[#6D6D6D]'>Project Priority</p>
                      <div className="flex gap-2">
                        <Pill
                          size="md"
                          onClick={async () => await setFieldValue('priority', AccountType.Low)}
                          active={values.priority === AccountType.Low}
                          className="w-full"
                        >
                          Low
                        </Pill>

                        <Pill
                          size="md"
                          onClick={async () => await setFieldValue('priority', AccountType.Medium)}
                          active={values.priority === AccountType.Medium}
                          className="w-full"
                        >
                          Medium
                        </Pill>

                        <Pill
                          size="md"
                          onClick={async () => await setFieldValue('priority', AccountType.High)}
                          active={values.priority === AccountType.High}
                          className="w-full"
                        >
                          High
                        </Pill>
                      </div>

                    </div>
                    <div className="flex gap-4 w-full">
                      <Button
                        type="button"
                        size="md"
                        backgroundColor="transparent"
                        color="primary-blue-500"
                        className="w-full hover:bg-transparent app_auth_login__btn border border-[#F1F1F1]"
                        onClick={onClose}
                      >
                        Close
                      </Button>
                      <Button
                        type="submit"
                        size="md"
                        isLoading={isLoading}
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn "
                      >
                        Proceed to deliverables <ArrowRight />
                      </Button>
                    </div>

                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
