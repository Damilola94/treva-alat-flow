import React from 'react'
import { BinWithBG } from '../svgs'
import clientQueries from '@/services/queries/client-management'

interface IProps {
  clientId: string
  onClose: () => void
  item: {
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

export function DeleteClient (props: IProps) {
  const { clientId, item, handleClick, onClose } = props;

  const { mutate: deleteClient, isLoading: isDeleting } = clientQueries.delete({
    onSuccess: () => {
      onClose();
    }
  })
  const handleDelete = () => {
    deleteClient(clientId)
  }
  return (
    <div className="delete_card flex flex-col gap-4">
      <div className={'flex flex-col gap-9 justify-between flex-1'}>
        <div className="delete_card__ctt">
          <div className="flex flex-col gap-2">
            <div className="mx-auto my-5">
              <BinWithBG />
            </div>
            <p className="delete_card__ctt__title mx-auto">{item?.title}</p>
            <p className="delete_card__ctt__text mx-auto">{item?.details}</p>
          </div>
        </div>

        <div className="delete_card__action">
          <div className="w-full  flex space-x-3 justify-center items-center">
            <button
              className="delete_card__action__btn2"
              type="button"
              onClick={handleClick}
            >
              {item?.btnText1}
            </button>
            <button
              className="delete_card__action__btn1"
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
             {isDeleting ? 'Deleting...' : item?.btnText2}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
