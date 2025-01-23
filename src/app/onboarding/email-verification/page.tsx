'use client';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { useForm } from '../context/onboard-context';
import { extractName } from '@/lib/utils';

const validationSchema = Yup.object().shape({});

const initialValues = {
  email: '',
};

export default function Page() {
  const rt = useRouter();
  const { formData } = useForm();
  const { isLoading, mutate } = queries.create();
 
  const onSubmit = () => {
    const { email, professions, fullName, password, accountType } = formData;
    const { firstName, lastName } = extractName(fullName);

    const payload = {
      accountType,
      email,
      password,
      firstName: firstName,
      lastName: lastName,
      professionIds: professions,
      organization: {
        name: 'string',
        organizationSizeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      },
    };
    mutate(payload);
  };

  const email = formData.email ?? '';

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(props) => {
                const { handleSubmit } = props;

                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <h3 className="app_auth_login__title">
                      Email Verification
                    </h3>

                    <div className="flex flex-col gap-8">
                      <p className="app_auth_verification__p">
                        We'll send an email to
                        <br />
                        <span className="app_auth_verification__p__span">
                          <strong>{email}</strong>
                        </span>
                        <br />
                        <br />
                        Verify your email to begin
                      </p>
                      <Button
                        size="xl"
                        isLoading={isLoading}
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn"
                      >
                        Sign Up
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
