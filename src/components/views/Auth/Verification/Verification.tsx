/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/shared/onboarding';
import { Button } from '@/components/ui/button';
import routes from '@/lib/routes';
import { errorToast, successToast, useVerifyAccountMutation } from '@/services';
import { clearValues, useAppDispatch } from '@/store';
import { getErrorMessage } from '@/utils';
import { useRouter } from 'next/navigation';

export default function Verification() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsloading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [triggerVerify, { data, isLoading: verificationLoading }] =
    useVerifyAccountMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawToken = params.get('token') || '';
    const emailParam = params.get('email') || '';
    setToken(rawToken.replace(/ /g, '+'));
    setEmail(emailParam);
  }, []);

  useEffect(() => {
    if (token) {
      handleVerify();
    }
  }, [token]);

  const handleVerify = async () => {
    const payload = { token, email };
    try {
      const response = await triggerVerify(payload).unwrap();
      if (response?.isSuccess) {
        setVerified(true);
        successToast(response?.message || 'Account verified successfully');
      } else {
        setVerified(false);
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    } finally {
      setIsloading(false);
    }
  };

  if (isLoading || verificationLoading) {
    return (
      <div className="app_auth_login">
        <div className="flex flex-col gap-12">
          <div
            className="flex justify-center items-center"
            style={{ minHeight: 200 }}
          >
            <span className="txxx_loader" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div className="flex flex-col gap-8">
            <h3 className="app_auth_login__title">
              {verified ? 'Verification successful' : 'Verification Failed'}
            </h3>
            <div className="flex flex-col gap-8">
              <p className="app_auth_verification__p">
                {verified
                  ? 'Congratulations, your email has been verified successfully'
                  : data?.message || 'Something went wrong'}
              </p>

              {verified && (
                <Button
                  size="xl"
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn"
                  onClick={() => {
                    dispatch(clearValues());
                    router.push(routes.auth.signIn.path);
                  }}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
