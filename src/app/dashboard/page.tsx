import {
  Accounts,
  CustomerStats,
  NewOfferings,
  PerformanceAdvice,
  PerformanceScore,
  TreasuryRate,
  UpcomingTask
} from '@/components/shared/dashboard/dashboard'
import externalLinks from '@/lib/external-links'
import React from 'react'

function OpenAccount ({ isMobile = false }) {
  return (
    <div className={`app_dashboard_home__open__act ${isMobile ? 'app_dashboard_home__open__act--md' : ''}`}>
      <p className="app_dashboard_home__open__act__text">
        Open An <span>Account</span> Today
      </p>

      <div className="flex justify-center">
        <a className="app_dashboard_home__open__act__btn" href={externalLinks.ACCOUNT_OPENING} target="_blank" rel="noopener noreferrer">
          Get Started Now
        </a>
      </div>
    </div>
  )
}

export default function Page () {
  if (typeof OpenAccount === 'function') return null

  return (
    <div className="app_dashboard_page__pd app_customer_information app_dashboard_home">
      <CustomerStats />

      <div className="flex flex-col md:flex-row-reverse gap-4">
        <div className="md:w-3/6">
          <UpcomingTask />
        </div>

        <div className="md:w-3/6">
          <Accounts />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="app_dashboard_performance_con w-full lg:w-2/6 flex flex-col gap-4">
          <PerformanceScore />

          <PerformanceAdvice />

          <OpenAccount />
        </div>

        <div className="hidden lg:block lg:w-4/6">
          <NewOfferings />
        </div>
      </div>

      <OpenAccount isMobile />

      <TreasuryRate />

      <div className="block lg:hidden">
        <NewOfferings />
      </div>
    </div>
  )
}
