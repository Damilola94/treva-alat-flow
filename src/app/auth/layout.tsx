'use client'

import { ArrowLeft } from '@/components/shared'
import { useRouter } from 'next/navigation'
import React, { type ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export default function Layout (props: IProps) {
  const { children } = props

  const rt = useRouter()

  return (
    <div className="app_auth_login_layout">
      <div className="app_auth_login_layout__bg">
        <div className="flex w-full justify-end">
          <button type="button">
            <div onClick={() => { rt.back() }} className="app_auth_login_layout__bg__cct__back">
              <ArrowLeft />
            </div>
          </button>
        </div>
        <div className="app_auth_login_layout__bg__cct">
          <div className="app_auth_login_layout__bg__cct__indicator flex gap-4 item-center">
            <div className="app_auth_login_layout__bg__cct__indicator__item active"></div>

            <div className="app_auth_login_layout__bg__cct__indicator__item "></div>

            <div className="app_auth_login_layout__bg__cct__indicator__item "></div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="app_auth_login_layout__bg__cct__title">
              Empower Your Creativity
            </h3>

            <p className="app_auth_login_layout__bg__cct__details">
              Creathrivity streamlines business operations, reducing
              administrative tasks so you can focus on your creative work.
            </p>
          </div>
        </div>
      </div>
      <div className="app_auth_login_layout__cct">{children}</div>
    </div>
  )
}
