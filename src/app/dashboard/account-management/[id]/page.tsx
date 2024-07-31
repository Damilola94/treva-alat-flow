'use client'

import React from 'react'
import { Recommendations } from '@/components/shared/dashboard/account-management/recommendations'
import { Psychographics } from '@/components/shared/dashboard/customer-information/psychographics'
import { FinancialInformation } from '@/components/shared/dashboard/account-management'
import { PersonalInfo } from '@/components/shared/dashboard/personal-info'

export default function Page () {
  return (
    <div className="app_dashboard_page__pd app_customer_information">
      <PersonalInfo />

      <FinancialInformation />

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/6">
          <Psychographics />
        </div>

        <div className="lg:w-4/6">
          <Recommendations />
        </div>
      </div>
    </div>
  )
}
