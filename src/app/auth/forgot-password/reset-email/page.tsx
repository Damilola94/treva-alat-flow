'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { Header } from '@/components/shared/onboarding';
import Link from 'next/link';

export default function Page () {
  const { isLoading } = queries.login();

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title">Password reset email sent</h3>
            <div className="flex flex-col gap-8">
              <h3 className="app_auth_login__forgot_password_reset_link">
                A link as been sent to your email{' '}
                <span className="font-bold">moyin.akindele@gmail.com</span>
              </h3>
            </div>
            <div className="">
              <Link href={routes.auth.forgotPassword.resetPassword.path}>
                <Button
                  size="xl"
                  isLoading={isLoading}
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn"
                >
                  Continue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
