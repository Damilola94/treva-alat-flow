'use client';
import React, { useState } from 'react';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/shared';
import { Modal } from '@/components/shared/decisionModal';
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';

export default function Page () {
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleCloseModal = () => {
    setIsDecisionModalOpen(false)
  }

  return (
        <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
            <div className="flex justify-center items-center gap-4">
                <ProgressStatus label="Project details" checked />
                <ProgressStatus label="Deliverables" checked />
                <ProgressStatus label="Payment" checked />
                <ProgressStatus label="Agreement" checked />
                <ProgressStatus label="Review" active />
            </div>

            <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto ">
                <Modal {...{ open: isDecisionModalOpen, handleClose: handleCloseModal }}>
                    <div className="app_modal__ctt__mid">
                        <Image src={projectManagement.successLogo} alt='successLogo' className='w-16' unoptimized />
                        <h2 className="app_modal__ctt__mid__h2">Invoice has been sent to client successfully</h2>
                        <p className='text-[#888888]'>Invoice has been sent to make payment.</p>
                    </div>

                    <div className="app_modal__ctt__btm flex gap-4">
                        <Button
                            backgroundColor="transparent"
                            size="xl"
                            color="treva-purple-500"
                            className="w-full border border-[#F1F1F1] flex"
                            onClick={handleCloseModal}

                        >
                            <PlusIcon fill='#7B37F0' />
                            New invoice
                        </Button>
                        <Button
                            backgroundColor="error-500"
                            color='white'
                            size="xl"
                            className="w-full"
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            onClick={handleCloseModal}
                        >
                            Done
                        </Button>
                    </div>
                </Modal>
                <h1 className="text-xl font-bold">Review</h1>
                <p className="text-[#888888] -mt-8">
                    Check and confirm that all the information you’ve added.
                </p>

                <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <p>
                            <span className="font-semibold">Project name:</span> {'Project Name'}
                        </p>
                        <p>
                            <span className="font-semibold">Client name:</span> {'Client Name'}
                        </p>
                        <p>
                            <span className="font-semibold">Client email:</span> {'Client Email'}
                        </p>
                        <p>
                            <span className="font-semibold">Client phone number:</span> {'Client Phone'}
                        </p>
                        <p>
                            <span className="font-semibold">Start date:</span> {'Start Date'}
                        </p>
                        <p>
                            <span className="font-semibold">End date:</span> {'End Date'}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse  text-left">
                        <thead className="bg-[#EFF1FE]">
                            <tr>
                                <th className=" px-4 py-2">S/N</th>
                                <th className=" px-4 py-2">Deliverable</th>
                                <th className=" px-4 py-2">Unit price</th>
                                <th className=" px-4 py-2">Unit</th>
                                <th className=" px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className=" px-4 py-2">1</td>
                                <td className=" px-4 py-2">Deliverable 1</td>
                                <td className=" px-4 py-2">NGN 32,000.00</td>
                                <td className=" px-4 py-2">2</td>
                                <td className=" px-4 py-2">NGN 64,000.00</td>
                            </tr>
                            <tr>
                                <td className=" px-4 py-2">2</td>
                                <td className=" px-4 py-2">Deliverable 2</td>
                                <td className=" px-4 py-2">NGN 32,000.00</td>
                                <td className=" px-4 py-2">2</td>
                                <td className=" px-4 py-2">NGN 64,000.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between">
                        <span className="font-semibold">SUBTOTAL:</span>
                        <span>NGN 64,000.00</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Platform fee (5%):</span>
                        <span>NGN 3,200.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>TOTAL:</span>
                        <span>NGN 67,200.00</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2 px-6">
                    {/* <Checkbox id="terms" /> */}
                    <input type="checkbox" className="w-5 h-5" onChange={(e) => { setIsChecked(e.target.checked); }} />
                    <label htmlFor="terms">
                        <p className="text-sm text-[#888888] mt-6">
                            This Agreement constitutes the entire agreement among the parties and supersedes all prior negotiations, understandings, and agreements relating to the subject matter hereof.
                        </p>
                    </label>
                </div>

                <div className="mt-6">
                    <Button
                        type="button"
                        size="xl"
                        backgroundColor="primary-blue-500"
                        className="w-full py-3 px-12"
                        onClick={() => {
                          console.log('Opening modal...');
                          setIsDecisionModalOpen(true);
                        }}
                        // onClick={() => { setIsDecisionModalOpen(true) }}
                        disabled={!isChecked}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
  );
}
