import React from 'react'
import { ArrowDown, EmptyWallet, Moneys } from '../../svgs'

const data = [
  { id: 1, icon: <EmptyWallet />, details: 'Loan Repayable', bg: '#f6eaf4' },
  { id: 2, icon: <Moneys />, details: 'Amount Repayed', bg: '#ccffd1' },
  {
    id: 3,
    icon: <Moneys stroke="#D70000" />,
    details: 'Loan Balance',
    bg: '#ffd6d6'
  }
]

type ISingleLoanItem = (typeof data)[0]

interface ILoanItem {
  item: ISingleLoanItem
}

function LoanItem (props: ILoanItem) {
  const { item } = props
  return (
    <div className="app_account_management_loan__ctt__item flex flex-col gap-3">
      <div
        className="app_account_management_loan__ctt__item__icon"
        style={{ background: item.bg }}
      >
        {item.icon}
      </div>

      <p className="app_account_management_loan__ctt__item__details">
        {item.details}
      </p>

      <h4 className="app_account_management_loan__ctt__item__amount">₦0</h4>
    </div>
  )
}

export function Loan () {
  return (
    <div className="app_account_management_loan flex flex-col gap-4">
      <div className="flex justify-between gap-5">
        <p className="app_personal_information__header__btn app_account_management_loan__title flex items-center gap-2">
          Loan
        </p>

        <button type="button">
          <p className="app_gender_chart__btn app_account_management_loan__title">
            Gender
            <ArrowDown />
          </p>
        </button>
      </div>

      <div className="app_account_management_loan__ctt">
        {data?.map((item) => (
          <LoanItem key={item.id} item={item} />
        ))}
      </div>

      <div className="app_dashboard_upcoming_task__item app_account_management_loan__date">
        <div className="app_dashboard_upcoming_task__item__title ">
          <p className="app_account_management_loan__date__title">
            Loan Repayment Date
          </p>
        </div>

        <div className="flex">
          <p className="app_account_management_loan__date__text">
            <span>25 APR 2024</span>
          </p>
        </div>
      </div>
    </div>
  )
}
