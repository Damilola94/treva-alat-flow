import React from 'react'

export interface BadgeProps {
  className?: string
  title: string
  style: 'success' | 'pending' | 'danger'
}

export function Badge (props: BadgeProps) {
  const { title, className, style } = props

  const cName = [
    'app_badge',
    `app_badge--${style}`,
    className
  ].join(' ')

  return (
    <span className={cName}>
      {title}
    </span>
  )
}
