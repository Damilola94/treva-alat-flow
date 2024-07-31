import React, { type ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export default function Layout (props: IProps) {
  const { children } = props

  return (
    <div className="app_auth_login_layout">
      <div className="app_auth_login_layout__bg">
        <h2 className="app_auth_login_layout__bg__text">
          Integrated <br /> Relationship <span>Management</span> Platform
        </h2>
      </div>
      <div className="app_auth_login_layout__cct">{children}</div>
    </div>
  )
}
