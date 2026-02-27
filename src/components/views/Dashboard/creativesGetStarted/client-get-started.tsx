'use client';
import React, { useEffect, useState } from 'react';
import { dashboardCards } from '@/constants';
import { useProfile } from '@/hooks/Users';
import { CreativesGetStartedCard } from './components/CreativesGetStartedCard';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';

export default function CreativesGetStarted() {
  // const { data } = useProfile();

  // const [showSteps, setShowSteps] = useState(false);
  // const { creativeOnboardingData, creativeOnboardingError } = useUsers();
  // const [onboardingComplete, setOnboardingComplete] = useState(false);

  // const onboardingStatus = useMemo(
  //   () => creativeOnboardingData?.data || null,
  //   [creativeOnboardingData],
  // );

  // useEffect(() => {
  //   if (
  //     data?.data?.isCompleted ||
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     (creativeOnboardingError as any)?.data?.message ===
  //     'CreativeOnboarding not found or already completed.'
  //   ) {
  //     setOnboardingComplete(true);      
  //   }
  // }, [onboardingStatus, creativeOnboardingError, data]);

   const { data } = useProfile();
    const router = useRouter();
    const [showSteps, setShowSteps] = useState(false);
  
    const onboardingComplete = data?.data?.isCompleted ?? false;
  
    useEffect(() => {
      if (onboardingComplete) {
        router.push(routes.creatives.dashboard.entry.path);
      }
    }, [onboardingComplete, router]);

  return (
    <div className="app_get_started flex flex-col gap-10 pb-10 mb-10 px-4">
      <div className="app_get_started__bg">
        <div className="app_get_started__bg__ctt">
          <h3 className="app_get_started__bg__ctt__text">
            Welcome, <span>{data?.data?.firstName}</span>
          </h3>
        </div>
      </div>
      <div className="app_get_started__ctt">
        <h3 className="app_get_started__ctt__title">Get started & set up</h3>
      </div>

      <div
        className={`app_get_started__ctt flex gap-6 ${
          showSteps ? 'items-start' : ''
        }`}
      >
        <CreativesGetStartedCard item={dashboardCards[0]} />
        {!onboardingComplete ? (
          <CreativesGetStartedCard
            item={dashboardCards[1]}
            handleClick={() => {
              setShowSteps(true);
            }}
            showSteps={showSteps}
          />
        ) : (
          <CreativesGetStartedCard
            item={dashboardCards[2]}
            handleClick={() => {
              setShowSteps(true);
            }}
            showSteps={false}
            showBtn={false}
          />
        )}
      </div>
    </div>
  );
}
