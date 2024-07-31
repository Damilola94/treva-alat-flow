import React from 'react'
import { NotificationBing } from '../..'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function UpcomingTask () {
  return (
    <div className="app_dashboard_upcoming_task">
      <div className="app_dashboard_upcoming_task__header">
        <p className="app_dashboard_upcoming_task__header__text app_gender_chart__btn">
          <NotificationBing />
          Upcoming Tasks
        </p>

        <p className="app_dashboard_upcoming_task__header__text app_gender_chart__btn">
          25th Mar 2024
        </p>
      </div>

      <div className="app_dashboard_upcoming_task__item">
        <div className="app_dashboard_upcoming_task__item__title">
          <div className="app_dashboard_upcoming_task__item__title__text">
            Loan Repayment
          </div>

          <button className="app_dashboard_upcoming_task__item__title__icon">
            <ArrowRight size={14} />
          </button>
        </div>

        <p className="app_dashboard_upcoming_task__item__details truncate">
          Kindly remind <span>Mr Adewale Joel</span> to service his loan
        </p>

        <div className="flex">
          <div className="app_dashboard_upcoming_task__item__date">
            <p className="app_dashboard_upcoming_task__item__date__text">
              Loan Repayment Date <span>25 APR 2024</span>
            </p>
          </div>
        </div>
      </div>

      <div className="app_dashboard_upcoming_task__item">
        <div className="app_dashboard_upcoming_task__item__title">
          <div className="app_dashboard_upcoming_task__item__title__text">
            Call Plan
          </div>

          <button className="app_dashboard_upcoming_task__item__title__icon">
            <ArrowRight size={14} />
          </button>
        </div>

        <p className="app_dashboard_upcoming_task__item__details truncate">
          You are to visit <span>Lorem Ipsum</span>
        </p>

        <div className="flex">
          <div className="app_dashboard_upcoming_task__item__date">
            <p className="app_dashboard_upcoming_task__item__date__text">
              Date <span>25 APR 2024</span>
            </p>
          </div>
        </div>
      </div>

      <div className="app_dashboard_upcoming_task__action">
        <Link href="#" className="app_dashboard_upcoming_task__action__view">
          View All
        </Link>

        <p className="app_dashboard_upcoming_task__action__count">20 Tasks</p>
      </div>
    </div>
  )
}
