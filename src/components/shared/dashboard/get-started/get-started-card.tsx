import React from 'react'
import Image, { type StaticImageData } from 'next/image'

interface IProps {
  item: {
    img: StaticImageData
    title: string
    details: string
    btnText: string
    bottomInfo: string
    bg: string
  }
}

export function GetStartedCard (props: IProps) {
  const { item } = props

  return (
    <div className="app_get_started_card flex flex-col gap-4">
      <div
        className="app_get_started_card__bg"
        style={{ background: item?.bg }}
      >
        <Image src={item?.img} alt="get started" className="w-full" />
      </div>
      <div className="flex flex-col gap-9 justify-between flex-1">
        <div className="app_get_started_card__ctt">
          <div className="flex flex-col gap-2">
            <p className="app_get_started_card__ctt__title">{item?.title}</p>
            <p className="app_get_started_card__ctt__text">{item?.details}</p>
          </div>
        </div>

        <div className="app_get_started_card__action">
          <div className="flex items-center justify-between">
            <button className="app_get_started_card__action__btn" type="button">
              {item?.btnText}
            </button>

            <p className="app_get_started_card__action__text">
              {item?.bottomInfo}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
