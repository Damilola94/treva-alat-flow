import React from 'react'
import { Button } from '@/components/ui/button'
import { Call, Edit, Message, RenderIf } from '../..'
import { Textarea } from '@/components/ui/textarea'

const birthdayMessage = '"Warmest birthday wishes to you from everyone at Wema Bank On this special day, may your celebrations be as rich as your account balance and may each moment be a reminder of the valuable partnership we share. Here\'s to another year of financial milestones and continued prosperity. Happy Birthday!"'

interface IProps {
  multi?: boolean
}

export function BirthdayModal (props: IProps) {
  const { multi = false } = props
  const nos = multi ? 20 : 1

  return (
    <div className="app_modal__ctt__mid app_birthday_modal flex flex-col gap-4 overflow-x-hidden">
      <div className="flex justify-between items-center">
        <h4 className="app_birthday_modal__title">Birthday Message</h4>

        <div className="flex items-center gap-2">
          <Button
            className="app_birthday_modal__action__icon"
            disabled={!multi}
          >
            <Call />
          </Button>

          <Button className="app_birthday_modal__action__icon">
            <Message width={18} height={18} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="app_birthday_modal__recipient p-3 flex items-center gap-2">
          <p className="app_birthday_modal__recipient__to">to:</p>

          {Array(nos)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="app_birthday_modal__recipient__item p-1"
              >
                <p className="app_birthday_modal__recipient__item__text">
                  Michael Opara
                </p>
              </div>
            ))}
        </div>

        <RenderIf condition={multi}>
          <p className="app_birthday_modal__recipient__number">
            {nos} customers
          </p>
        </RenderIf>
      </div>

      <div className="app_birthday_modal__message">
        <div className="app_birthday_modal__message__icon">
          <Edit />
        </div>
        <Textarea
          className="app_birthday_modal__message__textarea"
          value={birthdayMessage}
        ></Textarea>
      </div>
    </div>
  )
}
