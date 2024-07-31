'use client'
import React, { useState } from 'react'
import { ArrowDown, Bubble } from '../..'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { format } from 'date-fns'

type IOption = 'Call' | '30 Days' | '60 Days' | '90 Days' | '180 Days'

const options: IOption[] = [
  'Call',
  '30 Days',
  '60 Days',
  '90 Days',
  '180 Days'
]

const LCY = [
  { amount: 'Less than N1m', rate: '5.00%' },
  { amount: 'N1m to N10m', rate: '10.50%' },
  { amount: 'Above N10m to N100m', rate: '11.00%' },
  { amount: 'Above N100m to N500m', rate: '11.00%' },
  { amount: 'Less than N500m to N1bn', rate: '12.50%' },
  { amount: 'Above N1bn - N5bn', rate: '13.00%' },
  { amount: 'N5bn & above', rate: 'Contact Treasury Group' }
]

const FCY = [
  { amount: '50,000 to 100,000', rate: '1%' },
  { amount: '100,000 to 250,000', rate: '1%' },
  { amount: '250,000 to 500,000', rate: '2%' },
  { amount: '500,000 to 1,000,000', rate: '3%' },
  { amount: 'Above 1,000,000', rate: 'Contact Treasury Group' }
]

function RateGuide (props = LCY[0]) {
  return (
    <div className="app_dashboard_treasury_rate__data__flex">
      <p className="app_dashboard_treasury_rate__data__cell">
        {props.amount}
      </p>

      <p className="app_dashboard_treasury_rate__data__cell">{props.rate}</p>
    </div>
  )
}

function RateGuideHeader () {
  const [activeOption, setActiveOption] = useState<IOption>('Call')

  return (
    <div className="app_dashboard_treasury_rate__data__flex">
      <p className="app_dashboard_treasury_rate__data__cell title">
        Amount (N)
      </p>

      <div className="w-full">
        <Popover>
          <PopoverTrigger
            // onClick={() => {
            //   setIsOpen(true);
            // }}
            className='w-full'
          >
            <p className="flex items-center justify-between app_dashboard_treasury_rate__data__cell title button">
              {activeOption}
              <ArrowDown />
            </p>
          </PopoverTrigger>
          <PopoverContent
            className="app_gender__popover hidden"
            side="bottom"
            align="end"
            sideOffset={10}
          >
            <div className="flex flex-col gap-0">
              {options.map((item) => (
                <button
                  key={item}
                  className={`app_gender__popover__btn ${item === activeOption ? 'active' : ''
                    }`}
                  onClick={() => {
                    setActiveOption(item)

                    setTimeout(() => {
                      document.body.focus()
                    }, 500)
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export function TreasuryRate () {
  const [activeTab, selectActiveTab] = useState<'lcy' | 'fcy'>('lcy')

  return (
    <div className="app_dashboard_treasury_rate flex flex-col gap-5">
      <div className="app_dashboard_upcoming_task__header">
        <p className="app_dashboard_upcoming_task__header__text app_gender_chart__btn">
          <Bubble />
          Treasury Rate Guide
        </p>

        <p className="app_dashboard_upcoming_task__header__text app_gender_chart__btn">
          {format(new Date(), 'dd-MM-yyyy')}
        </p>
      </div>

      {/* desktop view */}
      <div className="hidden lg:grid grid-cols-2 gap-3">
        <div>
          <div className="app_dashboard_treasury_rate__tab">
            <button
              className={'app_dashboard_treasury_rate__tab__btn active'}
              type="button"
            >
              LCY
            </button>
          </div>

          <div className="app_dashboard_treasury_rate__data">
            <RateGuideHeader />

            {LCY.map((item) => (
              <RateGuide {...item} key={item.amount} />
            ))}
          </div>
        </div>

        <div>
          <div className="app_dashboard_treasury_rate__tab">
            <button
              className={'app_dashboard_treasury_rate__tab__btn active'}
              type="button"
            >
              FCY
            </button>
          </div>

          <div className="app_dashboard_treasury_rate__data">
            <RateGuideHeader />

            {FCY.map((item) => (
              <RateGuide {...item} key={item.amount} />
            ))}
          </div>
        </div>
      </div>

      {/* mobile and tab view */}
      <div className="w-full lg:hidden">
        <div className="app_dashboard_treasury_rate__tab">
          <button
            className={`app_dashboard_treasury_rate__tab__btn ${activeTab === 'lcy' ? 'active' : ''
              }`}
            type="button"
            onClick={() => {
              selectActiveTab('lcy')
            }}
          >
            LCY
          </button>

          <button
            className={`app_dashboard_treasury_rate__tab__btn ${activeTab === 'fcy' ? 'active' : ''
              }`}
            type="button"
            onClick={() => {
              selectActiveTab('fcy')
            }}
          >
            FCY
          </button>
        </div>

        <div className="app_dashboard_treasury_rate__data">
          <RateGuideHeader />

          {(activeTab === 'lcy' ? LCY : FCY).map((item) => (
            <RateGuide {...item} key={item.amount} />
          ))}
        </div>
      </div>
    </div>
  )
}
