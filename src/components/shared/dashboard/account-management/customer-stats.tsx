import React from 'react'
import { Profile2User, ProfileAdd } from '../..'
import queries from '@/services/queries/account-management/transaction-summary'
import { Skeleton } from '@/components/ui/skeleton'

const useStats = () => {
  const { data } = queries.read()

  return [
    { label: 'Total Customers', value: data?.responseData?.totalCustomers ?? 0, icon: <Profile2User /> },
    {
      label: 'Active and Transacting  Accounts',
      iconClassName: 'green',
      value: data?.responseData?.activeAndTransacting ?? 0,
      icon: <ProfileAdd />
    },
    {
      label: 'Active and Non-Transacting  Accounts',
      iconClassName: 'green',
      value: data?.responseData?.activeAndNonTransacting ?? 0,
      icon: <ProfileAdd />
    },
    {
      label: 'Inactive and Dormant Accounts',
      iconClassName: 'red',
      value: data?.responseData?.inactiveAndDormant ?? 0,
      icon: <Profile2User />
    }
  ]
}

export function CustomerStats () {
  const { data, isLoading } = queries.read()

  const stats = useStats()

  if (!data?.responseData && isLoading) {
    return (
      <div className="flex overflow-x-auto gap-[20px]">
        {Array(4).fill(0).map((_, index) => (
          <div
            key={index}
            className="app_dashboard_customer_stats__single overflow-x-hidden"
          >
            <Skeleton height={167} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex overflow-x-auto gap-[20px]">
      {stats.map((item) => (
        <div
          className="app_dashboard_customer_stats__single overflow-x-hidden"
          key={item.label}
        >
          <div className="app_dashboard_customer_stats__item flex flex-col gap-3">
            <div
              className={[
                'app_dashboard_customer_stats__item__icon',
                item.iconClassName ?? ''
              ].join(' ')}
            >
              {item.icon}
            </div>

            <p className="app_dashboard_customer_stats__item__label">
              {item.label}
            </p>

            <p className="app_dashboard_customer_stats__item__value">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
