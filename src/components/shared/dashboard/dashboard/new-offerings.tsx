import React from 'react'
import { FavoriteChart } from '../..'
import Image from 'next/image'
import dashboard from '@/lib/assets/dashboard'

export function NewOfferings () {
  return (
    <div className="app_dashboard_new_offerings">
      <div className="flex">
        <p className="app_dashboard_upcoming_task__header__text app_gender_chart__btn">
          <FavoriteChart />
          New Offerings
        </p>
      </div>

      <div className="app_dashboard_new_offerings__ctt">
        <div className="app_dashboard_new_offerings__ctt__item">
          <div className="app_dashboard_new_offerings__ctt__item__img">
            <Image
              src={dashboard.newOffering1}
              alt="offering"
              className="w-full"
            />
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <p className="app_dashboard_new_offerings__ctt__item__title">
              Wema Car Loan
            </p>

            <p className="app_dashboard_new_offerings__ctt__item__details">
              Apply for your Car Loan, easy and simple. We have your dream car
              covered!
            </p>
          </div>
        </div>

        <div className="app_dashboard_new_offerings__ctt__divider"></div>

        <div className="app_dashboard_new_offerings__ctt__item">
          <div className="app_dashboard_new_offerings__ctt__item__img">
            <Image
              src={dashboard.newOffering2}
              alt="offering"
              className="w-full"
            />
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <p className="app_dashboard_new_offerings__ctt__item__title">
              E-Banking
            </p>

            <p className="app_dashboard_new_offerings__ctt__item__details">
              Do you want to experience banking from the comfort of your home,
              at work, or abroad?
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
