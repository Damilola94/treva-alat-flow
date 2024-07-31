'use client'
import React, { useEffect } from 'react'
import logos from '@/lib/assets/logos'
import Image from 'next/image'
import routes from '@/lib/routes'

export default function Page () {
  useEffect(() => {
    setTimeout(() => {
      // localStorage.clear()

      // window.location.href = routes.home.path + (query?.next ? `?next=${query.next}` : '')
      const nextRoute = process.env.NEXT_PUBLIC_ASSET_PREFIX_DISABLED ? routes.auth.login.path : ('/streak-web' + routes.auth.login.path)
      window.location.href = nextRoute
    }, 1500)
  }, [])

  return (
    <div className="app_auth_login">
      <div>
        <div className="flex flex-col gap-12">
          <div className="app_auth_login__logo">
            <Image src={logos.logo} alt="logo" className="w-full" />
          </div>

          <div className="flex justify-center items-center" style={{ minHeight: 200 }}>
            <span className="txxx_loader" />
          </div>
        </div>
      </div>
    </div>
  )
}
