'use client';
import React, { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';
import { CreateProjectLogo } from '../svgs';
import Topimage from '../../../../public/media/images/projectmanagement/top-image-create-project.png';

interface IProps {
  item: {
    img: StaticImageData;
    title: string;
    details?: string;
    btnText1?: string;
    btnText2?: string;
    modalType?: string;
    createProject: Array<{
      icon: React.JSX.Element;
      title: string;
      details: string;
    }>;
    bottomInfo?: string;
  };
  handleClick?: () => void;
  handleProject?: () => void;
  showSteps?: boolean;
  onClose: () => void;
}

export function CreateProjectCard(props: IProps) {
  const rt = useRouter();
  const { item, onClose } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const projectPaths: Record<string, string> = {
    Personal: '/creatives/dashboard/project-management/personal-project/create',
    Client: '/creatives/dashboard/project-management/client-project/create',
  };

  return (
    <div className="project_management_card flex flex-col relative sm:min-w-[450px] bg-white overflow-hidden rounded-[24px]  shadow-xl">
      
      {/* 2. Header Section with Image */}
      <div className="relative w- h-40">
        <Image 
          src={Topimage} 
          alt="Header Background" 
          fill
          className=""
          priority
        />
    
        <button
          className="absolute top-4 right-4 p-1.5 hover:bg-black/20 transition-colors z-10"
          onClick={onClose}
        >
          <X className="w-7 h-7 text-[#262626] font-bold" />
        </button>
      </div>

      <div className="flex justify-center items-center -mt-20 relative z-20">
        <div className=" p-2 rounded-full shadow-sm">
           <CreateProjectLogo />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-8 pb-8 mt-4">
        <div className="project_management_card__ctt text-center">
          <h2 className="text-2xl font-bold text-[#101828] mb-8">{item?.title}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {item?.createProject.map((project, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedProject === project.title
                    ? 'border-[#7B37F0] bg-[#F9F5FF]'
                    : 'border-gray-100 bg-[#F9FAFB] hover:border-gray-200'
                }`}
                onClick={() => setSelectedProject(project.title)}
              >
                <div className="">{project.icon}</div>
                <div className="">
                  <h3 className="project_management_card__ctt__option__title">
                    {project.title} Project
                  </h3>
                  {/* <p className="project_management_card__ctt__option__details">
                    {project.details}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button
            className={`project_management_card__action__btn1 flex items-center justify-center gap-2 !py-4 ${
              selectedProject
                ? 'bg-[#7B37F0] text-white'
                : '!bg-[#F6F6F6] cursor-not-allowed !text-[#888888] !font-bold'
            }`}
            type="button"
            disabled={!selectedProject || isLoading}
            onClick={async () => {
              if (selectedProject && projectPaths[selectedProject]) {
                setIsLoading(true);
                rt.push(`${projectPaths[selectedProject]}?type=${selectedProject}`);
              }
            }}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : item?.btnText1 || 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}