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
  fullName: string;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Please put in your first and last name')
    .test(
      'full-name',
      'Please enter at least two words (first and last name)',
      (value) => {
        if (!value) return false;
        const words = value.trim().split(/\s+/);
        return words.length >= 2;
      },
    ),
});

export default function Page() {
  const { fullName } = useAppSelector((state) => state?.register);
  const dispatch = useAppDispatch();
  const rt = useRouter();
  const { isLoading } = queries.login();
  const { setFormData } = useCreativeOnboardingForm();

  const initialValues: FormData = {
    fullName: fullName,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values: FormData) => {
      setFormData(values);
      dispatch(storeValues(values));
      rt.push(routes.creatives.onboarding.phoneNumber.path);
    },
    validationSchema,
  });

  const { errors, handleBlur, handleChange, handleSubmit, touched, values } =
    formik;

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">Your full name</h3>
              <div className="flex flex-col gap-6">
                <div className="">
                  <Input
                    name="fullName"
                    placeholder="Enter your full name"
                    size="xl"
                    value={values.fullName}
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
