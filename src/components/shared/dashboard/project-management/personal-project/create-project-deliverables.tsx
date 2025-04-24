'use client'
import { Fragment, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import routes from '@/lib/routes'
import { AnimatedModal, CalendarWithMark, Delete, EditIcon, Money4, PlusIcon, RenderIf } from '@/components/shared'
import { Modal } from '@/components/shared/decisionModal'
import { AddDeliverables } from '@/components/shared/project-management.tsx/add-deliverables'
import { EditDeliverables } from '@/components/shared/project-management.tsx/edit-deliverables'
import queries from '@/services/queries/projects'
import { formatDate } from '@/lib/utils'

interface Deliverable {
  deliverableId: string
  deliverableName: string
  deliverableDescription: string
  startDate: string
  dueDate: string
  deliverableAmount: string
  timeline?: string
  totalAmount?: string
}

export function PersonalProjectDeliverables ({ projectId }: { projectId: string }) {
  const [editForm, setEditForm] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  // const [selectedDeliverableId, setSelectedDeliverableId] = useState<string>('')
  const [deliverableId, setDeliverableId] = useState<string>('');
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null)

  const { data, refetch } = queries.readDeliverables(
    { projectId },
    {
      onSuccess: (newData: any) => {
        if (Array.isArray(newData)) {
          const validDeliverables = newData.map((item) => {
            return {
              ...item,
              deliverableId: item.deliverableId || item.id || ''
            }
          })
          setDeliverables(validDeliverables)
        } else {
          setDeliverables([])
        }
      }
    }
  )

  const { mutate: deleteDeliverables } = queries.deleteDeliverables(
    {},
    {
      onSuccess: () => {
        void refetch()
      }
    }
  )

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        const validDeliverables = data.map((item) => ({
          ...item,
          deliverableId: item.deliverableId || item.id || ''
        }))
        setDeliverables(validDeliverables)
      }
    }
  }, [data])

  const handleCloseModal = () => {
    setIsDecisionModalOpen(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleAddDeliverables = (newDeliverable: Deliverable) => {
    const deliverableWithId = {
      ...newDeliverable,
      deliverableId: newDeliverable.deliverableId || ''
    }
    setDeliverables((prev) => [...prev, deliverableWithId])
    void refetch()
  }

  const handleDelete = () => {
    if (!deliverableId) {
      console.error('Deliverable ID is undefined. Cannot delete.')
      return
    }
    setDeliverables((prev) => prev.filter((d) => d.deliverableId !== deliverableId))
    deleteDeliverables({ projectId, deliverableId })
    setIsDecisionModalOpen(false)
  }

  const onEdit = (id: string) => {
    const deliverableToEdit = deliverables.find((d) => d.deliverableId === id)
    if (!deliverableToEdit) {
      console.error('Cannot find deliverable with ID:', id)
      return
    }
    setDeliverableId(id)
    setSelectedDeliverable(deliverableToEdit)
    setEditForm(false)
  }

  const handleSkip = () => {
    window.location.href = routes.creatives.dashboard.projectManagement.path
  }

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <AnimatedModal
        {...{
          isOpen: isModalOpen,
          from: 'right',
          onClose: closeModal,
          className:
            'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2'
        }}
      >
        <AddDeliverables
          onClose={closeModal}
          projectId={projectId}
          onAddDeliverable={handleAddDeliverables}
          setDeliverableId={setDeliverableId}
        />
      </AnimatedModal>

      <RenderIf condition={!editForm}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'right',
              onClose: () => { setEditForm(true); },
              className:
                'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2'
            }}
          >
            <EditDeliverables
              onClose={() => {
                setEditForm(true)
                setSelectedDeliverable(null)
              }}
              projectId={projectId}
              deliverableId={deliverableId}
              deliverable={selectedDeliverable}
              onEditDeliverable={(updatedDeliverable) => {
                setDeliverables((prev) =>
                  prev.map((d) => (d.deliverableId === updatedDeliverable.deliverableId ? updatedDeliverable : d))
                )
                void refetch()
              }}
            />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        <Modal {...{ open: isDecisionModalOpen, handleClose: handleCloseModal }}>
          <div className="app_modal__ctt__mid">
            <h2 className="app_modal__ctt__mid__h2">Are you sure you want to delete this deliverable?</h2>
            <p className="text-[#888888]">Deliverable will be deleted Permanently</p>
          </div>

          <div className="app_modal__ctt__btm flex gap-4">
            <Button
              backgroundColor="transparent"
              size="xl"
              color="treva-purple-500"
              className="w-full border border-[#F1F1F1]"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button backgroundColor="error-500" color="white" size="xl" className="w-full" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal>

        <h3 className="app_get_started_professional_details__form__title">
          Deliverables <br />
          <span className="text-[#6D6D6D]">Add all deliverables for this project.</span>
        </h3>
        <div className="">
          <button
            className="flex gap-3 text-[#7D6CE8]"
            onClick={() => {
              setIsModalOpen(true)
            }}
          >
            <PlusIcon fill="var(--treva-purple-500)" />
            {deliverables.length > 0 ? 'Add another deliverable' : 'Add deliverable'}
          </button>
        </div>
        <div>
          {deliverables.map((item, index) => {
            return (
              <div
                key={index}
                className="border p-4 rounded-md shadow mb-4 flex justify-between items-center bg-[#E7E7E7] "
              >
                <div>
                  <div className="flex items-center gap-24 lg:gap-60">
                    <h4 className="font-semibold mb-3">{item.deliverableName}</h4>
                    <div className="flex gap-4">
                      <EditIcon
                        className="cursor-pointer"
                        fill="#888888"
                        onClick={() => {
                          if (item.deliverableId) {
                            onEdit(item.deliverableId)
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (item.deliverableId) {
                            setDeliverableId(item.deliverableId)
                            setIsDecisionModalOpen(true)
                          }
                        }}
                      >
                        <Delete className="cursor-pointer" />
                      </button>
                    </div>
                  </div>
                  <p className="mb-2">{item.deliverableDescription}</p>
                  <p className="flex gap-4 mb-3 ">
                    <CalendarWithMark fill="#6E50DB" />
                    {item.startDate}
                  </p>
                  <p className="flex gap-4 mb-3">
                    <CalendarWithMark fill="#6E50DB" />
                    {formatDate(item.dueDate)}
                  </p>
                  <p className="flex gap-4">
                    <Money4 stroke="#6E50DB" /> {item.deliverableAmount}
                  </p>
                </div>
              </div>
            )
          })}

          {deliverables.length > 0 && (
            <div className="mt-10 text-[#262626]">
              <p className="flex justify-between mb-2">
                Total deliverables: <span>{deliverables.length}</span>
              </p>
              <p className="flex justify-between mb-2">
                Timeline{' '}
                <span>{deliverables[0].timeline}</span>
              </p>
              <p className="flex justify-between mb-2">
                Sub Total: <span>NGN {deliverables[0].totalAmount}</span>
              </p>
              <p className="flex justify-between">
                Total <span className="font-bold">NGN {deliverables[0].totalAmount}</span>
              </p>
            </div>
          )}
        </div>
        <div className="pt-4 flex justify-end">
          <Button
            type="button"
            size="xl"
            backgroundColor="primary-blue-500"
            className="w-1/2 py-3 px-12"
            onClick={handleSkip}
            disabled={deliverables.length === 0}
          >
            Create Project
          </Button>
        </div>
      </div>
    </div>
  )
}
