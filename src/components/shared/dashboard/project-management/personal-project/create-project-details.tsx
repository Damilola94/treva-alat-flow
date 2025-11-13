'use client';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/shared';
import { type InitialStep1Values } from '@/app/creatives/dashboard/project-management/personal-project/create/page';
import { useCreateProjectMutation } from '@/services';
import {  useAppDispatch, useAppSelector } from '@/store';
import { storeValues } from '@/store/slices/project';

interface IProps {
  handleNext: (formData: InitialStep1Values) => void
  setProjectId: (id: string) => void
}

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export function PersonalProjectDetails (props: IProps) {
  const { handleNext, setProjectId } = props;
  const dispatch = useAppDispatch()
  const { title, description, expectedDeliveryDate, priority } = useAppSelector((state) => state?.project)

  const validationSchema = Yup.object().shape({
  title: Yup.string().required('Please enter a project title'),
  description: Yup.string().required('Please enter a project description'),
  expectedDeliveryDate: Yup.date()
    .min(new Date(), 'Expected delivery date must be in the future')
    .required('Please enter an expected delivery date'),
  priority: Yup.string().required('Please select a priority'),
});

  const [createProject, { isLoading }] = useCreateProjectMutation();

  const initialValues = {
    title: title,
    description: description,
    expectedDeliveryDate: expectedDeliveryDate,
    priority: priority,
    type: 'Personal',
  }; 

  type InitialValues = ReturnType<() => typeof initialValues>;

const onSubmit = async (_values: InitialValues) => {
  try {
    const response = await createProject(_values).unwrap();
    if (response?.data?.id) {
      dispatch(storeValues(_values))
      setProjectId(response.data.id);
      handleNext(_values);
    } else {
      console.warn('Project ID not found. Cannot proceed to next step.');
    }
  } catch (error) {
    console.error('Failed to create project:', error);
  }
};


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
            enableReinitialize={true}
          >
            {(props) => {
              const {
                values,
                handleChange,
                setFieldValue,
                handleBlur,
                handleSubmit,
                errors,
                touched,
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
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={async () =>
                          await setFieldValue('priority', AccountType.Low)
                        }
                        active={values.priority === AccountType.Low}
                        className="w-full"
                      >
                        Low
                      </Pill>
                      <Pill
                        size="md"
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={async () =>
                          await setFieldValue('priority', AccountType.Medium)
                        }
                        active={values.priority === AccountType.Medium}
                        className="w-full"
                      >
                        Medium
                      </Pill>
                      <Pill
                        size="md"
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={async () =>
                          await setFieldValue('priority', AccountType.High)
                        }
                        active={values.priority === AccountType.High}
                        className="w-full"
                      >
                        High
                      </Pill>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button
                      type="submit"
                      size="md"
                      isLoading={isLoading}
                      backgroundColor="primary-blue-500"
                      className="w-1/2 app_auth_login__btn gap-2"
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
