'use client'
import React, { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

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
  onClose: () => void
}

export function CreateProjectCard (props: IProps) {
  const router = useRouter();
  const { item, onClose } = props;
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const projectPaths: Record<string, string> = {
    Personal: '/creatives/dashboard/project-management/personal-project/create',
    Client: '/creatives/dashboard/project-management/client-project/create'
  };

  return (
    <div className="project_management_card flex flex-col gap-4 relative">
       <button
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        onClick={onClose}
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>

      <div className="project_management_card__bg">
        <Image src={item?.img} alt="take a tour" className="w-full" width={100} height={100} />
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
                // className="project_management_card__ctt__option"
                className={`project_management_card__ctt__option ${
                  selectedProject === project.title ? 'selected' : ''
                }`}
                onClick={() => { setSelectedProject(project.title); }}
                // onClick={() => {
                //   if (handleClick) handleClick();
                // }}
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
            // className="project_management_card__action__btn1"
            // type="button"
            // onClick={handleProject}
            // onClick={() => {
            //   if (selectedProject) {
            //     router.push(`/${selectedProject.toLowerCase()}-project`);
            //   }
            // }}
            className={`project_management_card__action__btn1 ${
              selectedProject ? 'bg-[#7B37F0] text-white' : 'bg-gray-400 cursor-not-allowed'
            }`}
            type="button"
            disabled={!selectedProject}
            onClick={() => {
              if (selectedProject && projectPaths[selectedProject]) {
                router.push(projectPaths[selectedProject]);
              }
            }}
              >
            {item?.btnText1}
          </button>
        </div>
      </div>
    </div>
  );
}
