import React from 'react'
import Image, { type StaticImageData } from 'next/image'
import { ChevronRight, Logo } from '../../svgs'
import { RenderIf } from '../../render-if'
import Link from 'next/link'
import routes from '@/lib/routes'

const steps = [
  {
    id: 1,
    label: 'Professional details',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of",
    href: routes.dashboard.getStarted.professionalDetails.path
  },

  {
    id: 2,
    label: 'Social media details',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of ",
    href: routes.dashboard.getStarted.socialMediaDetails.path
  },

  {
    id: 3,
    label: 'Bio',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of",
    href: routes.dashboard.getStarted.bio.path
  },

  {
    id: 4,
    label: 'Select plan',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of",
    href: routes.dashboard.getStarted.selectPlan.path
  }
]

interface IProps {
  item: {
    img: StaticImageData
    title: string
    details: string
    btnText: string
    bottomInfo: string
    bg: string
  }
  handleClick?: () => void
  showSteps?: boolean
}

export function GetStartedCard (props: IProps) {
  const { item, handleClick, showSteps = false } = props

  return (
    <div className="app_get_started_card flex flex-col gap-4">
      <div
        className="app_get_started_card__bg"
        style={{ background: item?.bg }}
      >
        <Image src={item?.img} alt="get started" className="w-full" />
      </div>
      <div className={'flex flex-col gap-9 justify-between flex-1'}>
        <div className="app_get_started_card__ctt">
          <div className="flex flex-col gap-2">
            <p className="app_get_started_card__ctt__title">{item?.title}</p>
            <p className="app_get_started_card__ctt__text">{item?.details}</p>
          </div>
        </div>

        <div className="flex flex-col">
          <RenderIf condition={showSteps}>
            <div className="app_get_started_card__steps flex flex-col">
              {steps.map((item) => (
                <Link key={item.id} href={item.href}>
                  <div className="app_get_started_card__steps__item flex gap-4">
                    <div className="app_get_started_card__steps__item__logo">
                      <Logo width={24} height={24} />
                    </div>

                    <div className="app_get_started_card__steps__item__ctt flex-1 flex flex-col gap-2">
                      <div className="flex justify-between">
                        <h3 className="app_get_started_card__steps__item__ctt__title">
                          {item.label}
                        </h3>
                        <ChevronRight />
                      </div>
                      <p className="app_get_started_card__steps__item__ctt__text">
                        {item.details}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </RenderIf>

          <div className="app_get_started_card__action">
            <div className="flex items-center justify-between">
              <RenderIf condition={showSteps}>
                <Link
                  href={routes.dashboard.getStarted.professionalDetails.path}
                >
                  <button
                    className="app_get_started_card__action__btn"
                    type="button"
                  >
                    {item?.btnText}
                  </button>
                </Link>
              </RenderIf>

              <RenderIf condition={!showSteps}>
                <button
                  className="app_get_started_card__action__btn"
                  type="button"
                  onClick={handleClick}
                >
                  {item?.btnText}
                </button>
              </RenderIf>

              <p className="app_get_started_card__action__text">
                {item?.bottomInfo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
