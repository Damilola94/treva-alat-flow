"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CalendarWithMark, CenterModal, Delete, EditIcon, Money4, PlusIcon, SideModal } from "@/components/shared"
import type { InitialStep4Values } from "@/app/creatives/dashboard/project-management/client-project/create/page"
import routes from "@/lib/routes"
import { formatDate } from "@/lib/utils"
import * as Yup from "yup"
import { useAppDispatch, useAppSelector } from "@/store"
import { useFormik } from "formik"
import { storeValues, nextStep } from "@/store/slices/project"
import {
  errorToast,
  successToast,
  useCreatePaymentScheduleMutation,
  useGetAllPaymentScheduleQuery,
  useUpdatePaymentScheduleMutation,
} from "@/services"
import { useDeletePaymentSchedule } from "@/hooks/Projects/useProjects"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface IProps {
  handleNext: (formData: InitialStep4Values) => void
  projectId: string
  paymentScheduleId?: string
}

interface PaymentSchedule {
  paymentScheduleId: string
  dueDate: string
  amount: string
}

const validationSchema = Yup.object({
  amount: Yup.string().required("Amount is required"),
  dueDate: Yup.string().required("Due date is required"),
})

export function ProjectPaymentSchedule(props: IProps) {
  const { handleNext, projectId } = props
  const dispatch = useAppDispatch()

  // Get values from Redux store
  const { amount, dueDate, projectId: projectIdStore, } = useAppSelector((state) => state?.project)
    const projectIdAPI: string = projectIdStore ? projectIdStore : projectId

  const [createPaymentSchedule, { isLoading }] = useCreatePaymentScheduleMutation()
  const { data: paymentScheduleData, refetch } = useGetAllPaymentScheduleQuery(projectIdAPI)
  const [updatedPaymentSchedule] = useUpdatePaymentScheduleMutation()
  const { deletePaymentSchedule } = useDeletePaymentSchedule()

  const [editPaymentSchedule, setEditPaymentSchedule] = useState(false)
  const [addPaymentSchedule, setAddPaymentSchedule] = useState(false)
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([])

  const [selectedPaymentSchedule, setSelectedPaymentSchedule] = useState<PaymentSchedule | null>(null)
  const [paymentScheduleToDelete, setPaymentScheduleToDelete] = useState<string | null>(null)

  // Form for adding payments schedule
  const addFormik = useFormik({
    initialValues: {
      dueDate: dueDate || "",
      amount: amount || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createPaymentSchedule({
          projectId,
          ...values,
        }).unwrap()
        successToast("Payment schedule created successfully")
        resetForm()
        setAddPaymentSchedule(false)

        // Store in Redux
        dispatch(
          storeValues({
            amount: values.amount,
            dueDate: values.dueDate,
          }),
        )

        refetch()
      } catch (error) {
        errorToast("Failed to create payment schedule")
      }
    },
  })

  // Form for editing payments schedule
  const editFormik = useFormik({
    initialValues: {
      amount: "",
      dueDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedPaymentSchedule) return

      try {
        const response = await updatedPaymentSchedule({
          projectId,
          paymentScheduleId: selectedPaymentSchedule.paymentScheduleId,
          ...values,
        }).unwrap()
        const updated = response?.data
        if (updated?.id) {
          setPaymentSchedule((prev) => {
            const updatedSchedules = prev.map((p) =>
              p.paymentScheduleId === updated.id ? { ...p, ...values, paymentScheduleId: updated.id } : p,
            )

            // Store in Redux
            dispatch(
              storeValues({
                paymentSchedule: updatedSchedules.map((p) => ({
                  amount: p.amount,
                  dueDate: p.dueDate,
                })),
              }),
            )

            return updatedSchedules
          })
          successToast(response?.message || "Payment updated successfully")
          setEditPaymentSchedule(false)
          setSelectedPaymentSchedule(null)
          refetch()
        } else {
          errorToast(response?.message || "Something went wrong")
        }
      } catch (error) {
        errorToast("Failed to update payment")
      }
    },
  })

  // Store form values in Redux on input change
  useEffect(() => {
    dispatch(
      storeValues({
        amount: addFormik.values.amount,
        dueDate: addFormik.values.dueDate,
      }),
    )
  }, [addFormik.values, dispatch])

  const handleEditClick = (paymentItem: PaymentSchedule) => {
    setSelectedPaymentSchedule(paymentItem)
    editFormik.setValues({
      amount: String(paymentItem.amount || ""),
      dueDate: paymentItem.dueDate || "",
    })
    setEditPaymentSchedule(true)
  }

  const handleDeleteClick = (paymentId: string) => {
    setPaymentScheduleToDelete(paymentId)
    setIsDecisionModalOpen(true)
  }

  const handleDelete = async () => {
    if (!paymentScheduleToDelete) return

    try {
      await deletePaymentSchedule({
        extraCostId: paymentScheduleToDelete,
        projectId,
      }).unwrap()
      successToast("Payment deleted successfully")
      setIsDecisionModalOpen(false)
      setPaymentScheduleToDelete(null)
      refetch()
    } catch (error) {
      errorToast("Failed to delete payment")
    }
  }

  const handleSkip = () => {
   localStorage.setItem(`project-${projectId}-step`, '4');
    window.location.href = routes.creatives.dashboard.projectManagement.path
  }

  const handleNextStep = () => {
    const step4Data = {
      paymentSchedule: paymentSchedule.map((d) => ({
        amount: d.amount,
        dueDate: d.dueDate,
      })),
    }

    // Store in Redux and move to next step
    dispatch(storeValues(step4Data))
    dispatch(nextStep())

    handleNext(step4Data)
  }

  useEffect(() => {
    if (Array.isArray(paymentScheduleData?.data)) {
      const mappedSchedules = paymentScheduleData.data.map((item) => ({
        paymentScheduleId: item.id ?? "",
        dueDate: item.dueDate ?? "",
        amount: item.amount ?? "",
      }))

      setPaymentSchedule(mappedSchedules)

      dispatch(
        storeValues({
          paymentSchedule: mappedSchedules.map((p) => ({
            amount: p.amount,
            dueDate: p.dueDate,
          })),
        }),
      )
    } else {
      setPaymentSchedule([])
    }
  }, [paymentScheduleData, dispatch])

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <SideModal
        isOpen={addPaymentSchedule}
        onClose={() => {
          setAddPaymentSchedule(false)
          addFormik.resetForm()
        }}
        title="Add payment schedule"
        showFooter
        usebg
        footerChildren={
          <div className="w-full flex items-center gap-5 mt-24">
            <button
              className="border p-5 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]"
              onClick={() => {
                setAddPaymentSchedule(false)
                addFormik.resetForm()
              }}
            >
              Close
            </button>
            <button
              className="border p-5 bg-[#7B37F0] rounded-full w-full border-[#F1F1F1] text-[#fff] disabled:opacity-50"
              onClick={() => addFormik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Add"}
            </button>
          </div>
        }
      >
        <form onSubmit={addFormik.handleSubmit} className="space-y-5 relative">
          <div>
            <Input
              placeholder="Amount"
              name="amount"
              value={addFormik.values.amount}
              onChange={(e) => {
                addFormik.handleChange(e)
                dispatch(storeValues({ amount: e.target.value }))
              }}
              onBlur={addFormik.handleBlur}
            />
            {addFormik.touched.amount && addFormik.errors.amount && (
              <p className="text-red-500 text-sm mt-1">{addFormik.errors.amount}</p>
            )}
          </div>
          <div>
            <label htmlFor="">Due date</label>
            <Input
              placeholder="Due date"
              type="date"
              name="dueDate"
              value={addFormik.values.dueDate}
              onChange={(e) => {
                addFormik.handleChange(e)
                dispatch(storeValues({ dueDate: e.target.value }))
              }}
              onBlur={addFormik.handleBlur}
            />
            {addFormik.touched.dueDate && addFormik.errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{addFormik.errors.dueDate}</p>
            )}
          </div>
        </form>
      </SideModal>

      <SideModal
        isOpen={editPaymentSchedule}
        onClose={() => {
          setEditPaymentSchedule(false)
          setSelectedPaymentSchedule(null)
          editFormik.resetForm()
        }}
        title="Edit payment schedule"
        showFooter
        usebg
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button
              className="border p-5 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]"
              onClick={() => {
                setEditPaymentSchedule(false)
                setSelectedPaymentSchedule(null)
                editFormik.resetForm()
              }}
            >
              Close
            </button>
            <button
              className="border p-5 bg-[#7B37F0] rounded-full w-full border-[#F1F1F1] text-[#fff] disabled:opacity-50"
              onClick={() => editFormik.handleSubmit()}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Update"}
            </button>
          </div>
        }
      >
        <form onSubmit={editFormik.handleSubmit} className="space-y-5 relative">
          <div>
            <Input
              placeholder="Amount"
              name="amount"
              value={editFormik.values.amount}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
            />
            {editFormik.touched.amount && editFormik.errors.amount && (
              <p className="text-red-500 text-sm mt-1">{editFormik.errors.amount}</p>
            )}
          </div>
          <div>
            <Input
              placeholder="Due date"
              name="dueDate"
              value={editFormik.values.dueDate}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
            />
            {editFormik.touched.dueDate && editFormik.errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{editFormik.errors.dueDate}</p>
            )}
          </div>
        </form>
      </SideModal>

      <CenterModal
        headerImageType={3}
        isOpen={isDecisionModalOpen}
        onClose={() => {
          setIsDecisionModalOpen(false)
          setPaymentScheduleToDelete(null)
        }}
        showFooter
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button
              className="border p-3 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]"
              onClick={() => {
                setIsDecisionModalOpen(false)
                setPaymentScheduleToDelete(null)
              }}
            >
              Cancel
            </button>
            <button
              className="border p-3 bg-[#F9403A] rounded-full w-full border-[#F1F1F1] text-[#fff] disabled:opacity-50"
              onClick={handleDelete}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Delete"}
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="font-semibold">Are you sure you want to delete payment?</p>
          <p>Payment will be deleted permanently</p>
        </div>
      </CenterModal>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        <h3 className="app_get_started_professional_details__form__title">
          Billing Schedule <br />
          <span className="text-[#6D6D6D] text-sm">Setup how you want to be paid.</span>
        </h3>
        <div className="">
          <button
            className="flex gap-3 text-[#7D6CE8]"
            onClick={() => {
              setAddPaymentSchedule(true)
            }}
          >
            <PlusIcon fill="var(--treva-purple-500)" />
            {paymentSchedule.length > 0 ? "Add another payment" : "Add payment"}
          </button>
        </div>
        <div>
          {isLoading ? (
            <div className="text-center flex justify-center items-center">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : paymentSchedule.length > 0 ? (
            paymentSchedule.map((item) => (
              <div
                key={item.paymentScheduleId}
                className="border p-4 rounded-md mb-4 
                flex justify-between items-center bg-[#E7E7E7]"
              >
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold mb-3 flex gap-4">
                      <Money4 stroke="#7D6CE8" />
                      {item.amount}
                    </h4>
                    <div className="flex gap-4">
                      <EditIcon className="cursor-pointer " fill="#888888" onClick={() => handleEditClick(item)} />
                      <button onClick={() => handleDeleteClick(item.paymentScheduleId)}>
                        <Delete className="cursor-pointer" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="flex items-center gap-4">
                      <CalendarWithMark fill="#6E50DB" />
                      Due date
                    </p>
                    <p className="font-bold">{formatDate(item.dueDate)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="flex items-center gap-4">
                      <Money4 stroke="#6E50DB" />
                      Amount
                    </p>
                    <p className="font-bold">NGN{item.amount}.00</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p className="text-gray-500">No payment schedule added yet.</p>
            </div>
          )}
        </div>
        <div className="pt-4 flex gap-4">
          <Button
            type="button"
            size="xl"
            backgroundColor="primary-blue-500"
            className="w-1/2 py-3 px-12"
            onClick={handleSkip}
          >
            skip for now
          </Button>

          <Button
            type="button"
            size="xl"
            backgroundColor="primary-blue-500"
            className="w-1/2 py-3 px-12"
            onClick={handleNextStep}
          >
            Save and continue
          </Button>
        </div>
      </div>
    </div>
  )
}
