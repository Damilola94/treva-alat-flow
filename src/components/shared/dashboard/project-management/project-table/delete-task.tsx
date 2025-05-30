import React from 'react'
import { BinWithBG } from '@/components/shared/svgs'
import { useDeleteTask } from '@/hooks/Projects/useProjects'

interface IProps {
  projectId: string
  deliverableId: string
  taskId: string
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
  refetchAllTasks?: () => void
}

export function DeleteTask (props: IProps) {
  const { projectId, deliverableId, taskId, item, handleClick, onClose, refetchAllTasks } = props;

    const {deleteTask, loading } = useDeleteTask();
  
  const handleDelete = async () => {
    try {
      await deleteTask({ projectId, deliverableId, taskId }).unwrap();
      if (refetchAllTasks) {
        refetchAllTasks();
      }
      onClose()
  } catch (e) {
      console.error('Error deleting project:', e);
    }
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
              disabled={loading}
            >
             {loading? 'Deleting...' : item?.btnText2}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
