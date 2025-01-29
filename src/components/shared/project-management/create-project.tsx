import React from 'react';
import Image, { type StaticImageData } from 'next/image';

interface IProps {
  item: {
    img: StaticImageData
    title: string
    details?: string
    btnText1?: string
    btnText2?: string
    modalType?: string
    createProject: Array<{
      icon: React.JSX.Element
      title: string
      details: string
    }>
    bottomInfo?: string
  }
  handleClick?: () => void
  handleProject?: () => void
  showSteps?: boolean
}

export function CreateProjectCard (props: IProps) {
  const { item, handleClick, handleProject } = props;

  return (
    <div className="project_management_card flex flex-col gap-4">
      <div className="project_management_card__bg">
        <Image src={item?.img} alt="take a tour" className="w-full" />
      </div>
      <div className={'flex flex-col gap-9 justify-between flex-1'}>
        <div className="project_management_card__ctt">
          <div className="flex flex-col gap-2">
            <p className="project_management_card__ctt__title">{item?.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {item?.createProject.map((project, index) => (
              <div
                key={index}
                className="project_management_card__ctt__option"
                onClick={() => {
                  if (handleClick) handleClick();
                }}
              >
                <div className="">{project.icon}</div>
                <div className="">
                  <h3 className="project_management_card__ctt__option__title">
                    {project.title}
                  </h3>
                  <p className="project_management_card__ctt__option__details">
                    {project.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="project_management_card__action mb-10">
          <button
            className="project_management_card__action__btn1"
            type="button"
            onClick={handleProject}
          >
            {item?.btnText1}
          </button>
        </div>
      </div>
    </div>
  );
}
