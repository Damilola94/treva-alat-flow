'use client'
import { Button } from '@/components/ui/button'

export function SubscribeToPlan () {
  return (
    <header className="app_dash_main__stp -z-50">
      <p className="app_dash_main__stp__title">
        Your free trial will expire in 7 days
      </p>
      <Button size="md" backgroundColor="shark-950" className="">
        Subscribe to a plan
      </Button>
    </header>
  )
}
