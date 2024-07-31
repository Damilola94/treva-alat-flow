import React from 'react'
import { Calculator, CardTick, Mobile, Profile2User, TicketStar } from '../..'
import queries from '@/services/queries/account-management/digital-adoption-summary'
import { Skeleton } from '@/components/ui/skeleton'

export function DigitalAdoption () {
  const { data, isLoading } = queries.read()

  if (!data?.responseData && isLoading) {
    return (
    <div className="app_gender_chart app_digital_adoption flex flex-col gap-6">
      <Skeleton height={240} />
    </div>
    )
  }

  return (
    <div className="app_gender_chart flex flex-col gap-6 app_digital_adoption">
      <div className="flex justify-between items-center">
        <div>
          <button className="app_gender_chart__btn">
            <Profile2User stroke="#222" />
            Accounts
          </button>
        </div>
      </div>

      <div className="app_digital_adoption__ctt">
        <div className="app_digital_adoption__ctt__item">
          <div className="app_digital_adoption__ctt__item__icon">
            <TicketStar />
          </div>

          <p className="app_digital_adoption__ctt__item__label">
            Total Digital Users
          </p>

          <p className="app_digital_adoption__ctt__item__value">{data?.responseData?.digitalUserS}</p>
        </div>

        <div className="app_digital_adoption__ctt__item">
          <div className="app_digital_adoption__ctt__item__icon">
            <CardTick />
          </div>

          <p className="app_digital_adoption__ctt__item__label">Carded</p>

          <p className="app_digital_adoption__ctt__item__value">{data?.responseData?.hasCard}</p>
        </div>

        <div className="app_digital_adoption__ctt__item">
          <div className="app_digital_adoption__ctt__item__icon">
            <Calculator />
          </div>

          <p className="app_digital_adoption__ctt__item__label">USSD</p>

          <p className="app_digital_adoption__ctt__item__value">{data?.responseData?.onUssd}</p>
        </div>

        <div className="app_digital_adoption__ctt__item">
          <div className="app_digital_adoption__ctt__item__icon">
            <Mobile />
          </div>

          <p className="app_digital_adoption__ctt__item__label">
            ALAT for Business
          </p>
          <p className="app_digital_adoption__ctt__item__value">{data?.responseData?.onAfb}</p>
        </div>

        <div className="app_digital_adoption__ctt__item">
          <div className="app_digital_adoption__ctt__item__icon">
            <Calculator />
          </div>

          <p className="app_digital_adoption__ctt__item__label">ALAT</p>

          <p className="app_digital_adoption__ctt__item__value">{data?.responseData?.onAlat}</p>
        </div>
      </div>
    </div>
  )
}
