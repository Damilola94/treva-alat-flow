'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pill, RenderIf } from '@/components/shared'
import queries from '@/services/queries/projects'
import { type InitialStep1Values } from '@/app/dashboard/project-management/client-project/create/page'
import { ProjectType } from '@/services/queries/projects/enums'
import clientQueries from '@/services/queries/client-management'

interface IProps {
  handleNext: (formData: InitialStep1Values) => void
  setProjectId: (id: string) => void
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Please enter a project title'),
  description: Yup.string().required('Please enter a project description'),
  expectedDeliveryDate: Yup.string().required('Please enter a expected delivery date'),
  priority: Yup.string().required('Please select a priority'),
  client: Yup.string().required('Please select a client')
})

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export function ProjectDetails (props: IProps) {
  const { handleNext, setProjectId } = props

  const [userType] = useState<ProjectType>(ProjectType.ClientProject);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string | null>(null);
  const { data, refetch } = clientQueries.read();

  const { mutate, isLoading } = queries.create({
    onSuccess: (response) => {
      if (response?.data?.id) {
        const projectId = response.data.id;
        setProjectId(projectId);
        console.log('Project ID:', projectId);
      } else {
        console.warn('Project ID not found. Polling...');
      }
    }
  });

  const initialValues = {
    title: '',
    description: '',
    expectedDeliveryDate: '',
    priority: AccountType.Low as `${AccountType}`,
    projectType: userType,
    clientId: ''
  };

    type InitialValues = ReturnType<() => typeof initialValues>

    const onSubmit = (_values: InitialValues) => {
      mutate({ ..._values });
      handleNext(_values)
    };

    useEffect(() => {
      if (data && userType === ProjectType.ClientProject) {
        void refetch();
      }
    }, [userType, refetch, data]);

    return (
        <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
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
                            setFieldValue,
                            handleBlur,
                            handleSubmit,
                            errors,
                            touched
                          } = props;
                          const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
                            const { value } = event.target;
                            setSelected(value);
                            void setFieldValue('clientId', value);
                          };

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
                                                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                                onClick={async () => await setFieldValue('priority', AccountType.Low)}
                                                active={values.priority === AccountType.Low}
                                                className="w-full"
                                            >
                                                Low
                                            </Pill>
                                            <Pill
                                                size="md"
                                                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                                onClick={async () => await setFieldValue('priority', AccountType.Medium)}
                                                active={values.priority === AccountType.Medium}
                                                className="w-full"
                                            >
                                                Medium
                                            </Pill>
                                            <Pill
                                                size="md"
                                                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                                onClick={async () => await setFieldValue('priority', AccountType.High)}
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
                                            onChange={handleSelectChange}
                                            className="w-full border-b-[#d1d5db] p-2 focus:ring-1 focus:ring-[#7B37F0] bg-white text-left"
                                        >
                                            <option value="" disabled>
                                                Select an option
                                            </option>
                                            {data?.data?.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.fullName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <RenderIf condition={!!errors.clientId}>
                                        <div>
                                            <p className="app_input_con__spt--error">
                                                {errors.clientId}
                                            </p>
                                        </div>
                                    </RenderIf>
                                    <div className="">
                                        <Button
                                            type='submit'
                                            size="md"
                                            isLoading={isLoading}
                                            backgroundColor="primary-blue-500"
                                            className="w-1/2 app_auth_login__btn flex items-center justify-center gap-2"
                                        >
                                            Save and Continue
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
