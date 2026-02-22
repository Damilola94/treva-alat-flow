import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean
  showFooter?: boolean
  onClose: () => void
  title?: string
  actionText?: string
  onAction?: () => void
  children: React.ReactNode
  footerChildren?: React.ReactNode
  usebg?: boolean
}

const SideModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  showFooter,
  title,
  children,
  footerChildren,
  usebg
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden ">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute right- md:right-5 top-5 bottom-5 bg-[#fff] rounded-[16px] w-full max-w-[430px] overflow-y-auto flex flex-col">
        <div
          style={{
            backgroundImage: usebg ? 'url(/media/images/projectmanagement/top-image-create-project.png)' : '',
            backgroundSize: '110%',
            backgroundPosition: 'center',
            backgroundColor: '#fff',
            width: '100%',
          }}
          className="w-full p-4"
        >
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-[#262626] hover:text-gray-700 p-2"
              aria-label="Close modal"
            >
              <X size={25} />
            </button>
          </div>
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
        </div>

        <div className="p-6 flex-1 overflow-y-auto">{children}</div>

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

export { SideModal };
