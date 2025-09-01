'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { GetStartedCard } from './components/GetStartedCard';
import { dashboardCards } from '@/constants';
import { useProfile, useUsers } from '@/hooks/Users';

export default function GetStarted() {
  const { data } = useProfile();

  const [showSteps, setShowSteps] = useState(false);
  const { userOnboardingData, clientOnboardingError } = useUsers();
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const onboardingStatus = useMemo(
    () => userOnboardingData?.data || null,
    [userOnboardingData],
  );

  useEffect(() => {
    if (
      onboardingStatus?.isCompleted ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (clientOnboardingError as any)?.data?.message ===
        'ClientOnboarding not found or already completed.'
    ) {
      setOnboardingComplete(true);
    }
  }, [onboardingStatus, clientOnboardingError]);

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
        <GetStartedCard item={dashboardCards[0]} />
        {!onboardingComplete ? (
          <GetStartedCard
            item={dashboardCards[1]}
            handleClick={() => {
              setShowSteps(true);
            }}
            showSteps={showSteps}
          />
        ) : (
          <GetStartedCard
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
