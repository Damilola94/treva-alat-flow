'use client'
import React from 'react'
import { Bubble } from '../..'
import GenderBarChart from '../customer-information/gender-bar-chart'
import queries from '@/services/queries/account-management/transaction-summary'
import { Skeleton } from '@/components/ui/skeleton'
import { getParseFloat } from '@/lib/numbers'

const getPercentage = (total = 0, amount = 0) => {
  if (!total) return 0

  return (amount / total) * 100
}

export const useAccountsData = () => {
  const { data } = queries.read()

  const AT = getParseFloat(data?.responseData?.activeAndTransacting ?? 0)
  const ANT = getParseFloat(data?.responseData?.activeAndNonTransacting ?? 0)
  const IAD = getParseFloat(data?.responseData?.inactiveAndDormant ?? 0)

  const total = AT + ANT + IAD

  return [
    {
      name: 'AC',
      fullLabel: 'Active & Transacting',
      percent: getPercentage(total, AT),
      max: 100,
      index: 1,
      fill: '#00C213'
    },

    {
      name: 'DA',
      fullLabel: 'Inactive & Dormant',
      percent: getPercentage(total, IAD),
      max: 100,
      index: 2,
      fill: '#D70000'
    },

    {
      name: 'FE',
      fullLabel: 'Active & Not Transacting',
      percent: getPercentage(total, ANT),
      max: 100,
      index: 2,
      fill: '#D70000'
    }
  ]
}

export function Accounts () {
  const { data, isLoading } = queries.read()

  const accountsData = useAccountsData()

  if (!data?.responseData && isLoading) {
    return (
    <div className="app_gender_chart flex flex-col gap-6">
      <Skeleton height={320} />
    </div>
    )
  }

  return (
    <div className="app_gender_chart flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <button className="app_gender_chart__btn">
            <Bubble />
            Accounts
          </button>
        </div>
      </div>
      <div className="app_gender_chart__bar__chart flex gap-10 items-center">
        <GenderBarChart data={accountsData} />
      </div>
    </div>
  )
}
