'use client';

import { Header } from '@/components/shared/onboarding';
import React from 'react';
import success from '@/app/assets/pngs/success.png';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const rt = useRouter();
  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div className="flex flex-col justify-center items-center text-center gap-6">
            {/* <Success /> */}
            <div className=" w-12">
              <Image
                src={success}
                alt="success"
                height={50}
                width={50}
                unoptimized
              />
            </div>
            <p className="font-bold text-[21px]">Verification successful</p>
            <p className="text-base">
              Congratulations, your email has been verified successfully
            </p>

            <Button
              size="xl"
              onClick={() => rt.push(routes.auth.signIn.path)}
              backgroundColor="primary-blue-500"
              className="w-full app_auth_login__btn mt-10"
            >
              Proceed to Onboarding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
