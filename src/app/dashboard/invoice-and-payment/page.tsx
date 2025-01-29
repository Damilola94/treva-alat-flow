'use client'

import { AnimatedModal, Pill, PlusIcon, RenderIf } from '@/components/shared'
import { TakeATour } from '@/components/shared/client-management'
import { InvoiceTable } from '@/components/shared/dashboard/invoice-and-payment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import projectManagement from '@/lib/assets/project-management'
import routes from '@/lib/routes'
import Link from 'next/link'
import React, { Fragment, useState } from 'react'

enum Projects {
  'All Invoice' = 'All Invoice',
  'Pending Invoice' = 'Pending Invoice',
  'Closed Invoice' = 'Closed Invoice'
}

const viewTakeATour = {
  img: projectManagement.topImage,
  title: 'Add invoice',
  details:
    "You're almost there! Complete your onboarding to unlock the full potential of Creathrivity and start achieving your goals today.",
  btnText1: 'Start tour',
  btnText2: 'Skip',
  bottomInfo: ''
};

export default function Page () {
  const [takeATour, setTakeATour] = useState(true);

  const handleTakeTourClick = () => {
    setTakeATour(!takeATour);
  };

  return (
    <div className="app_dashboard_page app_dashboard_home">

      <RenderIf condition={takeATour}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'middle',
              onClose: handleTakeTourClick,
              className: 'sm:max-w-[300px] h-[420px] p-0'
            }}
          >
            <TakeATour item={viewTakeATour} handleClick={handleTakeTourClick} />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

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

            <Link href={routes.dashboard.invoiceAndPayment.projectDetails.path}>
            <Button
              size="md"
              backgroundColor="primary-blue-500"
              className="app_auth_login__btn"
            >
              <PlusIcon />
              Add Invoice
            </Button>
            </Link>
          </div>
        </div>

        <InvoiceTable />
      </div>
    </div>
  )
}
