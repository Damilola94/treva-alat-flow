'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/shared/onboarding';
import {
  clearValues,
  loginSuccess,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { errorToast, successToast, useLoginMutation } from '@/services';
import { getErrorMessage, setCookie } from '@/utils';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';

export default function Page() {
  const [triggerLogin, { isLoading }] = useLoginMutation();
  const formData = useAppSelector((state) => state.register);
  const dispatch = useAppDispatch();
  const router = useRouter();

  console.log(formData);

  const onSubmit = async () => {
    const { email, password } = formData;
    try {
      const payload = {
        email,
        password,
      };
      const response = await triggerLogin(payload).unwrap();
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
          dispatch(clearValues());
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
      console.log(error);
    }
  };

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <div className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">Verification Successful</h3>

              <div className="flex flex-col gap-8">
                <p className="app_auth_verification__p">
                  Congratulations, your email has been verified successfully
                </p>
                <Button
                  size="xl"
                  isLoading={isLoading}
                  onClick={onSubmit}
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
