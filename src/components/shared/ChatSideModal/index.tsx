import React from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { NAvatar } from '@/app/assets/pngs';

interface ModalProps {
  isOpen: boolean;
  showFooter?: boolean;
  onClose: () => void;
  title?: string;
  projName?: string;
  actionText?: string;
  onAction?: () => void;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
  usebg?: boolean;
}

const ChatSideModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  showFooter,
  title,
  projName,
  children,
  footerChildren,
  usebg,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed font-spaceGrotesk inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
      {/* Overlay that closes the modal when clicked */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal container positioned on the right */}
      <div className="absolute right-0 top-0 h-full bg-[#fff] rounded-l-lg w-full max-w-lg overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div
          style={{
            backgroundImage: usebg
              ? 'url(/media/images/projectmanagement/top-image-create-project.png)'
              : '',
            backgroundSize: '110%',
            backgroundPosition: 'center',
            backgroundColor: '#fff',
            width: '100%',
          }}
          className="w-full p-4 border-b border-[#E7E7E7] "
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <div className='w-[43px] h-[43px]'>
                <Image
                  src={NAvatar}
                  alt="avatar"
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                {title && <h2 className="text-[16px] font-bold">{title}</h2>}
                {projName && <h2 className="text-[11px]">{projName}</h2>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#262626] hover:text-gray-700 p-2"
              aria-label="Close modal"
            >
              <X size={25} />
            </button>
          </div>
        </div>

        {/* Modal Content - Accepts children */}
        <div className="p-4 flex-1 overflow-y-auto">{children}</div>

        {/* Modal Footer */}
        {showFooter && (
          <div className="border-t border-[#E7E7E7] p-4 min-h-16 flex justify-end">
            {footerChildren}
          </div>
        )}
      </div>
    </div>
  );
};

export { ChatSideModal };
