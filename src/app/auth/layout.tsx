'use client'

import React, { useState, type ReactNode } from 'react'
import { ArrowLeft } from '@/components/shared'
import { useRouter } from 'next/navigation'
import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import auth from '@/lib/assets/auth'

const titleArray = [
  'Empower Your Creativity',
  'Enhance Client Relations',
  'Join a Thriving Community'
]

const detailsArray = [
  'Creathrivity streamlines business operations, reducing administrative tasks so you can focus on your creative work.',
  'Simplify transactions and communication with Creathrivity, improving client interactions and your professional image.',
  'Creathrivity offers industry-specific tools and a supportive community, tailored to the needs of creative professionals.'
]

interface IProps {
  children: ReactNode
}

export default function Layout (props: IProps) {
  const { children } = props
  const [bgIndex, setBgIndex] = useState(0)

  const rt = useRouter()

  return (
    <div className="app_auth_login_layout">
      <div className="app_auth_login_layout__bg">
        <Carousel
          className="app_auth_login_layout__carousel"
          autoPlay
          infiniteLoop
          interval={5000}
          showIndicators={false}
          showArrows={false}
          showStatus={false}
          onChange={(index) => {
            setBgIndex(index)
          }}
        >
          {[auth.authBg1, auth.authBg2, auth.authBg3].map((src, index) => (
            <div key={index}>
              <Image
                src={src}
                alt="carousel background"
                objectFit="object-fill"
              />
            </div>
          ))}
        </Carousel>
        <div className="flex w-full justify-end app_auth_login_layout__bg__relative">
          <button type="button">
            <div
              onClick={() => {
                rt.back()
              }}
              className="app_auth_login_layout__bg__cct__back"
            >
              <ArrowLeft />
            </div>
          </button>
        </div>
        <div className="app_auth_login_layout__bg__cct app_auth_login_layout__bg__relative">
          <div className="app_auth_login_layout__bg__cct__indicator flex gap-4 item-center">
            {[0, 1, 2].map((index) => {
              const active = index === bgIndex ? 'active' : ''

              return (
                <div
                  key={index}
                  className={`app_auth_login_layout__bg__cct__indicator__item ${active}`}
                ></div>
              )
            })}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="app_auth_login_layout__bg__cct__title">
              {titleArray[bgIndex]}
            </h3>

            <p className="app_auth_login_layout__bg__cct__details">
              {detailsArray[bgIndex]}
            </p>
          </div>
        </div>
      </div>
      <div className="app_auth_login_layout__cct">{children}</div>
    </div>
  )
}
