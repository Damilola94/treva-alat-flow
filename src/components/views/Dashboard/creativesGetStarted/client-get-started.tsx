'use client';
import React, { useState } from 'react';
import { dashboardCards } from '@/constants';
import { useProfile } from '@/hooks/Users';
import { CreativesGetStartedCard } from './components/CreativesGetStartedCard';

export default function CreativesGetStarted () {
 const { data } = useProfile();

  const [showSteps, setShowSteps] = useState(false);

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
        <CreativesGetStartedCard
          item={dashboardCards[1]}
          handleClick={() => {
            setShowSteps(true);
          }}
          showSteps={showSteps}
        />
      </div>
    </div>
  );
}
