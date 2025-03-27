'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@/components/shared'
import { Modal } from '@/components/shared/decisionModal'
import Image from 'next/image'
import projectManagement from '@/lib/assets/project-management'
import queries from '@/services/queries/projects'
import routes from '@/lib/routes'

interface IProps {
  // handleNext: (formData: InitialStep5Values) => void
  projectId: string
  onChange?: () => void
  value?: boolean
}

// interface Review {
//   projectId: string
//   termsAndConditions: false

// }

const thead = [
  { label: 'S/N' },
  { label: 'Deliverable name' },
  { label: 'Description' },
  { label: 'Unit Price' },
  { label: 'Unit' },
  { label: 'Amount' }
];

export function ProjectReview (props: IProps) {
  const { projectId } = props;
  const { data } = queries.readReview({ projectId })
  const { mutate } = queries.createInvoice({ projectId }, { onSuccess: () => { setIsDeleteModal(true) } })
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const handleCloseModal = () => {
    setIsDecisionModalOpen(false)
    setIsDeleteModal(false)
  }

  const handleSendInvoice = () => {
    mutate({ projectId })
    setIsDecisionModalOpen(false)
    // setIsDeleteModal(true)
  }

  const handleDone = () => {
    window.location.href = routes.dashboard.projectManagement.path;
  }

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="app_get_started_professional_details__form flex flex-col gap-10 !max-w-[700px] !mx-auto">
      <Modal {...{ open: isDecisionModalOpen, handleClose: handleCloseModal }}>
          <div className="app_modal__ctt__mid">
            <Image src={projectManagement.successLogo || '/placeholder.svg'} alt="successLogo" className="w-16" />
            <h2 className="app_modal__ctt__mid__h2">Are you sure you want to send
            this invoice</h2>
            <p className="text-[#888888]">Invoice will be sent to client for payment</p>
          </div>

          <div className="app_modal__ctt__btm flex gap-4">
          <Button size="lg" className="w-full border border-[#F1F1F1] text-[#262626]" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button size="lg" style={{ backgroundColor: '#262626', color: '#FFFFFF' }}className="w-full" onClick={handleSendInvoice}>
              Send Invoice
            </Button>
          </div>
        </Modal>

        <Modal {...{ open: isDeleteModal, handleClose: handleCloseModal }}>
          <div className="app_modal__ctt__mid">
            <Image src={projectManagement.successLogo || '/placeholder.svg'} alt="successLogo" className="w-16" />
            <h2 className="app_modal__ctt__mid__h2">Invoice has been sent to client successfully</h2>
            <p className="text-[#888888]">Invoice has been sent to make payment.</p>
          </div>

          <div className="app_modal__ctt__btm flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center text-[#7B37F0]"
              onClick={handleCloseModal}
            >
              <PlusIcon fill='#7B37F0'/>
              New invoice
            </Button>
            <Button style={{ backgroundColor: '#7B37F0', color: '#FFFFFF' }} size="lg" className="w-full" onClick={handleDone}>
              Done
            </Button>
          </div>
        </Modal>

        <h1 className="text-xl font-bold">Review</h1>
        <p className="text-[#888888] -mt-8">Check and confirm that all the information you&apos;ve added.</p>

        <div className='border border-[#E5E5E5] rounded-xl p-4'>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data && (
              <>
              <p>
                <span className=" text-[#6B7280]">Project name:</span > {data.projectName}
              </p>
              <p>
                  <span className=" text-[#6B7280]">Client name:</span> {data.clientName}
                </p>
                <p>
                  <span className=" text-[#6B7280]">Client email:</span> {data.clientEmail}
                </p>
                <p>
                  <span className=" text-[#6B7280]">Client phone number:</span> {data.clientPhoneNumber}
                </p>
                <p>
                  <span className=" text-[#6B7280]">Start date:</span> {data?.startDate}
                </p>
                <p>
                  <span className=" text-[#6B7280]">End date:</span> {data.endDate}
                </p>
                </>
            )}
          </div>
        </div>

        <div className="w-full text-left relative rounded-xl overflow-auto ">
          <div className='shadow-sm md:overflow-hidden '>
            <table className="border-collapse table-auto w-full app_table">
              <thead>
                <tr className="app_table__tr">
                  {thead.map(({ label }) => (
                    <th key={label} className="app_table__tr__th">
                      <div className="app_table__tr__th__edit !bg-[#EFF1FE] !border-[#EFF1FE] ">{label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.deliverables?.map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.deliverableName}</td>
                    <td className="px-4 py-2">{item.deliverableDescription}</td>
                    <td className="px-4 py-2">NGN {item.unitDeliverableAmount
                    }</td>
                    <td className="px-4 py-2">{item.units}</td>
                    <td className="px-4 py-2">{item.deliverableAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className='bg-[#E5E5E5] mt-6'/>

          </div>
        </div>

              {data && (
        <div className="mt-6 text-right space-y-4">
          <div className="flex gap-5 justify-end">
            <span className="">SUBTOTAL:</span>
            <span>NGN {data.subtotal}</span>
          </div>
          <div className="flex gap-5 justify-end">
            <span className="">Platform fee (5%):</span>
            <span>NGN {data.platformFee}</span>
          </div>
          <div className="flex gap-5 justify-end font-bold text-lg">
            <span>TOTAL:</span>
            <span>NGN {data.totalAmount}</span>
          </div>
        </div>
              )}

        </div>

        <div className="flex items-center space-x-2 px-6">
          <input
            type="checkbox"
            className="w-5 h-5"
            onChange={(e) => { setIsChecked(e.target.checked); }}
            checked={isChecked}
          />
          <label htmlFor="terms">
            <p className="text-sm text-[#888888] mt-6">
              This Agreement constitutes the entire agreement among the parties and supersedes all prior negotiations,
              understandings, and agreements relating to the subject matter hereof.
            </p>
          </label>
        </div>

        <div className="mt-6 text-right">
          <Button
            size="lg"
            className=" py-3 px-12"
            backgroundColor="primary-blue-500"

            onClick={() => {
              setIsDecisionModalOpen(true)
            }}
          disabled={!isChecked}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
