/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react'
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
import { type InitialStep3Values } from '@/app/creatives/dashboard/project-management/client-project/create/page'
import routes from '@/lib/routes'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/store'
import { clearValues } from '@/store/slices/project';
import * as Yup from 'yup';
import { useCreateExtraCostMutation } from '@/services'



interface IProps {
  handleNext: (formData: InitialStep3Values) => void
  projectId: string
}

interface PaymentSchedule {
  paymentId: string
  title: string
  amount: string
  description: string
}

export default function ProjectPayment (props: IProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleNext, projectId } = props
  const dispatch = useAppDispatch()
  const { paymentTitle, amount, paymentDescription } = useAppSelector((state) => state?.project)
 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createPayment, {isLoading} ] = useCreateExtraCostMutation()

  const initialValues = {
    title: paymentTitle,
    amount: amount,
    description: paymentDescription
  }

  // const validationSchema = Yup.object().shape({
  //   title: Yup.string().required('Please enter a payment schedule title'),
  //   amount: Yup.number().required('Please enter amount')
  // })

  const [editExpenses, setEditExpenses] = useState(false)
  const [addExpenses, setAddExpenses] = useState(false)
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [payment, setPayment] = useState<PaymentSchedule[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paymentId] = useState<string>('')
//   const [setSelectedPayment] =
//     useState<PaymentSchedule | null>(null)

//  const onSubmit = async (_values: typeof initialValues) => {
//      try {
//        const response = await createPayment({
//          projectId,
//          ...values,
//        }).unwrap();
//        const payment = response?.data;
//          dispatch(clearValues())
//       handleNext(_values);
//        } catch (error) {
//        console.error('Failed to create deliverable:', error);
//      }
//    };

  const handleSkip = () => {
    window.location.href = routes.creatives.dashboard.projectManagement.path
  }

  const handleNextStep = () => {
    const step4Data = {
      extraCost: payment.map((d) => ({
        title: d.title,
        amount: d.amount,
        description: d.description,
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
            <button className="border p-3 bg-[#F9403A] rounded-full w-full border-[#F1F1F1] text-[#fff]" >
              {/* onClick={handleDelete} */}
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
