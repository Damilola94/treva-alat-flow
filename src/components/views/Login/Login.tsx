'use client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared';
import Link from 'next/link';
import routes from '@/lib/routes';
import { errorToast, successToast, useLoginMutation } from '@/services';
import { getErrorMessage, setCookie } from '@/utils';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [triggerLogin, { isLoading }] = useLoginMutation();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Please enter your email address'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Please enter your password'),
  });

  const initialValues = {
    email: '',
    password: '',
  };

  const loginFormik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        const response = await triggerLogin(values).unwrap();
        if (response?.isSuccess && response?.data) {
          if (
            response?.data?.accessToken &&
            typeof response?.data?.accessToken === 'string'
          ) {
            setCookie('_tk', response?.data?.accessToken);
            setCookie('_rtk', response?.data?.refreshToken as string);
            dispatch(
              loginSuccess({
                expiry: response?.data?.expiry,
                userId: response?.data?.userId,
                email: response?.data?.email,
                role: response?.data?.roles,
              }),
            );
          }
          successToast('Sign in successful');
          setTimeout(() => {
            response?.data?.roles?.includes('Creative') &&
              router.push(routes.creatives.dashboard.entry.path);
            response?.data?.roles?.includes('Client') &&
              router.push(routes.client.dashboard.entry.path);
          }, 500);
        } else {
          errorToast(getErrorMessage(response));
        }
      } catch (error) {
        errorToast(getErrorMessage(error));
      }
    },
    validationSchema,
  });

  const { handleBlur, handleChange, handleSubmit, errors, touched, values } =
    loginFormik;

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
          <Link href={routes.onboarding.types.path}>
            <p className="app_auth_login_container__header__signin">Sign up</p>
          </Link>
        </div>
      </div>
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">Sign in</h3>
              <div className="flex flex-col gap-8">
                <div className="">
                  <Input
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Email address"
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
                  placeholder="Password"
                  size="xl"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="">
                <Button
                  size="xl"
                  isLoading={isLoading}
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
              <Link href={routes.auth.forgotPassword.path}>
                <h3 className="app_auth_login__forgot_password">
                  Forgot password?
                </h3>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
