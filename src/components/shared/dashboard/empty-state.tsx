import { type ReactNode } from 'react'

interface IProps {
  icon?: ReactNode
  title?: string
  description?: string
  button?: ReactNode
  className?: string
}

export function EmptyState (props: IProps) {
  const { className } = props
  return (
    <div className={`app_empty_state ${className ?? ''}`}>
      {props.icon}

      <h6>{props.title}</h6>

      <p>{props.description}</p>
      {props.button}
    </div>
  )
}
