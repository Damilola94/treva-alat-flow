import * as React from 'react'

import { cn } from '@/lib/utils'
import { RenderIf } from '../shared'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  success?: string
  size?: 'lg' | 'xl'
  errors?: any
  touched?: any
  wordCount?: {
    limit: number
    current: number
  }
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (args, ref) => {
    const {
      size,
      label,
      success,
      errors = {},
      touched = {},
      name = '',
      className: cnString,
      wordCount,
      ...props
    } = args

    const hasError = (errors[name] && touched[name]) || false

    const className = [
      'app_input',
      'app_textarea',
      'app_input_field',
      cnString
    ].join(' ')

    return (
      <div className="app_input_con">
        {label && (
          <label className="app_input_con__lbl" htmlFor={props.id ?? name}>
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          maxLength={wordCount?.limit}
          {...props}
        />

        {success && (
          <span className="app_input_con__spt--success">{success}</span>
        )}

        <div className="flex justify-between">
          <div>
            <RenderIf condition={hasError}>
              <p className="app_input_con__spt--error">{errors[name]}</p>
            </RenderIf>
          </div>

          <RenderIf condition={!!wordCount}>
            <div className="flex justify-end">
              <p className="app_input_con__word__count">
                {wordCount?.current}/{wordCount?.limit} words
              </p>
            </div>
          </RenderIf>
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
