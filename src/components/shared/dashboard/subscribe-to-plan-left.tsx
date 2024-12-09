'use client';
import { Button } from '@/components/ui/button';
import { SetupFlower } from '@/components/shared/svgs'

export function SubscribeToPlanLeft () {
  return (
    <header className="app_dash_main__stp_left -z-50">
      <div className="flex justify-center items-center space-x-5">
        <p className="app_dash_main__stp_left__title">
          Your free trial will expire in 7 days
        </p>
        <Button size="md" backgroundColor="shark-950" className="">
          Subscribe to a plan
        </Button>
      </div>
      <div className='flex space-x-2 items-center'>
      <SetupFlower />
        <p className="app_dash_main__stp_left__title">Complete Setup</p>
      </div>
    </header>
  );
}
