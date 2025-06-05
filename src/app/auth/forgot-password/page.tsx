'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared';
import Link from 'next/link';
import routes from '@/lib/routes';
import {
  errorToast,
  successToast,
  useForgotPasswordMutation,
} from '@/services';
import { getErrorMessage } from '@/utils';
import { useRouter } from 'next/navigation';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email address'),
});

export default function ForgotPassword() {
  const rt = useRouter();
  const [triggerForgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [message, setMessage] = useState('');

  const initialValues = {
    email: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
        };
        const response = await triggerForgotPassword(payload).unwrap();
        if (response?.isSuccess) {
          setEmailVerificationSent(true);
          setMessage(response?.data || '');
          successToast(response?.message || 'Success');
          localStorage.setItem('email', values?.email);
          rt.push(routes.auth.forgotPassword.resetEmail.path);
        } else {
          errorToast(response?.message || 'Something went wrong');
        }
      } catch (error) {
        errorToast(getErrorMessage(error));
      }
    },
  });

  return (
    <div className="app_auth_login_container">
      <div className="app_auth_login_container__header flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="z-40 flex items-center gap-2">
          <p className="app_auth_login_container__header__account">
            Don’t have an account?
          </p>
          <Link href={routes.creatives.onboarding.inputEmail.path}>
            <p className="app_auth_login_container__header__signin">Sign up</p>
          </Link>
        </div>
      </div>

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
            <h3 className="app_auth_login__title">Password reset</h3>
            <div className="flex flex-col gap-8">
              <div>
                <Input
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Email address"
                  size="xl"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </div>
            </div>
            <div>
              {emailVerificationSent ? (
                <p>{message}</p>
              ) : (
                <Button
                  type="submit"
                  size="xl"
                  isLoading={isLoading}
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn"
                >
                  Reset password
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
