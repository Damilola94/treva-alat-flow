'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
// import routes from '@/lib/routes'
import {
  CenterModal,
  Delete,
  EditIcon,
  Money4,
  PlusIcon,
  SideModal,
} from '@/components/shared'
import queries from '@/services/queries/projects'
import { type InitialStep3Values } from '@/app/creatives/dashboard/project-management/client-project/create/page'
import routes from '@/lib/routes'
import { Input } from '@/components/ui/input'

interface IProps {
  handleNext: (formData: InitialStep3Values) => void
  projectId: string
}

interface PaymentSchedule {
  paymentId: string
  title: string
  amount: string
}

export default function ProjectPayment (props: IProps) {
  const { handleNext, projectId } = props
  const [editExpenses, setEditExpenses] = useState(false)
  const [addExpenses, setAddExpenses] = useState(false)
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  const [payment, setPayment] = useState<PaymentSchedule[]>([])
  const [paymentId] = useState<string>('')
//   const [setSelectedPayment] =
//     useState<PaymentSchedule | null>(null)

  const { data, refetch } = queries.readPayment(
    { projectId },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (newData: any) => {
        if (Array.isArray(newData)) {
          const validPayment = newData.map((item) => {
            return {
              ...item,
              deliverableId: item.deliverableId || item.id || '',
            }
          })
          setPayment(validPayment)
        } else {
          setPayment([])
        }
      },
    },
  )

  const { mutate: deletePayment } = queries.deletePayment(
    {},
    {
      onSuccess: () => {
        void refetch()
      },
    },
  )

  //   useEffect(() => {
  //     if (data) {
  //       if (Array.isArray(data)) {
  //         const validPayment = data.map((item) => ({
  //           ...item,
  //           paymentId: item.paymentId || item.id || '',
  //         }))
  //         setPayment(validPayment)
  //       }
  //     }
  //   }, [data])

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const validPayment = data.map((item) => ({
        ...item,
        paymentId: item.paymentId || item.id || '',
      }))

      // Only update state if the new data is different from the current state
      if (JSON.stringify(validPayment) !== JSON.stringify(payment)) {
        setPayment(validPayment)
      }
    }
  }, [data, payment])
//   const handleAddPayment = (newPayment: PaymentSchedule) => {
//     const paymentWithId = {
//       ...newPayment,
//       paymentId: newPayment.paymentId || '',
//     }
//     setPayment((prev) => [...prev, paymentWithId])
//     void refetch()
//   }

  const handleDelete = () => {
    setPayment((prev) => prev.filter((d) => d.paymentId !== paymentId))
    deletePayment({
      projectId,
      // eslint-disable-next-line object-shorthand
      paymentId: paymentId,
    })
    setIsDecisionModalOpen(false)
  }

//   const onEdit = (id: string) => {
//     const paymentToEdit = payment.find((d) => d.paymentId === id)
//     if (!paymentToEdit) {
//       console.error('Cannot find deliverable with ID:', id)
//       return
//     }
//     setPaymentId(id)
//     setSelectedPayment(paymentToEdit)
//   }

  const handleSkip = () => {
    window.location.href = routes.creatives.dashboard.projectManagement.path
  }

  const handleNextStep = () => {
    const step4Data = {
      payment: payment.map((d) => ({
        title: d.title,
        amount: d.amount,
      })),
    }
    handleNext(step4Data)
  }

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <SideModal
        isOpen={addExpenses}
        onClose={() => {
          setAddExpenses(false)
        }}
        title="Add extra expenses"
        showFooter
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button className="border p-5 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]">
              Close
            </button>
            <button className="border p-5 bg-[#7B37F0] rounded-full w-full border-[#F1F1F1] text-[#fff]">
              Add
            </button>
          </div>
        }
      >
        <div className="space-y-5 relative">
          <Input placeholder="Title" />
          <Input placeholder="Amount" />
        </div>
        <div className="flex justify-between items-center font-bold absolute bottom-32 left-0 right-0 p-4">
          <p>Total </p>
          <span>NGN 100,000.00</span>
        </div>
      </SideModal>

      <SideModal
        isOpen={editExpenses}
        onClose={() => {
          setEditExpenses(false)
        }}
        title="Edit extra expenses"
        showFooter
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button className="border p-5 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]">
              Close
            </button>
            <button className="border p-5 bg-[#7B37F0] rounded-full w-full border-[#F1F1F1] text-[#fff]">
              Update
            </button>
          </div>
        }
      >
        <div className="space-y-5 relative">
          <Input placeholder="Title" />
          <Input placeholder="Amount" />
        </div>
        <div className="flex justify-between items-center font-bold absolute bottom-32 left-0 right-0 p-4">
          <p>Total </p>
          <span>NGN 100,000.00</span>
        </div>
      </SideModal>

      <CenterModal
        headerImageType={3}
        isOpen={isDecisionModalOpen}
        onClose={() => {
          setIsDecisionModalOpen(false)
        }}
        showFooter
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button className="border p-3 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]">
              Cancel
            </button>
            <button className="border p-3 bg-[#F9403A] rounded-full w-full border-[#F1F1F1] text-[#fff]" onClick={handleDelete}>
              Delete
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <p className='font-semibold'>Are you sure you want to delete payment?</p>
          <p>Payment will be deleted Permanently</p>
        </div>
      </CenterModal>

      <div className="app_get_started_professional_details__form flex flex-col gap-4 !overflow-y-auto">
        <h3 className="app_get_started_professional_details__form__title">
          Payment <br />
          <span className="text-[#6D6D6D] text-sm">
            Setup how you want to be paid.
          </span>
        </h3>
        <div className="text-[#262626] border-t border-b border-[#E7E7E7]">
          <p className="flex justify-between mt-5 mb-2">
            Total deliverables: <span>2</span>
          </p>
          <p className="flex justify-between mb-2">
            Timeline: <span>02/05/2025</span>
          </p>
          <p className="flex justify-between mb-5 font-bold">
            Sub Total: <span>NGN 200,000.00</span>
          </p>
        </div>
        <div>
          <button
            className="flex gap-3 text-[#7D6CE8]"
            onClick={() => {
              setAddExpenses(true)
            }}
          >
            <PlusIcon fill="var(--treva-purple-500)" />
            {payment.length > 0 ? 'Add extra expenses' : 'Add expenses'}
          </button>
        </div>
        <div>
          <div className="border p-4 rounded-md shadow mb-4 bg-[#E7E7E7] ">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">Extra Expense 1</h4>
                </div>
                <div className="flex gap-2">
                  <EditIcon
                    className="cursor-pointer w-5 h-5"
                    fill="#888888"
                    onClick={() => {
                      setEditExpenses(true)
                    }}
                  />
                  <button
                    onClick={() => {
                      setIsDecisionModalOpen(true)
                    }}
                  >
                    <Delete className="cursor-pointer" />
                  </button>
                </div>
              </div>
              <p className="flex gap-2 items-center justify-between">
                <Money4 stroke="#6E50DB" />
                <span> NGN 10,000.00</span>
              </p>
            </div>
          </div>
        </div>
        <p className="flex justify-between border-t border-b border-[#E7E7E7] py-4 font-bold">
          Total <span>NGN 67,200.00</span>
        </p>
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
            disabled={payment.length === 0}
          >
            Save and continue
          </Button>
        </div>
      </div>
    </div>
  )
}
