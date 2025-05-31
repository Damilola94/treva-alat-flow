"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CenterModal, Delete, EditIcon, Money4, PlusIcon, SideModal } from "@/components/shared"
import type { InitialStep3Values } from "@/app/creatives/dashboard/project-management/client-project/create/page"
import routes from "@/lib/routes"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/store"
import { storeValues, nextStep } from "@/store/slices/project"
import * as Yup from "yup"
import {
  errorToast,
  successToast,
  useCreateExtraCostMutation,
  useGetAllExtraCostsQuery,
  useUpdateExtraCostMutation,
} from "@/services"
import { Loader2 } from "lucide-react"
import { useFormik } from "formik"
import { useDeletePayment } from "@/hooks/Projects/useProjects"
import type { Deliverable } from "./add-deliverables"
import { formatDate } from "@/lib/utils"

interface IProps {
  handleNext: (formData: InitialStep3Values) => void
  projectId: string
  extraCostId?: string
  deliverables: Deliverable[]
}

interface PaymentSchedule {
  extraCostId: string
  name: string
  amount: string
  description: string
}

const validationSchema = Yup.object({
  name: Yup.string().required("Title is required"),
  amount: Yup.string().required("Amount is required"),
  description: Yup.string().required("Description is required"),
})

export default function ProjectPayment(props: IProps) {
  const { handleNext, projectId, deliverables: initialDeliverables } = props
  const dispatch = useAppDispatch()

  const { paymentTitle, paymentAmount, paymentDescription, projectId: projectIdStore, } = useAppSelector((state) => state?.project)
  const projectIdAPI = projectIdStore ? projectIdStore : projectId

  const [createPayment, { isLoading }] = useCreateExtraCostMutation()
const { data: paymentData, refetch } = useGetAllExtraCostsQuery(projectIdAPI)
  const [updatedPayment] = useUpdateExtraCostMutation()
  const { deletePayment } = useDeletePayment()

  const [editExpenses, setEditExpenses] = useState(false)
  const [addExpenses, setAddExpenses] = useState(false)
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  const [payment, setPayment] = useState<PaymentSchedule[]>([])
  const [selectedPayment, setSelectedPayment] = useState<PaymentSchedule | null>(null)
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null)
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])

  // Form for adding payments
  const addFormik = useFormik({
    initialValues: {
      name: paymentTitle || "",
      amount: paymentAmount || "",
      description: paymentDescription || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createPayment({
          projectId,
          ...values,
        }).unwrap()
        resetForm()
        setAddExpenses(false)

        // Store in Redux
        dispatch(
          storeValues({
            paymentTitle: values.name,
            amount: values.amount,
            paymentDescription: values.description,
          }),
        )

        refetch()
      } catch (error) {
        console.error("Failed to create payment:", error)
      }
    },
  })

  // Form for editing payments
  const editFormik = useFormik({
    initialValues: {
      name: "",
      amount: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedPayment) return

      try {
        const response = await updatedPayment({
          projectId,
          extraCostId: selectedPayment.extraCostId,
          ...values,
        }).unwrap()
        const updated = response?.data
        if (updated?.id) {
          setPayment((prev) => {
            const updatedPayments = prev.map((p) =>
              p.extraCostId === updated.id ? { ...p, ...values, extraCostId: updated.id } : p,
            )

            // Store in Redux
            dispatch(
              storeValues({
                extraCost: updatedPayments.map((p) => ({
                  name: p.name,
                  amount: p.amount,
                  description: p.description,
                })),
              }),
            )

            return updatedPayments
          })
          setEditExpenses(false)
          setSelectedPayment(null)
          refetch()
        } else {
          console.warn("Payment ID not found in response.")
        }
      } catch (error) {
        console.error("Failed to update payment:", error)
      }
    },
  })

  useEffect(() => {
    dispatch(
      storeValues({
        paymentTitle: addFormik.values.name,
        amount: addFormik.values.amount,
        paymentDescription: addFormik.values.description,
      }),
    )
  }, [addFormik.values, dispatch])

  const handleEditClick = (paymentItem: PaymentSchedule) => {
    setSelectedPayment(paymentItem)
    editFormik.setValues({
      name: paymentItem.name || "",
      amount: String(paymentItem.amount || ""),
      description: paymentItem.description || "",
    })
    setEditExpenses(true)
  }

  const handleDeleteClick = (paymentId: string) => {
    setPaymentToDelete(paymentId)
    setIsDecisionModalOpen(true)
  }

  const handleDelete = async () => {
    if (!paymentToDelete) return

    try {
      await deletePayment({
        extraCostId: paymentToDelete,
        projectId,
      }).unwrap()
      successToast("Payment deleted successfully")
      setIsDecisionModalOpen(false)
      setPaymentToDelete(null)
      refetch()
    } catch (error) {
      errorToast("Failed to delete payment")
    }
  }

  const handleSkip = () => {
    localStorage.setItem(`project-${projectId}-step`, '3');
    window.location.href = routes.creatives.dashboard.projectManagement.path
  }

  const handleNextStep = () => {
    const step3Data = {
      extraCost: payment.map((d) => ({
        name: d.name,
        amount: d.amount,
        description: d.description,
      })),
    }
    dispatch(storeValues(step3Data))
    dispatch(nextStep())

    handleNext(step3Data)
  }

  useEffect(() => {
    if (Array.isArray(paymentData?.data)) {
      const mappedPayments = paymentData.data.map((item) => ({
        extraCostId: item.id ?? "",
        name: item.name ?? "",
        amount: item.amount ?? "",
        description: item.description ?? "",
      }))

      setPayment(mappedPayments)

      dispatch(
        storeValues({
          extraCost: mappedPayments.map((p) => ({
            name: p.name,
            amount: p.amount,
            description: p.description,
          })),
        }),
      )
    } else {
      setPayment([])
    }
  }, [paymentData, dispatch])

  useEffect(() => {
    if (initialDeliverables && Array.isArray(initialDeliverables)) {
      setDeliverables(initialDeliverables)
    }
  }, [initialDeliverables])

  const parseNumber = (value: string | undefined) => (value ? Number.parseFloat(value) || 0 : 0)

  const total = deliverables.reduce((sum, d) => sum + (parseNumber(d.total) || parseNumber(d.unitAmount)), 0)

  const startDates = deliverables.map((d) => new Date(d.startDate))
  const endDates = deliverables.map((d) => new Date(d.endDate))
  const minStart = startDates.length ? new Date(Math.min(...startDates.map((d) => d.getTime()))) : null
  const maxEnd = endDates.length ? new Date(Math.max(...endDates.map((d) => d.getTime()))) : null
  const timeline =
    minStart && maxEnd ? `${formatDate(minStart.toISOString())} - ${formatDate(maxEnd.toISOString())}` : ""

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      {/* Add Payment Modal */}
      <SideModal
        isOpen={addExpenses}
        onClose={() => {
          setAddExpenses(false)
          addFormik.resetForm()
        }}
        title="Add extra expenses"
        showFooter
        usebg
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button
              className="border p-5 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]"
              onClick={() => {
                setAddExpenses(false)
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
              placeholder="Name"
              name="name"
              value={addFormik.values.name}
              onChange={(e) => {
                addFormik.handleChange(e)
                dispatch(storeValues({ paymentTitle: e.target.value }))
              }}
              onBlur={addFormik.handleBlur}
            />
            {addFormik.touched.name && addFormik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{addFormik.errors.name}</p>
            )}
          </div>
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
            <Input
              placeholder="Description"
              name="description"
              value={addFormik.values.description}
              onChange={(e) => {
                addFormik.handleChange(e)
                dispatch(storeValues({ paymentDescription: e.target.value }))
              }}
              onBlur={addFormik.handleBlur}
            />
          </div>
        </form>
      </SideModal>

      {/* Edit Payment Modal */}
      <SideModal
        isOpen={editExpenses}
        onClose={() => {
          setEditExpenses(false)
          setSelectedPayment(null)
          editFormik.resetForm()
        }}
        title="Edit extra expenses"
        showFooter
        usebg
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button
              className="border p-5 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]"
              onClick={() => {
                setEditExpenses(false)
                setSelectedPayment(null)
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
              placeholder="Name"
              name="name"
              value={editFormik.values.name}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
            />
            {editFormik.touched.name && editFormik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{editFormik.errors.name}</p>
            )}
          </div>
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
              placeholder="Description (optional)"
              name="description"
              value={editFormik.values.description}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
            />
          </div>
        </form>
      </SideModal>

      {/* Delete Confirmation Modal */}
      <CenterModal
        headerImageType={3}
        isOpen={isDecisionModalOpen}
        onClose={() => {
          setIsDecisionModalOpen(false)
          setPaymentToDelete(null)
        }}
        showFooter
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button
              className="border p-3 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]"
              onClick={() => {
                setIsDecisionModalOpen(false)
                setPaymentToDelete(null)
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

      <div className="app_get_started_professional_details__form flex flex-col gap-4 !overflow-y-auto">
        <h3 className="app_get_started_professional_details__form__title">
          Payment <br />
          <span className="text-[#6D6D6D] text-sm">Setup how you want to be paid.</span>
        </h3>

        {deliverables.length > 0 && (
          <div className="mt-10 border border-t border-gray-600 text-[#262626]">
            <p className="flex justify-between mb-2">
              Total deliverables: <span>{deliverables.length}</span>
            </p>
            <p className="flex justify-between mb-2">
              Timeline <span>{timeline}</span>
            </p>
            <p className="flex justify-between mb-2">
              Sub Total: <span>NGN {total.toLocaleString()}</span>
            </p>
            <p className="flex justify-between font-bold">
              Total <span className="font-bold">NGN {total.toLocaleString()}</span>
            </p>
          </div>
        )}
        <div>
          <div>
            {isLoading ? (
              <div className="text-center flex justify-center items-center">
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : payment.length > 0 ? (
              payment.map((item) => (
                <div
                  key={item.extraCostId}
                  className="border p-4 rounded-md mb-4 flex justify-between items-center bg-[#E7E7E7]"
                >
                  <div className="w-full ">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{item.name}</h4>

                      <div className="flex gap-4 items-center">
                        <EditIcon className="cursor-pointer " fill="#888888" onClick={() => handleEditClick(item)} />
                        <button onClick={() => handleDeleteClick(item.extraCostId)}>
                          <Delete className="cursor-pointer" />
                        </button>
                      </div>
                    </div>
                    {item.description && <p className="my-2">{item.description}</p>}
                    <p className="flex gap-2 items-center mb-">
                      <Money4 stroke="#6E50DB" />
                      <span>NGN {item.amount}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p className="text-gray-500">No extra expenses added yet.</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <button
            className="flex gap-3 text-[#7D6CE8]"
            onClick={() => {
              setAddExpenses(true)
            }}
          >
            <PlusIcon fill="var(--treva-purple-500)" />
            {payment.length > 0 ? "Add extra expenses" : "Add expenses"}
          </button>
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
