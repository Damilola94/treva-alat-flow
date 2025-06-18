/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pill, RenderIf } from '@/components/shared';
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';
import queries from '@/services/queries/projects';
import clientQueries from '@/services/queries/client-management';
import { ProjectType } from '@/services/queries/projects/enums';

interface IProps {
  onClose: () => void
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Please enter a project title'),
  description: Yup.string().required('Please enter a project description'),
  expectedDeliveryDate: Yup.string().required('Please enter a expected delivery date')
})

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export function AddProject ({ onClose }: IProps) {
  const [userType, setUserType] = useState<ProjectType>(ProjectType.PersonalProject);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string | null>(null);

  const initialValues = {
    title: '',
    description: '',
    expectedDeliveryDate: '',
    priority: AccountType.Low as `${AccountType}`,
    totalAmount: undefined,
    clientId: '',
    projectType: userType
  };

  type InitialValues = ReturnType<() => typeof initialValues>

  const { mutate, isLoading } = queries.create({
    onSuccess: () => {
      onClose();
    }
  });
  const { data, refetch } = clientQueries.read();

  useEffect(() => {
    if (data && userType === ProjectType.PersonalProject) {
      void refetch();
    }
  }, [userType, refetch, data]);

  const onSubmit = (
    _values: InitialValues) => {
    mutate(
      { ..._values }
    );
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
      <div className="app_auth_login_container__upper !-mt-40">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title">{userType === ProjectType.PersonalProject ? 'Add personal project' : 'Add client project'}</h3>
            <div className="billing-toggle">
            </div>
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
                    <div className="billing-toggle">
                      <button
                        className={userType === ProjectType.PersonalProject ? '' : 'active'}
                        onClick={() => {
                          setUserType(ProjectType.PersonalProject);
                          void props.setFieldValue('projectType', 'PersonalProject');
                        }}
                      >
                        Personal
                      </button>
                      <button
                        className={userType === ProjectType.Client ? '' : 'active'}
                        onClick={() => {
                          setUserType(ProjectType.Client);
                          void props.setFieldValue('projectType', 'ClientProject');
                        }}
                      >
                        Client
                      </button>

                    </div>
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
                      {userType === ProjectType.PersonalProject
                        ? (
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
                          )
                        : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                touched={touched} />
                              <Input
                                name="totalAmount"
                                type="text"
                                id="totalAmount"
                                placeholder="Amount"
                                size="xl"
                                value={values.totalAmount}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                errors={errors}
                                touched={touched} />
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
                          </>
                          )}

                    </div>
                    <div className="flex flex-col gap-8 my-5">
                      <p className='text-[#6D6D6D]'>Project Priority</p>
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
                            await setFieldValue(
                              'priority',
                              AccountType.Medium
                            )
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
                    <div className="flex justify-between items-center gap-5">
                      <Button
                        type='button'
                        size="md"
                        isLoading={isLoading}
                        backgroundColor="transparent"
                        color="primary-blue-500"
                        className="w-full app_auth_login__btn flex items-center justify-center gap-2 hover:bg-transparent border border-[#F1F1F1]"
                        onClick={onClose}
                      >
                        Save
                      </Button>
                      <Button
                        type='submit'
                        size="md"
                        isLoading={isLoading}
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn flex items-center justify-center gap-2"
                      >
                        {userType === ProjectType.PersonalProject
                          ? (
                            <>
                              Proceed to Invoice
                              <ArrowRight stroke='#fff' />
                            </>
                            )
                          : (
                              'Create Project'
                            )}
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
