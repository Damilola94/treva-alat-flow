import React from 'react'
import Image, { type StaticImageData } from 'next/image'

interface IProps {
  item: {
    img: StaticImageData
    title: string
    details?: string
    btnText1?: string
    btnText2?: string
    modalType?: string
    createProject?: {
      icon: string
      title: string
      details: string
    }
    bottomInfo?: string
  }
  handleClick?: () => void
  showSteps?: boolean
}

export function TakeATour (props: IProps) {
  const { item, handleClick } = props
  return (
    <div className="project_management_card flex flex-col gap-4">
      <div className="project_management_card__bg">
        <Image src={item?.img} alt="take a tour" className="w-full" unoptimized />
      </div>
      <div className={'flex flex-col gap-9 justify-between flex-1'}>
        <div className="project_management_card__ctt">
          <div className="flex flex-col gap-2">
            <p className="project_management_card__ctt__title">{item?.title}</p>
            <p className="project_management_card__ctt__text">
              {item?.details}
            </p>
          </div>
        </div>

        <div className="project_management_card__action">
          <div className="w-full space-y-3">
            <button
              className="project_management_card__action__btn1"
              type="button"
              onClick={handleClick}
            >
              {item?.btnText1}
            </button>
            <button
              className="project_management_card__action__btn2"
              type="button"
              onClick={handleClick}
            >
              {item?.btnText2}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
