'use client'
import React, { Fragment, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Cake, Message, Modal, RenderIf } from '../..'
import { Checkbox } from '@/components/ui/checkbox'
import { BirthdayModal } from '.'
import { Button } from '@/components/ui/button'
import { Message as MessageIcon } from '@/components/shared/svgs'
import queries from '@/services/queries/customer-management/birthdays'
import { Skeleton } from '@/components/ui/skeleton'

export function Sidebar () {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [open, setOpen] = useState(false)
  const [multi, setMulti] = useState(false)

  const { data, isLoading } = queries.read({ birthday: date ?? new Date() })

  const handleClose = () => {
    setOpen(false)
  }

  const total = data?.responseData?.length ?? 0

  return (
    <Fragment>
      <div className="app_customer_sidebar flex flex-col">
        <div>
          <button className="app_gender_chart__btn">
            <Cake />
            Birthday Tracker
          </button>
        </div>

        <div className="flex justify-center app_customer_sidebar__calendar">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiersClassNames={{
              selected: 'app_customer_sidebar__calendar__selected'
            }}
          />
        </div>

        <div className="app_customer_sidebar__customer__list">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center gap-1">
              <Checkbox
                onCheckedChange={(e: boolean) => {
                  setMulti(e)
                }}
              />
              <RenderIf condition={multi}>
                <p className="app_customer_sidebar__customer__list__title">
                  {`${total} Customer${total === 1 ? '' : 's'}`}
                </p>
              </RenderIf>
            </div>

            <RenderIf condition={!multi}>
              <p className="app_customer_sidebar__customer__list__title">
                {`${total} Customer${total === 1 ? '' : 's'}`}
              </p>
            </RenderIf>

            <RenderIf condition={multi}>
              <Button
                className="app_customer_sidebar__customer__list__email"
                onClick={() => {
                  setOpen(true)
                }}
              >
                <div className="flex items-center gap-1">
                  <MessageIcon />
                  <p className="app_customer_sidebar__customer__list__email__text">
                    Email
                  </p>
                </div>
              </Button>
            </RenderIf>
          </div>

          <div className="app_customer_sidebar__customer__list__con">
            {data?.responseData?.map((item, index) => (
              <button
                key={index}
                className="w-full text-left"
                onClick={() => {
                  setOpen(true)
                }}
              >
                <div
                  className={`app_customer_sidebar__customer__list__item w-full ${multi ? 'selected' : ''
                    }`}
                >
                  <div className="app_customer_sidebar__customer__list__item__icon">
                    <h3 className="app_customer_sidebar__customer__list__item__icon__text">
                      {item.firstName.charAt(0)}{item.lastName.charAt(0)}
                    </h3>
                    <RenderIf condition={!multi}>
                      <div className="app_customer_sidebar__customer__list__item__icon__logo">
                        <Message />
                      </div>
                    </RenderIf>
                  </div>

                  <div className="flex-1">
                    <p className="app_customer_sidebar__customer__list__item__name">
                      {item.firstName} {item.lastName}
                    </p>

                    <p className="app_customer_sidebar__customer__list__item__number">
                      {item.phoneNumber}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {!data?.responseData?.length && isLoading && (
              Array(5).fill(0).map((_, index) => (
                <Skeleton height={50} key={index} />
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        {...{ open, handleClose, className: 'sm:max-w-[465px] p-6 sm:p-8' }}
      >
        <BirthdayModal multi={multi} />
      </Modal>
    </Fragment>
  )
}
