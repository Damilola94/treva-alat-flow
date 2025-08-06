'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import {
  storeValues,
  useAppDispatch,
  useAppSelector,
  useClientOnboardingForm,
} from '@/store';
import { errorToast, successToast, useRegisterMutation } from '@/services';
import { getErrorMessage } from '@/utils';
import { extractName } from '@/lib/utils';

interface FormData {
  password: string;
  password2: string;
}

export default function Page() {
  const dispatch = useAppDispatch();
  const { password, fullName, ...rest } = useAppSelector(
    (state) => state?.register,
  );
  const rt = useRouter();
  // const { isLoading } = queries.login();
  const { setFormData } = useClientOnboardingForm();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$/gm;

  const [triggerRegister, { isLoading }] = useRegisterMutation();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .trim('Password cannot contain spaces')
      .required('Please provide a password')
      .matches(
        passwordRegex,
        'We recommend using a minimum of 8 characters containing a mix of upper and lower case letters, special characters and numbers.',
      ),
    password2: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const initialValues: FormData = {
    password: password,
    password2: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const { password } = values;
      setFormData({ password });
      dispatch(storeValues({ password }));
      try {
        const { firstName, lastName } = extractName(fullName);
        const payload = {
          ...rest,
          firstName: firstName,
          lastName: lastName,
          password: values?.password,
          accountType: 'Individual',
        };
        const response = await triggerRegister(payload).unwrap();
        if (response?.isSuccess) {
          successToast(response?.message || 'Account created successfully');
          rt.push(routes.client.onboarding.emailVerification.path);
        } else {
          errorToast(getErrorMessage(response));
        }
      } catch (error) {
        errorToast(getErrorMessage(error));
      }
    },
    validationSchema,
  });

  const { handleBlur, handleChange, handleSubmit, errors, values, touched } =
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
                <div className="">
                  <Input
                    name="password2"
                    type="password"
                    placeholder="Re-enter Password"
                    size="xl"
                    value={values.password2}
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
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
