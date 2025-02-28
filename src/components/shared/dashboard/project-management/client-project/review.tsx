'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@/components/shared'
import { Modal } from '@/components/shared/decisionModal'
import Image from 'next/image'
import projectManagement from '@/lib/assets/project-management'

// interface Deliverable {
//   deliverableName: string
//   unitPrice: number
//   unit: number
//   deliverableAmount: number
// }

// interface ProjectData {
//   projectName: string
//   clientName: string
//   clientEmail: string
//   clientPhone: string
//   startDate: string
//   endDate: string
//   deliverables: Deliverable[]
// }

export function ProjectReview ({ projectId }: { projectId: string }) {
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  // const [isChecked, setIsChecked] = useState(false)
  // const [projectData, setProjectData] = useState<ProjectData | null >(null)

  // const { data, isLoading, error } = queries.readDeliverables({ projectId })

  // useEffect(() => {
  //   if (data) {
  //     setProjectData(data)
  //   }
  // }, [data])

  const handleCloseModal = () => {
    setIsDecisionModalOpen(false)
  }

  // const calculateSubtotal = () => {
  //   return projectData?.deliverables.reduce((total, item) => total + item.deliverableAmount, 0) ?? 0
  // }

  // const calculatePlatformFee = () => {
  //   return calculateSubtotal() * 0.05
  // }

  // const calculateTotal = () => {
  //   return calculateSubtotal() + calculatePlatformFee()
  // }

  // if (isLoading) return <div>Loading...</div>
  // if (error) return <div>Error loading project data</div>
  // if (!projectData) return <div>No project data available</div>

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto ">
        <Modal {...{ open: isDecisionModalOpen, handleClose: handleCloseModal }}>
          <div className="app_modal__ctt__mid">
            <Image src={projectManagement.successLogo || '/placeholder.svg'} alt="successLogo" className="w-16" />
            <h2 className="app_modal__ctt__mid__h2">Invoice has been sent to client successfully</h2>
            <p className="text-[#888888]">Invoice has been sent to make payment.</p>
          </div>

          <div className="app_modal__ctt__btm flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center"
              onClick={handleCloseModal}
            >
              <PlusIcon />
              New invoice
            </Button>
            <Button size="lg" className="w-full" onClick={handleCloseModal}>
              Done
            </Button>
          </div>
        </Modal>

        <h1 className="text-xl font-bold">Review</h1>
        <p className="text-[#888888] -mt-8">Check and confirm that all the information you&apos;ve added.</p>

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">Project name:</span> Project name
            </p>
            <p>
              <span className="font-semibold">Client name:</span> Client name:
            </p>
            <p>
              <span className="font-semibold">Client email:</span> Client email
            </p>
            <p>
              <span className="font-semibold">Client phone number:</span> Client phone number
            </p>
            <p>
              <span className="font-semibold">Start date:</span> Start date
              </p>
            <p>
              <span className="font-semibold">End date:</span> End date
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#EFF1FE]">
              <tr>
                <th className="px-4 py-2">S/N</th>
                <th className="px-4 py-2">Deliverable</th>
                <th className="px-4 py-2">Unit price</th>
                <th className="px-4 py-2">Unit</th>
                <th className="px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* {projectData.deliverables.map((item, index) => ( */}
                <tr>
                  {/* <td className="px-4 py-2">{index + 1}</td> */}
                  <td className="px-4 py-2">deliverableName</td>
                  <td className="px-4 py-2">NGN unitPrice</td>
                  {/* {item.unitPrice.toFixed(2)} */}
                  <td className="px-4 py-2">unit</td>
                  <td className="px-4 py-2">NGN deliverableAmount</td>
                </tr>
              {/* ))} */}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <div className="flex justify-between">
            <span className="font-semibold">SUBTOTAL:</span>
            <span>NGN subtotal</span>
            {/* <span>NGN {calculateSubtotal().toFixed(2)}</span> */}

          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Platform fee (5%):</span>
            <span>NGN platform fee</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL:</span>
            <span>NGN total</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-6">
          <input
            type="checkbox"
            className="w-5 h-5"
            // onChange={(e) => {
            //   setIsChecked(e.target.checked)
            // }}
          />
          <label htmlFor="terms">
            <p className="text-sm text-[#888888] mt-6">
              This Agreement constitutes the entire agreement among the parties and supersedes all prior negotiations,
              understandings, and agreements relating to the subject matter hereof.
            </p>
          </label>
        </div>

        <div className="mt-6">
          <Button
            size="lg"
            className="w-full py-3 px-12"
            onClick={() => {
              setIsDecisionModalOpen(true)
            }}
            // disabled={!isChecked}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
