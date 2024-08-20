'use client'
import { Header } from '@/components/shared/onboarding'
import { Button } from '@/components/ui/button'
import routes from '@/lib/routes'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Page () {
  const [isLoading, setIsloading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsloading(false)
    }, 2000)
  }, [])

  if (isLoading) {
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

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <div className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">
                Verification succussful
              </h3>

              <div className="flex flex-col gap-8">
                <p className="app_auth_verification__p">
                  Congratulations, your email has been verified successfully
                </p>

                <Link href={routes.auth.signIn.path}>
                  <Button
                    size="xl"
                    backgroundColor="shark-950"
                    className="w-full app_auth_login__btn"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
