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
}

const CenterModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  showFooter,
  title,
  actionText = 'Proceed',
  onAction,
  children,
  footerChildren
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed font-spaceGrotesk inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-[#fff] rounded-lg w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div
          style={{
            backgroundImage: 'url(/media/images/projectmanagement/top-image-create-project.png)',
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
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        {/* Modal Content - Accepts children */}
        <div className="p-6">{children}</div>

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

export { CenterModal };
