'use client'

import { Pill, PlusIcon } from '@/components/shared'
import { InvoiceTable } from '@/components/shared/dashboard/invoice-and-payment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

enum Projects {
  'All Invoice' = 'All Invoice',
  'Pending Invoice' = 'Pending Invoice',
  'Closed Invoice' = 'Closed Invoice'
}

export default function Page () {
  return (
    <div className="app_dashboard_page app_dashboard_home">
      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(Projects).map(([label]) => (
              <Pill
                key={label}
                size='md'
                active={Projects['All Invoice'] === label}
              >
                {label}
              </Pill>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search for invoice"
              className="app_navbar__right__searchbar"
            />

            <Button
              size="md"
              backgroundColor="shark-950"
              className="app_auth_login__btn"
            >
              <PlusIcon />
              Add Invoice
            </Button>
          </div>
        </div>

        <InvoiceTable />
      </div>
    </div>
  )
}
