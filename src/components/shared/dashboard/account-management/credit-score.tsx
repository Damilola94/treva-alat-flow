import dynamic from 'next/dynamic'
import React from 'react'
import { Calculator, CardTick, Mobile } from '../../svgs'
import queries from '@/services/queries/account-management'

const NeedleChart = dynamic(async () => await import('./needle-chart'), {
  ssr: false
})

export function CreditScore () {
  const { data } = queries.readOne()

  const digitalAdoptions = [
    ...(data?.responseData?.hasCard ? [{ icon: <CardTick />, name: 'Carded' }] : []),
    ...(data?.responseData?.onUssd ? [{ icon: <Calculator />, name: 'USSD' }] : []),
    ...(data?.responseData?.onAfb ? [{ icon: <Mobile />, name: 'ALAT for Business' }] : []),
    ...(data?.responseData?.onAlat ? [{ icon: <Calculator />, name: 'ALAT' }] : [])
  ]

  return (
    <div className="app_credit_score flex flex-col md:flex-row gap-5 w-full">
      <div className="app_credit_score__chart">
        <NeedleChart />
      </div>

      <div className="app_credit_score__digital__adoption w-full flex-1 flex flex-col gap-5 justify-between">
        <div className="flex justify-between gap-5">
          <p className="app_personal_information__header__btn flex items-center gap-2">
            Digital Adoption
          </p>
        </div>

        <div className="app_credit_score__digital__adoption__con">
          {digitalAdoptions.map((item) => (
            <div key={item.name} className="app_personal_information__header__btn flex items-center gap-2 app_credit_score__digital__adoption__item">
              <div className="app_credit_score__digital__adoption__item__icon">
                {/* <CardTick width={18} height={18} /> */}
                {item.icon}
              </div>
              <p className="" style={{ whiteSpace: 'nowrap' }}>{item.name}</p>
            </div>
          ))}

          {!digitalAdoptions.length && <p className="" style={{ whiteSpace: 'nowrap' }}>No digital adoption</p>}
        </div>
      </div>
    </div>
  )
}
