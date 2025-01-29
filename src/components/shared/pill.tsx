import React, { type ReactNode } from 'react'

interface IProps {
  active?: boolean
  children?: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  size?: 'md'
}

export function Pill (props: IProps) {
  const { active, children, className, onClick, selected, size } = props

  const cName = [
    'app_pill',
    (active ?? selected) && 'app_pill--active',
    `app_pill--${size}`,
    className
  ].join(' ')

  return (
    <div onClick={onClick} className={cName}>
      {children}
    </div>
  )
}
