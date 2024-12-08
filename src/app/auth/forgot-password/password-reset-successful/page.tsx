'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { Header } from '@/components/shared/onboarding';
import Link from 'next/link';
import Image from 'next/image';
import auth from '@/lib/assets/auth';

export default function Page() {
  const { isLoading } = queries.login();

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper__password_reset">
        <div className="app_auth_login">
          <div>
            <Image
              src={auth.markedSuccess}
              alt="marked"
              className="w-10 justify-center items-center flex mx-auto"
              height={10}
              width={600}
            />
            <h3 className="app_auth_login__reset_successful">
              Password reset successful
            </h3>
            <div className="">
              <Link href={routes.auth.signIn.path}>
                <Button
                  size="xl"
                  isLoading={isLoading}
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn"
                >
                  Proceed to login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
