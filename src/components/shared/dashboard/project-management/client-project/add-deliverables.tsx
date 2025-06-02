"use client"
import { Fragment, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AnimatedModal,
  CalendarWithMark,
  CenterModal,
  Delete,
  EditIcon,
  Money4,
  PlusIcon,
  RenderIf,
} from "@/components/shared"
import { AddDeliverables } from "@/components/shared/project-management.tsx/add-deliverables"
import { EditDeliverables } from "@/components/shared/project-management.tsx/edit-deliverables"
import type { InitialStep2Values } from "@/app/creatives/dashboard/project-management/client-project/create/page"
import { formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { errorToast, successToast, useGetDeliverablesQuery } from "@/services"
import { getErrorMessage } from "@/utils"
import { useDeleteDeliverable } from "@/hooks/Projects/useProjects"
import { useAppDispatch, useAppSelector } from "@/store"
import { storeValues, nextStep } from "@/store/slices/project"
import { numberFormat } from "@/lib/numbers"

interface IProps {
  handleNext: (formData: InitialStep2Values) => void
  projectId: string
}

export interface Deliverable {
  deliverableId: string
  name: string
  description: string
  startDate: string
  endDate: string
  unitAmount: number
  unit: number
  total?: number
}

export function ProjectDeliverables(props: IProps) {
  const { handleNext, projectId } = props
  const dispatch = useAppDispatch()

   const { projectId: projectIdStore} = useAppSelector((state) => state?.project);
  // Get current step from Redux
  // const currentStep = useAppSelector((state) => state.project.currentStep)

  const [editForm, setEditForm] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [deliverableId, setDeliverableId] = useState<string>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null)
  const [deliverableToDelete, setDeliverableToDelete] = useState<string | null>(null)

  const { deleteDeliverable, loading } = useDeleteDeliverable()
    const projectIdAPI: string = projectIdStore ? projectIdStore : projectId

  const {
    data: deliverablesData,
    isLoading,
    refetch,
  } = useGetDeliverablesQuery({ projectId: projectIdAPI }, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (deliverablesData?.data) {
      const mappedDeliverables = deliverablesData.data.map((item) => ({
        deliverableId: item.id ?? "",
        name: item.name ?? "",
        description: item.description ?? "",
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? "",
        unitAmount: item.unitAmount !== undefined && item.unitAmount !== null ? Number(item.unitAmount) : 0,
        unit: item.unit !== undefined && item.unit !== null ? Number(item.unit) : 0,
        total: item.total !== undefined && item.total !== null ? Number(item.total) : 0,
      }))

      setDeliverables(mappedDeliverables)
      dispatch(
        storeValues({
          deliverables: mappedDeliverables.map((d) => ({
            name: d.name,
            description: d.description,
            startDate: d.startDate,
            endDate: d.endDate,
            unitAmount: d.unitAmount,
            unit: d.unit,
          })),
        }),
      )
    }
  }, [deliverablesData, dispatch])

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleAddDeliverables = (newDeliverable: Deliverable) => {
    const deliverableWithId = {
      ...newDeliverable,
      deliverableId: newDeliverable.deliverableId || "",
    }
    setDeliverables((prev) => {
      const updated = [...prev, deliverableWithId]
      dispatch(
        storeValues({
          deliverables: updated.map((d) => ({
            name: d.name,
            description: d.description,
            startDate: d.startDate,
            endDate: d.endDate,
            unitAmount: d.unitAmount,
            unit: d.unit,
          })),
        }),
      )

      return updated
    })
    void refetch()
  }

  const handleDelete = async () => {
    if (!deliverableToDelete) return
    try {
      await deleteDeliverable({
        deliverableId: deliverableToDelete,
        projectId,
      }).unwrap()

      successToast("Deliverable deleted successfully")
      setIsDecisionModalOpen(false)
      setDeliverableToDelete(null)
      refetch()
    } catch (error) {
      console.error("Delete error:", error)
      errorToast("Failed to delete deliverable")
    }
  }

  const handleDeleteClick = (paymentId: string) => {
    setDeliverableToDelete(paymentId)
    setIsDecisionModalOpen(true)
  }

  const onEdit = (id: string) => {
    const deliverableToEdit = deliverables.find((d) => d.deliverableId === id)
    if (!deliverableToEdit) {
      const message = getErrorMessage(!deliverableId)
      errorToast(message || "Something went wrong")
      return
    }
    setDeliverableId(id)
    setSelectedDeliverable(deliverableToEdit)
    setEditForm(false)
  }

  const handleNextStep = () => {
    const step2Data = {
      deliverables: deliverables.map((d) => ({
        name: d.name,
        description: d.description,
        startDate: d.startDate,
        endDate: d.endDate,
        unitAmount: d.unitAmount,
        unit: d.unit,
      })),
    }

    // Store in Redux and move to next step
    dispatch(storeValues(step2Data))
    dispatch(nextStep())

    handleNext(step2Data)
  }

  const total = deliverables.reduce((sum, d) => sum + (d.total || d.unitAmount), 0)

  const startDates = deliverables.map((d) => new Date(d.startDate))
  const endDates = deliverables.map((d) => new Date(d.endDate))
  const minStart = startDates.length ? new Date(Math.min(...startDates.map((d) => d.getTime()))) : null
  const maxEnd = endDates.length ? new Date(Math.max(...endDates.map((d) => d.getTime()))) : null
  const timeline =
    minStart && maxEnd ? `${formatDate(minStart.toISOString())} - ${formatDate(maxEnd.toISOString())}` : ""

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <AnimatedModal
        {...{
          isOpen: isModalOpen,
          from: "right",
          onClose: closeModal,
          className:
            "lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7",
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
              from: "right",
              onClose: onEdit,
              className:
                "lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7",
            }}
          >
            <EditDeliverables
              onClose={() => {
                setEditForm(true)
                setSelectedDeliverable(null)
              }}
              projectId={projectId}
              deliverableId={deliverableId}
              onEditDeliverable={(updatedDeliverable) => {
                setDeliverables((prev) => {
                  const updated = prev.map((d) =>
                    d.deliverableId === updatedDeliverable.deliverableId ? updatedDeliverable : d,
                  )

                  // Store in Redux
                  dispatch(
                    storeValues({
                      deliverables: updated.map((d) => ({
                        name: d.name,
                        description: d.description,
                        startDate: d.startDate,
                        endDate: d.endDate,
                        unitAmount: d.unitAmount,
                        unit: d.unit,
                      })),
                    }),
                  )

                  return updated
                })
                void refetch()
              }}
            />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        <CenterModal
          headerImageType={3}
          isOpen={isDecisionModalOpen}
          onClose={() => {
            setIsDecisionModalOpen(false)
            setDeliverableToDelete(null)
          }}
          showFooter
          footerChildren={
            <div className="w-full flex items-center gap-5">
              <button
                className="border p-3 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]"
                onClick={() => {
                  setIsDecisionModalOpen(false)
                  setDeliverableToDelete(null)
                }}
              >
                Cancel
              </button>
              <button
                className="border p-3 bg-[#F9403A] rounded-full w-full border-[#F1F1F1] text-[#fff] disabled:opacity-50"
                onClick={() => {
                  handleDelete()
                }}
                disabled={loading}
                type="button"
              >
                {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Delete"}
              </button>
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="font-semibold">Are you sure you want to delete deliverable?</p>
            <p>Deliverable will be deleted permanently</p>
          </div>
        </CenterModal>

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
            {deliverables.length > 0 ? "Add another deliverable" : "Add deliverable"}
          </button>
        </div>
        <div>
          <div>
            {isLoading ? (
              <div className="text-center flex justify-center items-center">
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : deliverables.length > 0 ? (
              deliverables.map((deliverable) => (
                <div
                  key={deliverable.deliverableId}
                  className="border p-4 rounded-md shadow mb-4 flex justify-between items-center bg-[#E7E7E7]"
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold mb-3">{deliverable.name}</h4>
                      <div className="flex gap-4">
                        <EditIcon
                          className="cursor-pointer"
                          fill="#888888"
                          onClick={() => onEdit(deliverable.deliverableId)}
                        />
                        <button onClick={() => handleDeleteClick(deliverable.deliverableId)}>
                          <Delete className="cursor-pointer" />
                        </button>
                      </div>
                    </div>
                    <p className="mb-2">{deliverable.description}</p>
                    <p className="flex gap-4 mb-3">
                      <CalendarWithMark fill="#6E50DB" />
                      {formatDate(deliverable.startDate)}
                    </p>
                    <p className="flex gap-4 mb-3">
                      <CalendarWithMark fill="#6E50DB" />
                      {formatDate(deliverable.endDate)}
                    </p>
                    <div className="flex gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Money4 />
                        <p className="font-bold">Unit:</p>
                      </div>
                      {deliverable.unit}
                    </div>
                    <div className="flex gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Money4 />
                        <p className="font-bold">Unit Amount:</p>
                      </div>
                      {numberFormat(deliverable.unitAmount)}
                    </div>
                    <div className="flex gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Money4 />
                        <p className="font-bold">Total:</p>
                      </div>
                      {numberFormat(deliverable.total)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No deliverables added yet.</p>
            )}
          </div>
        </div>
        {deliverables.length > 0 && (
          <div className="mt-10 text-[#262626]">
            <p className="flex justify-between mb-2">
              Total deliverables: <span>{deliverables.length}</span>
            </p>
            <p className="flex justify-between mb-2">
              Timeline <span>{timeline}</span>
            </p>
            {/* <p className="flex justify-between mb-2">
              Sub Total: <span>NGN {total.toLocaleString()}</span>
            </p> */}
            <p className="flex justify-between font-bold">
              Total <span className="font-bold">NGN {numberFormat(total)}</span>
            </p>
          </div>
        )}
        <div className="py-8 flex gap-5 text-right">
          <Button
            type="button"
            size="xl"
            backgroundColor="primary-blue-500"
            className="w-full py-3 px-12 "
            onClick={handleNextStep}
            disabled={deliverables.length === 0 || isLoading}
          >
            Save and continue
          </Button>
        </div>
      </div>
    </div>
  )
}
