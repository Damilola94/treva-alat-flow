import React from 'react'

export interface BadgeProps {
  className?: string
  title: string
  status: 'success' | 'pending' | 'danger'
}

export function Badge (props: BadgeProps) {
  const { title, className, status } = props

  const cName = [
    'app_badge',
    `app_badge--${status}`,
    className
  ].join(' ')

  return (
    <span className={cName}>
      {title}
    </span>
  )
}
