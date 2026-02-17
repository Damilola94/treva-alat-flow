'use client';
import React from 'react';
import { Header } from '@/components/shared/onboarding';
import { useAppSelector } from '@/store';
import {
  errorToast,
  successToast,
  useResendVerificationMutation,
} from '@/services';
import { getErrorMessage } from '@/utils';

export default function Page() {
  const { email } = useAppSelector((state) => state?.register);

  const [resendEmail, { isLoading }] = useResendVerificationMutation();

  const handleResend = async () => {
    if (!email) return;

    try {
      const response = await resendEmail({ email }).unwrap();
      if (response?.isSuccess) {
        successToast(
          response?.message || 'Verification email resent successfully',
        );
      } else {
        errorToast(getErrorMessage(response));
      }
    } catch (error) {
      errorToast(getErrorMessage(error));
    }
  };

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-8">
                <p className="app_auth_verification__p">
                  We have sent an email to
                  <br />
                  <span className="app_auth_verification__p__span">
                    <strong>{email}</strong>
                  </span>
                  <br />
                  <br />
                  Verify your email to begin
                </p>
              </div>

              <p className="text-[#6D6D6D] text-[14px] mt-5">
                Didn&apos;t get email?{' '}
                <button
                  disabled={isLoading}
                  onClick={handleResend}
                  role="button"
                  className="text-purple-500 font-bold"
                >
                  {isLoading ? 'Sending...' : 'Resend'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
