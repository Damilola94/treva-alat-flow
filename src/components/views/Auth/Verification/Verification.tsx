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
import { MiniLoader } from '@/components/shared';
import SuccessImage from '../../../../../public/media/images/auth/marked-success.png';
import Image from 'next/image';
import ErrorImage from '@/app/assets/pngs/error.png';

export default function Verification() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsloading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [triggerVerify, { isLoading: verificationLoading }] =
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

  useEffect(() => {
    if (verified) {
      dispatch(clearValues());
    }
  }, [verified]);

  if (isLoading || verificationLoading) {
    return <MiniLoader message="Loading" />;
  }

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login !flex !flex-col !items-center text-center ">
          {verified ? (
            <Image src={SuccessImage} alt="Success" className="w-24 h-24 mx-auto mb-[40px]" unoptimized />
          ) : (
            <Image src={ErrorImage} alt="Error" className="w-24 h-24 mx-auto mb-[40px]" unoptimized />
          )}
          <div className="flex flex-col gap-8 !mt-10">
            <h3 className="app_auth_login__title">
              {verified ? 'Verification successful' : 'Verification Unsuccessful'}
            </h3>
            <div className="flex flex-col gap-4 justify-center items-center">
              <p className="app_auth_verification__p">
                {verified
                  ? 'Congratulations, your email has been verified successfully'
                  : 'Your link has expired'}
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
                  Proceed to Onboarding
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
