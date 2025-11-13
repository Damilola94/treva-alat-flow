'use client';
import React, { useState } from 'react';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import { Delete, Upload } from '@/components/shared';
import { Modal } from '@/components/shared/decisionModal';
import Image from 'next/image';

export default function Page() {
  const router = useRouter();
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleCloseModal = () => {
    setIsDecisionModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileUpload = (event: any) => {
    const uploadedFile = event.target.files[0];

    // Validate file type and size
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/gif',
    ];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (uploadedFile && !allowedTypes.includes(uploadedFile.type)) {
      setError('Only PDF, PNG, JPG, or GIF files are allowed.');
      setFile(null);
      return;
    }

    if (uploadedFile && uploadedFile.size > maxSize) {
      setError('File size must not exceed 10 MB.');
      setFile(null);
      return;
    }

    setFile(uploadedFile);
    setError('');
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
  };

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Project details" checked />
        <ProgressStatus label="Deliverables" checked />
        <ProgressStatus label="Payment" checked />
        <ProgressStatus label="Agreement" active />
        <ProgressStatus label="Review" />
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        <Modal
          {...{ open: isDecisionModalOpen, handleClose: handleCloseModal }}
        >
          <div className="app_modal__ctt__mid">
            <h2 className="app_modal__ctt__mid__h2">
              Are you sure you want to delete agreement?
            </h2>
            <p className="text-[#888888]">
              Deliverable will be deleted Permanently
            </p>
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
            <Button
              backgroundColor="error-500"
              color="white"
              size="xl"
              className="w-full"
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onClick={handleCloseModal}
            >
              Delete
            </Button>
          </div>
        </Modal>

        <h3 className=" font-bold">Agreement</h3>
        <p className="text-gray-500 -mt-9">Please upload your agreement.</p>

        <div className="w-full border border-gray-300 rounded-lg p-6 text-center">
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src="/icons/pdf-icon.svg"
                  alt="PDF Icon"
                  className="w-6 h-6 mr-3"
                  unoptimized
                />
                <div>
                  <p className="text-sm font-medium">{file}</p>
                  <p className="text-xs text-gray-500">
                    {(file / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDecisionModalOpen(true);
                }}
              >
                <Delete className="cursor-pointer" onClick={handleRemoveFile} />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer hover:underline">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.gif"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="flex flex-col items-center">
                <Upload />
                <p className="mt-2 font-bold">Upload your agreement</p>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG, GIF | 10MB max.
                </p>
              </div>
            </label>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <Button
          type="submit"
          size="xl"
          backgroundColor="primary-blue-500"
          className="w-full py-3 px-12"
          onClick={() => {
            router.push(
              routes.creatives.dashboard.invoiceAndPayment.review.path,
            );
          }}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
