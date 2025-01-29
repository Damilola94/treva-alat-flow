import React, { type ReactNode } from 'react'
import { Button } from '../ui/button'

interface IProps {
  title?: string
  details?: string
  btnText?: string
  button?: ReactNode
  onClick?: () => void
}

export function SuccessMessage (props: IProps) {
  const { button, btnText, details, onClick, title } = props

  return (
    <div className="app_success_message">
      <div className="flex gap-10 flex-col">
        <div>
          <h3 className="app_success_message__title text-center">{title}</h3>
          <p className="app_success_message__details text-center mt-4">
            {details}
          </p>
        </div>

        <div>
          <div className="">
            {button ?? (
              <Button
                onClick={onClick}
                type="submit"
                className="w-full app_auth_submit_btn"
              >
                {btnText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
