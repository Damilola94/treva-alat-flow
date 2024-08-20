'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { RenderIf } from '../shared'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  isInputField?: boolean
  label?: string
  icon?: React.ReactNode
  helperText?: string
  success?: string
  size?: 'lg' | 'xl'
  errors?: any
  touched?: any
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((args, ref) => {
  const {
    className: cnString,
    isInputField = true,
    type,
    size,
    label,
    icon,
    helperText,
    success,
    errors = {},
    touched = {},
    name = '',
    ...props
  } = args

  const [showPassword, setShowPassword] = React.useState(false)

  const hasError = (errors[name] && touched[name]) || false

  const className = [
    'app_input',
    `app_input--${size}`,
    isInputField ? 'app_input_field' : '',
    cnString
  ].join(' ')

  return (
    <div className="app_input_con">
      {label && (
        <label className="app_input_con__lbl" htmlFor={props.id ?? name}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={showPassword ? 'text' : type}
          className={cn(
            'h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          name={name}
          {...props}
        />

        <RenderIf condition={type === 'password'}>
          <button
            className="app_input_eye"
            onClick={() => {
              setShowPassword((prev) => !prev)
            }}
            type="button"
          >
            <RenderIf condition={showPassword}>
              <EyeIcon size={18} />
            </RenderIf>

            <RenderIf condition={!showPassword}>
              <EyeOffIcon size={18} />
            </RenderIf>
          </button>
        </RenderIf>

        <RenderIf condition={!!icon}>
          <button
            className="app_input_eye"
            type="button"
          >
            {icon}
          </button>
        </RenderIf>
      </div>

      {success && (
        <span className="app_input_con__spt--success">{success}</span>
      )}

      <RenderIf condition={!!helperText}>
        <span className="app_input_con__spt--helper-text">{helperText}</span>
      </RenderIf>

      <RenderIf condition={hasError}>
        <div>
          <p className="app_input_con__spt--error">{errors[name]}</p>
        </div>
      </RenderIf>
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
