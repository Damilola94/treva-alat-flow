'use client';

import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { useClientOnboardingForm } from '@/store';

interface FormData {
  password: string
  password2: string
}

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  password2: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required')
});

const initialValues: FormData = {
  password: '',
  password2: ''
};

type InitialValues = ReturnType<() => typeof initialValues>;

export default function Page () {
  const rt = useRouter();
  const { isLoading } = queries.login();
  const { setFormData } = useClientOnboardingForm();

  const onSubmit = (values: FormData) => {
    const { password } = values;
    setFormData({ password });
    rt.push(routes.client.onboarding.emailVerification.path);
  };

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
                const {
                  values,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  errors,
                  touched
                } = props;

                const getProps = (args: { name: keyof InitialValues }) => {
                  const name = args.name;
                  return {
                    name,
                    id: name,
                    value: values[name],
                    onChange: handleChange,
                    onBlur: handleBlur,
                    errors,
                    touched
                  };
                };

                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <h3 className="app_auth_login__title">
                      Create your password
                    </h3>
                    <div className="flex flex-col gap-6">
                      <div className="">
                        <Input
                          {...getProps({ name: 'password' })}
                          type="password"
                          placeholder="At least 8 charaters"
                          size="xl"
                        />
                      </div>
                      <div className="">
                        <Input
                          {...getProps({ name: 'password2' })}
                          type="password"
                          placeholder="Re-enter Password"
                          size="xl"
                        />
                      </div>
                    </div>

                    <div className="">
                      <Button
                        size="xl"
                        isLoading={isLoading}
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn"
                      >
                        Next
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
