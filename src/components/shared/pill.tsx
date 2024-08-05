import React, { type ReactNode } from 'react'

interface IProps {
  active?: boolean
  children?: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
}

export function Pill (props: IProps) {
  const { active, children, className, onClick, selected } = props

  return (
    <div onClick={onClick} className={['app_pill', (active ?? selected) && 'app_pill--active', className].join(' ')}>
      {children}
    </div>
  )
}
