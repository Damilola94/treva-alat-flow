import React from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  headerImageType?: number
  isOpen: boolean
  showFooter?: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footerChildren?: React.ReactNode
  actionText?: string
  onAction?: () => void
}

const CenterModal: React.FC<ModalProps> = ({
  headerImageType = 1,
  isOpen,
  onClose,
  showFooter,
  title,
  children,
  footerChildren,
}) => {
  if (!isOpen) return null

  const topBgImg =
    headerImageType === 1
      ? 'url(/media/images/projectmanagement/top-image-create-project.png)'
      : headerImageType === 2
      ? 'url(/media/images/projectmanagement/header.png)'
      : headerImageType === 3
      ? 'url(/media/images/projectmanagement/deleteImage.png)'
      : headerImageType === 4
      ? 'url(/media/images/projectmanagement/success.png)'
      : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-spaceGrotesk">
      {/* Overlay that closes modal when clicked outside content */}
      <div className="absolute inset-0 " onClick={onClose} />

      {/* Modal Content */}
      <div
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            backgroundImage: topBgImg,
            backgroundSize:
              headerImageType === 1
                ? '110%'
                : headerImageType === 2
                ? '100%'
                : 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#fff',
             marginTop:
              headerImageType === 2 ? '-10px' : headerImageType === 3 || headerImageType === 4 ? '50px' : '16px',
            paddingTop:
              headerImageType === 3 || headerImageType === 4 ? '40px' : '16px',
            paddingBottom:
              headerImageType === 3 || headerImageType === 4 ? '20px' : '16px',
             minHeight: headerImageType === 2 ? '120px' : 'auto',
              display: 'flex',
            flexDirection: 'column',
            alignItems:
              headerImageType === 3 || headerImageType === 4
                ? 'center'
                : 'flex-start',
          }}
          className="w-full p-4"
        >
          <div
            className='absolute right-2 top-2 z-10'
          >
            <button
              onClick={onClose}
              className="p-2 text-[#262626] hover:text-gray-700"
              aria-label="Close modal"
            >
              <X size={25} />
            </button>
          </div>
          {title && (
            <h2
              className={`font-bold ${
                headerImageType === 3 || headerImageType === 4
                  ? 'text-xl mt-4 text-center'
                  : 'text-2xl'
              }`}
            >
              {title}
            </h2>
          )}
        </div>

        {/* Modal Body */}
        <div className={`flex-1 overflow-y-auto p-6 ${headerImageType === 3 || headerImageType === 4 ? 'pt-4' : ''}`}>{children}</div>

        {/* Modal Footer */}
        {showFooter && (
          <div className="flex min-h-16 justify-end border-t border-[#E7E7E7] p-4">
            {footerChildren}
          </div>
        )}
      </div>
    </div>
  )
}

export { CenterModal }
