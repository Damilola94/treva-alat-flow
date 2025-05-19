'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import {
  storeValues,
  useAppDispatch,
  useAppSelector,
  useCreativeOnboardingForm,
} from '@/store';

interface FormData {
  email: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email address'),
});

export default function Page() {
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state?.register);

  const rt = useRouter();
  const { isLoading } = queries.login();
  const { setFormData } = useCreativeOnboardingForm();

  const initialValues: FormData = {
    email: email,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values: FormData) => {
      setFormData(values);
      dispatch(storeValues(values));

      rt.push(routes.creatives.onboarding.personalDetails.path);
    },
    validationSchema,
  });

  const { handleBlur, handleChange, handleSubmit, values, touched, errors } =
    formik;

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">Start your free trial</h3>
              <div className="flex flex-col gap-6">
                <div className="">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    size="xl"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
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
          </div>
        </div>
      </div>
    </div>
  );
}
