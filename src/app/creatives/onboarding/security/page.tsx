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
  password: string;
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$/gm;

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .trim('Password cannot contain spaces')
    .required('Please provide a password')
    .matches(
      passwordRegex,
      'We recommend using a minimum of 8 characters containing a mix of upper and lower case letters, special characters and numbers.',
    )
});

export default function Page() {
  const dispatch = useAppDispatch();
  const { password } = useAppSelector((state) => state?.register);
  const rt = useRouter();
  const { isLoading } = queries.login();
  const { setFormData } = useCreativeOnboardingForm();

  const initialValues: FormData = {
    password: password,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      dispatch(storeValues(values));
      setFormData(values);
      rt.push(routes.creatives.onboarding.accountType.path);
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
              <h3 className="app_auth_login__title">Create your password</h3>
              <div className="flex flex-col gap-6">
                <div className="">
                  <Input
                    name="password"
                    type="password"
                    placeholder="At least 8 charaters"
                    size="xl"
                    value={values.password}
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
