'use client'
import React, { useEffect } from 'react'
import routes from '@/lib/routes'
import config from '@/lib/config'

export default function Page () {
  useEffect(() => {
    setTimeout(() => {
      // localStorage.clear()

      // window.location.href = routes.home.path + (query?.next ? `?next=${query.next}` : '')
      const signIn = routes.auth.signIn.path
      const nextRoute = process.env.NEXT_PUBLIC_ASSET_PREFIX_DISABLED ? signIn : (`/${config.namespace}` + signIn)
      window.location.href = nextRoute
    }, 1500)
  }, [])

  return (
    <div className="app_auth_login">
      <div>
        <div className="flex flex-col gap-12">
          <div className="flex justify-center items-center" style={{ minHeight: 200 }}>
            <span className="txxx_loader" />
          </div>
        </div>
      </div>
    </div>
  )
}
