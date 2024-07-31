'use client'
import React from 'react'
import {
  CustomerStats,
  CustomerTable,
  DigitalAdoption
} from '@/components/shared/dashboard/account-management'
import { FinancialSegment } from '@/components/shared/dashboard/customer-information'
import { Accounts } from '@/components/shared/dashboard/dashboard'

export default function Page () {
  return (
    <div className="app_dashboard_page__pd app_customer_information">
      <CustomerStats />

      <div className="gap-4 md:flex">
        <div className="w-full">
          <Accounts />
        </div>

        <div className="flex flex-col gap-4 w-full app_customer_information__financial__con">
          <div className="app_customer_information__upper">
            <FinancialSegment />
          </div>
          <div className="app_customer_information__financial__con__banner">
            <p className="app_customer_information__financial__con__banner__text">
              Manage and keep track of all your <span>customers</span>{' '}
              efficiently.
            </p>
          </div>
        </div>
      </div>

      <DigitalAdoption />

      <div className="app_customer_information__lower">
        <div className="app_customer_information__lower__table">
          <CustomerTable />
        </div>
      </div>
    </div>
  )
}
