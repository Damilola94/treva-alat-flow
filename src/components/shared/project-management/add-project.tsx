/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import { Pill } from '@/components/shared';
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';

type UserType = 'Client' | 'Personal';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email address')
});

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

const initialValues = {
  email: process.env.NEXT_PUBLIC_CLIENT_EMAIL ?? '',
  password: process.env.NEXT_PUBLIC_CLIENT_PASSWORD ?? '',
  accountType: AccountType.Low as `${AccountType}`
};

export function AddProject () {
  const { mutate, isLoading } = queries.login();
  const [userType, setUserType] = useState<UserType>('Client');
  return (
    <div className="app_auth_login_container relative">
        <Image
          src={projectManagement.topImageCreateProject}
          alt="take a tour"
          className="w-full"
        />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title">Add personal project</h3>
            <div className="billing-toggle">
              <button
                className={userType === 'Personal' ? '' : 'active'}
                onClick={() => {
                  setUserType('Client');
                }}
              >
                Personal
              </button>
              <button
                className={userType === 'Client' ? '' : 'active'}
                onClick={() => {
                  setUserType('Personal');
                }}
              >
                Client
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={mutate}
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
                          name="email"
                          type="email"
                          id="email"
                          placeholder="Project title"
                          size="xl"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <Input
                        name="password"
                        type="password"
                        id="password"
                        placeholder="Project description"
                        size="xl"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                      <Input
                        name="password"
                        type="date"
                        id="password"
                        placeholder="Expected delivery date"
                        size="xl"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="flex flex-col gap-8 my-5">
                      <div className="flex gap-2">
                        <Pill
                          size="md"
                          onClick={async () =>
                            await setFieldValue('accountType', AccountType.Low)
                          }
                          active={values.accountType === AccountType.Low}
                          className="w-full"
                        >
                          Low
                        </Pill>

                        <Pill
                          size="md"
                          onClick={async () =>
                            await setFieldValue(
                              'accountType',
                              AccountType.Medium
                            )
                          }
                          active={values.accountType === AccountType.Medium}
                          className="w-full"
                        >
                          Medium
                        </Pill>
                        <Pill
                          size="md"
                          onClick={async () =>
                            await setFieldValue('accountType', AccountType.High)
                          }
                          active={values.accountType === AccountType.High}
                          className="w-full"
                        >
                          High
                        </Pill>
                      </div>
                    </div>
                    <div className="flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5 m">
                      <Button
                        size="md"
                        isLoading={isLoading}
                        backgroundColor="transparent"
                        color="primary-blue-500"
                        className="w-full hover:bg-transparent ml-10 app_auth_login__btn"
                      >
                        Save
                      </Button>
                      <Button
                        size="md"
                        isLoading={isLoading}
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn"
                      >
                        Create Project
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
