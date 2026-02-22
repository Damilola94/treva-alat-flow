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
  useCreativeOnboardingForm,
} from '@/store';
import PasswordRule from '@/components/shared/password-rule';
import { errorToast, successToast, useRegisterMutation } from '@/services';
import { getErrorMessage } from '@/utils';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

// const passwordRegex =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$/gm;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$/;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email address'),

  password: Yup.string()
    .trim()
    .required('Please provide a password')
    .matches(
      passwordRegex,
      'We recommend using a minimum of 8 characters containing a mix of upper and lower case letters, special characters and numbers.',
    ),

  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export default function Page() {
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state?.register);
  const { password } = useAppSelector((state) => state?.register);
  const { actorType } = useAppSelector((state) => state?.register);

  const rt = useRouter();
  const { setFormData } = useCreativeOnboardingForm();

  const initialValues: FormData = {
    email: email || '',
    password: password || '',
    confirmPassword: '',
  };

  // const formik = useFormik({
  //   initialValues,
  //   onSubmit: (values: FormData) => {
  //     setFormData(values);
  //     dispatch(storeValues(values));

  //     rt.push(routes.creatives.onboarding.emailVerification.path);
  //   },
  //   validationSchema,
  // });

  const [triggerRegister, { isLoading: loadingRegister }] =
    useRegisterMutation();

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setFormData(values);
      dispatch(storeValues(values));
      try {
        const payload = {
          email: values.email,
          confirmPassword: values.confirmPassword,
          password: values.password,
          actorType,
        };

        const response = await triggerRegister(payload).unwrap();
        console.log(response, 'response');
        if (response?.isSuccess) {
          successToast(response?.message || 'Account created successfully');
          rt.push(routes.register.verifyEmail.path);
        } else {
          errorToast(getErrorMessage(response));
        }
      } catch (error) {
        errorToast(getErrorMessage(error));
      }
    },
    validationSchema,
  });

  const { handleBlur, handleChange, handleSubmit, values, touched, errors } =
    formik;
  const passwordRules = {
    minLength: values.password.length >= 8,
    hasUppercase: /[A-Z]/.test(values.password),
    hasLowercase: /[a-z]/.test(values.password),
    hasNumber: /\d/.test(values.password),
    hasSpecialChar: /[!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]/.test(
      values.password,
    ),
  };

  const isFormValid =
    values.email &&
    !errors.email &&
    values.password &&
    !errors.password &&
    values.confirmPassword &&
    !errors.confirmPassword &&
    Object.values(passwordRules).every(Boolean);

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">Create Account</h3>
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
                <div className="">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    size="xl"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  size="xl"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />

                <div className="flex flex-col gap-2 mt-2">
                  <PasswordRule
                    isValid={passwordRules.minLength}
                    label="At least 8 characters"
                  />
                  <PasswordRule
                    isValid={passwordRules.hasUppercase}
                    label="At least 1 uppercase letter"
                  />
                  <PasswordRule
                    isValid={passwordRules.hasLowercase}
                    label="At least 1 lowercase letter"
                  />
                  <PasswordRule
                    isValid={passwordRules.hasNumber}
                    label="At least 1 number"
                  />
                  <PasswordRule
                    isValid={passwordRules.hasSpecialChar}
                    label="At least 1 special character"
                  />
                </div>
              </div>

              <div className="">
                <Button
                  size="xl"
                  isLoading={loadingRegister}
                  disabled={!isFormValid}
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn"
                >
                  Create Account
                </Button>
                <p className="mt-3 text-sm text-[#4F4F4F]">
                  By clicking &lsquo;Create account&rsquo; , you agree to the
                  <span className="text-purple-500">Privacy Policy</span> and
                  <span className="text-purple-500">Term of use</span> of the
                  platform.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
