'use client'

import React from 'react'
import { Cards, Profile2User, ProfileAdd, ProfileRemove } from '../..'
import { Skeleton } from '@/components/ui/skeleton'
import queries from '@/services/queries/account-management/transaction-summary'

export function CustomerStats () {
  const { data, isLoading } = queries.read()

  if (!data?.responseData && isLoading) {
    return (
      <div className="app_dashboard_customer_stats">
        <div className="app_dashboard_customer_stats__item big flex flex-col gap-3" style={{ padding: 0 }}>
          <Skeleton height={185} />
        </div>

        {Array(3).fill(0).map((_, index) => (
          <div
            key={index}
            className="app_dashboard_customer_stats__item big flex flex-col gap-3" style={{ padding: 0 }}
          >
            <Skeleton height={185} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="app_dashboard_customer_stats">
      <div className="app_dashboard_customer_stats__purple__wrapper">
        <div className="app_dashboard_customer_stats__item purple flex flex-col gap-3">
          <div className="app_dashboard_customer_stats__item__icon">
            <Profile2User />
          </div>

          <p className="app_dashboard_customer_stats__item__label">
            Total Customers
          </p>

          <p className="app_dashboard_customer_stats__item__value">{data?.responseData?.totalCustomers ?? 0}</p>
        </div>

        <div className="app_dashboard_customer_stats__divider"></div>

        <div className="app_dashboard_customer_stats__item purple flex flex-col gap-3">
          <div className="flex">
            <div className="app_dashboard_customer_stats__item__icon">
              <Cards />
            </div>
          </div>

          <p className="app_dashboard_customer_stats__item__label">
            Total Accounts
          </p>

          <p className="app_dashboard_customer_stats__item__value">{data?.responseData?.totalAccount ?? 0}</p>
        </div>
      </div>

      <div className="app_dashboard_customer_stats__item big flex flex-col gap-3">
        <div className="app_dashboard_customer_stats__item__icon green">
          <ProfileAdd />
        </div>

        <p className="app_dashboard_customer_stats__item__label">
          Active and Transacting Accounts
        </p>

        <p className="app_dashboard_customer_stats__item__value">{data?.responseData?.activeAndTransacting ?? 0}</p>
      </div>

      <div className="app_dashboard_customer_stats__item big flex flex-col gap-3">
        <div className="app_dashboard_customer_stats__item__icon green">
          <ProfileAdd />
        </div>

        <p className="app_dashboard_customer_stats__item__label">
          Active and Non-Transacting Accounts
        </p>

        <p className="app_dashboard_customer_stats__item__value">{data?.responseData?.activeAndNonTransacting ?? 0}</p>
      </div>

      <div className="app_dashboard_customer_stats__item big flex flex-col gap-3">
        <div className="app_dashboard_customer_stats__item__icon red">
          <ProfileRemove />
        </div>

        <p className="app_dashboard_customer_stats__item__label">
          Inactive and Dormant Accounts
        </p>

        <p className="app_dashboard_customer_stats__item__value">{data?.responseData?.inactiveAndDormant ?? 0}</p>
      </div>

      <div className="app_dashboard_customer_stats__small__screen__con flex flex-col gap-3">
        <div className="app_dashboard_customer_stats__item flex flex-col gap-3">
          <div className="app_dashboard_customer_stats__item__icon green">
            <ProfileAdd />
          </div>

          <p className="app_dashboard_customer_stats__item__label">
            Active and Transacting Accounts
          </p>

          <p className="app_dashboard_customer_stats__item__value">{data?.responseData?.activeAndTransacting ?? 0}</p>
        </div>

        <div className="app_dashboard_customer_stats__small__screen__con__divider"></div>

        <div className="app_dashboard_customer_stats__item flex flex-col gap-3">
          <div className="app_dashboard_customer_stats__item__icon green">
            <ProfileAdd />
          </div>

          <p className="app_dashboard_customer_stats__item__label">
            Active and Non-Transacting Accounts
          </p>

          <p className="app_dashboard_customer_stats__item__value">{data?.responseData?.activeAndNonTransacting ?? 0}</p>
        </div>

        <div className="app_dashboard_customer_stats__small__screen__con__divider"></div>

        <div className="app_dashboard_customer_stats__item flex flex-col gap-3">
          <div className="app_dashboard_customer_stats__item__icon red">
            <ProfileRemove />
          </div>

          <p className="app_dashboard_customer_stats__item__label">
            Inactive and Dormant Accounts
          </p>

          <p className="app_dashboard_customer_stats__item__value">{data?.responseData?.inactiveAndDormant ?? 0}</p>
        </div>
      </div>
    </div>
  )
}
