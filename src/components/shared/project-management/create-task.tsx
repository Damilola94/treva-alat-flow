import React from 'react';
import Image, { type StaticImageData } from 'next/image';
import { Calendar, FlagOutline, CalendarWithMark } from '@/components/shared';

interface IProps {
  item: {
    img: StaticImageData
    title?: string
    btnText1?: string
  }
  handleClick?: () => void
  showSteps?: boolean
}

export function CreateTaskCard (props: IProps) {
  const { item, handleClick } = props;

  return (
    <div className="project_management_card flex flex-col gap-4">
      <div className="project_management_card__bg">
        <Image src={item?.img} alt="take a tour" className="w-full" />
      </div>
      <div className={'flex flex-col gap-9 justify-between flex-1'}>
        <div className="project_management_card__ctt">
          <div className="flex flex-col gap-2">
            <p className="project_management_card__ctt__title text-left -mt-20">{item?.title}</p>
          </div>
          <div className="project_action_group flex-col w-full space-y-3">
            <div className="flex justify-between w-full">
              <div className="flex justify-center items-center gap-3">
                <Calendar />
                Start:
              </div>
              <div className="project_action_group__button">Date</div>
            </div>

            <div className="flex justify-between w-full">
               <div className="flex justify-center items-center gap-3">
                <CalendarWithMark />
                End:
              </div>
              <div className="project_action_group__button">Date</div>
            </div>
            <div className="flex justify-between w-full">
               <div className="flex justify-center items-center gap-3">
                <FlagOutline />
                Priority:
              </div>
              <div className="project_action_group__button">
                <span className="project_action_group__app_priority_tag__dot" />
                High
              </div>
            </div>
          </div>
        </div>
        <div className="project_management_card__action mb-10">
          <button
            className="project_management_card__action__btn2"
            type="button"
            onClick={handleClick}
          >
            {item?.btnText1}
          </button>
        </div>
      </div>
    </div>
  );
}
