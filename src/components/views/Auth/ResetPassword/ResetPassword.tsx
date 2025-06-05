'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared';
import Link from 'next/link';
import routes from '@/lib/routes';
import { errorToast, successToast, useResetPasswordMutation } from '@/services';
import { getErrorMessage } from '@/utils';
import { useRouter } from 'next/navigation';

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Please enter a new password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPassword = () => {
  const rt = useRouter();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [triggerReset, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawToken = params.get('token') || '';
    const emailParam = params.get('email') || '';
    setToken(rawToken.replace(/ /g, '+'));
    setEmail(emailParam);
  }, []);

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          newPassword: values?.confirmPassword,
          token: token,
          email: email,
        };
        const response = await triggerReset(payload).unwrap();
        if (response?.isSuccess) {
          successToast(response?.message || 'Success');
          rt.push(routes.auth.forgotPassword.passwordResetSuccessful.path);
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
            <h3 className="app_auth_login__title">Set new password</h3>
            <div className="flex flex-col gap-8">
              <Input
                name="password"
                type="password"
                id="password"
                placeholder="New password"
                size="xl"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />
              <Input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                size="xl"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
              />
            </div>
            <div className="">
              <Button
                type="submit"
                size="xl"
                isLoading={isLoading}
                backgroundColor="primary-blue-500"
                className="w-full app_auth_login__btn"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
