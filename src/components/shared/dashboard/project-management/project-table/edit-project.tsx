/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pill } from '@/components/shared';
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';
import { type InitialStep1Values } from '@/app/creatives/dashboard/project-management/personal-project/create/page';
import { ProjectType } from '@/services/queries/projects/enums';
import { useProjects, useUpdateProject } from '@/hooks/Projects/useProjects';
import { useAppDispatch, useAppSelector } from '@/store';
import { storeValues } from '@/store/slices/project';

interface IProps {
  id: string;
  item?: string;
  handleClick: () => void;
  onClose: () => void;
  onProceedToDeliverables?: () => void;
  setProjectId: (id: string) => void;
  setDeliverableId: (id: string) => void;
  handleNext: (formData: InitialStep1Values) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddDeliverable: (values: any) => void;
}

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}
interface ProjectQueryParams {
  type?: string;
  status?: string;
  priority?: string;
  currency?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

export function EditProject(props: IProps) {
  const { id, onClose, handleNext, setProjectId } = props;
  const dispatch = useAppDispatch()
  
    const [params, setParams] = useState<ProjectQueryParams>({
      // type: '2',
      // status: '2',
      // priority: '3',
      pageNumber: 1,
      pageSize: 50,
      currency: 'NGN',
      searchKey: '',
    });
  const { allProjectsData, refetchAllProjects } = useProjects(params);

    const { title, description, expectedDeliveryDate, priority } = useAppSelector((state) => state?.project)
  
    const validationSchema = Yup.object().shape({
    title: Yup.string().required('Please enter a project title'),
    description: Yup.string().required('Please enter a project description'),
    expectedDeliveryDate: Yup.date()
      .min(new Date(), 'Expected delivery date must be in the future')
      .required('Please enter an expected delivery date'),
    priority: Yup.string().required('Please select a priority'),
  });
  
  const { updateProject, isLoading } = useUpdateProject();

  const projectData = Array.isArray(allProjectsData?.data)
    ? allProjectsData?.data.find((p) => p.id === id)
    : allProjectsData?.data;

  const [userType, setUserType] = useState<ProjectType>(
    ProjectType.Personal,
  );

 const initialValues = {
    title: projectData?.title ?? '',
    description: projectData?.description ?? '',
    expectedDeliveryDate: projectData?.expectedDeliveryDate ?? '',
    priority: projectData?.priority ?? '',
    type: 'Personal',
  };

  type InitialValues = ReturnType<() => typeof initialValues>;

  // const onSubmit = async (_values: InitialValues) => {
  //  try {
  //     const response = await updateProject(_values).unwrap();
  //     if (response?.data?.id) {
  //       dispatch(storeValues(_values))
  //       setProjectId(response.data.id);
  //       handleNext(_values);
  //     } else {
        
  //       console.warn('Project ID not found. Cannot proceed to next step.');
  //     }
  //   } catch (error) {
  //     console.error('Failed to create project:', error);
  //   }
  //   };

  const onSubmit = async (_values: InitialValues) => {
  try {
    const response = await updateProject({
      projectId: id,
      body: _values,
    }).unwrap();

    if (response?.data?.id) {
      dispatch(storeValues(_values));
      setProjectId(response.data.id);
      handleNext(_values);
    } else {
      console.warn('Project ID not found. Cannot proceed to next step.');
    }
  } catch (error) {
    console.error('Failed to update project:', error);
  }
};

  return (
    <div className="app_auth_login_container relative !overflow-y-auto">
      <Image
        src={projectManagement.topGradient}
        alt="take a tour"
        className=""
        width={100}
        height={100}
        unoptimized
      />
      <div className="app_auth_login_container__upper !-mt-60">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title !mb-6">Edit Project</h3>
            <Formik
              enableReinitialize
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
                      <p className="text-[#6D6D6D]">Project Priority</p>
                      <div className="flex gap-2">
                        <Pill
                          size="md"
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
