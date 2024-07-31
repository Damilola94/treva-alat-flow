import { numberFormat } from '@/lib/numbers'
import queries from '@/services/queries/account-management'
import React from 'react'

function BalanceCardItem () {
  const { data } = queries.readOne()

  return (
    <div className="app_balance_card__item flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="app_balance_card__item__details">
          <p className="app_balance_card__item__details__text">Balance</p>
        </div>

        <div className="flex items-center app_balance_card__item__details">
          <p className="app_balance_card__item__details__text">
            Statement of Account
          </p>
        </div>
      </div>

      <h3 className="app_balance_card__item__amount">{numberFormat(data?.responseData?.clearBalance ?? 0)}</h3>

      <div className="flex justify-between">
        <div className="flex items-center app_balance_card__item__details">
          <p className="app_balance_card__item__details__text">
            Statement of Account
          </p>
        </div>

        <div className="app_balance_card__item__details">
          <p className="app_balance_card__item__details__text">Balance</p>
        </div>
      </div>
    </div>
  )
}

export function BalanceCard () {
  return (
    <div className="app_balance_card">
      <div className="app_balance_card__con">
        <BalanceCardItem />
        <BalanceCardItem />
      </div>
    </div>
  )
}
