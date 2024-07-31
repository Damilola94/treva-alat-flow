import React from 'react'
import { Money4 } from '../../svgs'
import { BalanceCard } from './balance-card'
import { CreditScore } from './credit-score'
import { Loan } from './loan'
import Activity from './activity'

export function FinancialInformation () {
  return (
    <div className="app_personal_information app_personal_information_con flex flex-col gap-7 w-full">
      <div className="app_personal_information__header flex gap-4 items-center">
        <div className="flex gap-5">
          <p className="app_personal_information__header__btn flex items-center gap-2">
            <Money4 />
            Financial Information
          </p>
        </div>

        <div className="flex justify-between gap-5 hidden">
          <p className="app_personal_information__header__btn flex items-center gap-2">
            Lion
          </p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-5 w-full ">
        <BalanceCard />

        <CreditScore />
      </div>

      <div className="flex flex-col md:flex-row gap-5 w-full">
        <Loan />

        <Activity />
      </div>
    </div>
  )
}
