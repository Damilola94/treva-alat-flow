import React from 'react'
import { ArrowDown, CardReceive } from '../../svgs'

interface IActivityItem {
  type: 'Credit' | 'Debit'
}

function ActivityItem (props: IActivityItem) {
  const { type } = props

  const debitCn =
    type === 'Debit' ? 'app_account_management_activity__ctt__item__debit' : ''

  return (
    <div
      className={`app_account_management_activity__ctt__item flex item-center justify-between gap-4 ${debitCn}`}
    >
      <div className="flex items-center">
        <div className="app_account_management_activity__ctt__item__icon">
          <CardReceive stroke={type === 'Debit' ? '#D70000' : undefined} />
        </div>
        <div>
          <p className="app_account_management_activity__ctt__item__credit">
            {type}
          </p>
          <p className="app_account_management_activity__ctt__item__type">
            Deposit
          </p>
        </div>
      </div>

      <div className="">
        <p className="app_account_management_activity__ctt__item__amount">
          +N 40,000.00
        </p>

        <p className="app_account_management_activity__ctt__item__date">
          29 Jan 2024
        </p>
      </div>
    </div>
  )
}

export default function Activity () {
  return (
    <div className="app_account_management_activity app_account_management_loan flex flex-col gap-4">
      <div className="flex justify-between gap-5">
        <p className="app_personal_information__header__btn app_account_management_loan__title flex items-center gap-2">
          Recent Activity
        </p>

        <button type="button">
          <p className="app_gender_chart__btn app_account_management_loan__title">
            0152261464
            <ArrowDown />
          </p>
        </button>
      </div>

      <div className="app_account_management_activity__ctt flex-1 flex-col gap-4 overflow-y">
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <ActivityItem
              key={index}
              type={index % 2 === 0 ? 'Credit' : 'Debit'}
            />
          ))}
      </div>
    </div>
  )
}
