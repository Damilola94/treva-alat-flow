'use client'
import React, { useState } from 'react'
import { GetStartedCard } from '@/components/shared/dashboard/get-started'
import dashboard from '@/lib/assets/dashboard'
import queries from '@/services/queries/profile'

const cards = [
  {
    id: 1,
    img: dashboard.getStartedCard,
    title: 'Start a Tour',
    details:
      "Welcome to Creathrivity! Let's take a quick tour to help you get started and make the most of our features. Click 'Get started' to begin your journey!",
    btnText: 'Start tour',
    bottomInfo: '',
    bg: 'linear-gradient(137deg, rgba(165, 166, 246, 0) 33.3%, #a5a6f6 100%)'
  },

  {
    id: 2,
    img: dashboard.getStartedCard2,
    title: 'Complete onboarding',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of Creathrivity and start achieving your goals today. Click ‘Get started’ to continue.",
    btnText: 'Continue',
    bottomInfo: '1/5 steps',
    bg: 'linear-gradient(135deg, rgba(199, 255, 107, 0) 0%, #c7ff6b 100%)'
  }
]

export default function Page () {
  const { data } = queries.read()

  const [showSteps, setShowSteps] = useState(false)

  return (
    <div className="app_get_started flex flex-col gap-10 pb-10 mb-10 px-4">
      <div className="app_get_started__bg">
        <div className="app_get_started__bg__ctt">
          <h3 className="app_get_started__bg__ctt__text">
            Welcome, <span>{data?.firstName}</span>
          </h3>
        </div>
      </div>
      <div className="app_get_started__ctt">
        <h3 className="app_get_started__ctt__title">Get started & set up</h3>
      </div>

      <div
        className={`app_get_started__ctt flex gap-6 ${
          showSteps ? 'items-start' : ''
        }`}
      >
        <GetStartedCard item={cards[0]} />
        <GetStartedCard
          item={cards[1]}
          handleClick={() => {
            setShowSteps(true)
          }}
          showSteps={showSteps}
        />
      </div>
    </div>
  )
}
