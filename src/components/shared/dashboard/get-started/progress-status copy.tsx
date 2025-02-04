import React from 'react'
import { CheckCircle, CheckboxBlankCircle } from '../../svgs'
import { RenderIf } from '../../render-if'

interface IProps {
  label: string
  checked?: boolean
  active?: boolean
}

export function ProgressStatus (props: IProps) {
  const { label, active = false, checked = false } = props

  return (
    <div className="app_get_started_progress_status flex gap-1 items-center">
      <div className="app_get_started_progress_status__icon">
        <RenderIf condition={checked}>
          <CheckCircle />
        </RenderIf>
        <RenderIf condition={!checked}>
          <CheckboxBlankCircle fill={active ? '#262626' : undefined} />
        </RenderIf>
      </div>

      <p
        className={`app_get_started_progress_status__label ${
          active || checked ? 'active' : ''
        }`}
      >
        {label}
      </p>
    </div>
  )
}
