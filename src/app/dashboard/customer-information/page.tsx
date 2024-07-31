'use client'
import React from 'react'
import {
  FinancialSegment,
  Demographics,
  CustomerTable,
  Sidebar
} from '@/components/shared/dashboard/customer-information'

export default function Page () {
  return (
    <div className="app_dashboard_page__pd app_customer_information">
      <div className="app_customer_information__upper">
        <Demographics />
        {false && <FinancialSegment />}
      </div>

      <div className="app_customer_information__lower">
        <div className="app_customer_information__lower__table">
          <CustomerTable />
        </div>

        <div className="app_customer_information__lower__sidebar">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
