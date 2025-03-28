'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Delete, Upload } from '@/components/shared';
import { Modal } from '@/components/shared/decisionModal';
import Image from 'next/image';
import { type InitialStep4Values } from '@/app/dashboard/project-management/client-project/create/page';
import queries from '@/services/queries/projects';
import { toast } from 'react-toastify';

interface IProps {
  handleNext: (formData: InitialStep4Values) => void
  projectId: string
}

interface Agreement {
  projectAgreementUrl: string
  projectId: string
}

export function ProjectAgreement (props: IProps) {
  const { handleNext, projectId } = props;

  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [agreement, setAgreement] = useState<Agreement[]>([]);
  const [, setAgreementId] = useState<string>('');

  const { mutate: createAgreement } = queries.updateAgreement({
    onSuccess: (response) => {
      if (response?.data?.id) {
        setAgreementId(response.data.id);
      } else {
        console.warn('Project ID not found. Polling...');
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, refetch } = queries.readDeliverables({ projectId }, {
    onSuccess: (newData: any) => {
      setAgreement(newData);
    }
  });

  const { mutate: deleteAgreement } = queries.deleteAgreement({ projectId },
    {
      onSuccess: () => {
        setAgreement(prev => prev.filter(d => d.projectId !== projectId));

        setSelectedFile(null);
        setImagePreview('');

        void refetch();

        setIsDecisionModalOpen(false);
      }
    });

  const handleCloseModal = () => {
    setIsDecisionModalOpen(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setFieldValue('projectAgreementUrl', file);

        if (file.type === 'application/pdf') {
          setImagePreview('');
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      } else {
        toast.error('Unsupported file type. Please upload a PDF, JPEG, PNG, or JPG file.');
        setSelectedFile(null);
        setFieldValue('projectAgreementUrl', null);

        if (e.target) {
          e.target.value = '';
        }
      }
    } else {
      setSelectedFile(null);
      setFieldValue('projectAgreementUrl', null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview('');
  };

  const handleDelete = () => {
    setAgreement(prev => prev.filter(d => d.projectId !== projectId));
    deleteAgreement({ projectId });
    setIsDecisionModalOpen(false);
  };

  const initialValues = {
    projectId,
    projectAgreementUrl: null as File | null

  };

      type InitialValues = ReturnType<() => typeof initialValues>
      const onSubmit = (_values: InitialValues) => {
        createAgreement({ ..._values, projectAgreementUrl: _values.projectAgreementUrl });
      };

      const handleNextStep = () => {
        // if (!selectedFile) {
        //   toast.error('Please upload an agreement file before continuing.');
        //   return;
        // }
        const step4Values = {
          agreement: agreement.map(d => ({
            projectId: d.projectId,
            projectAgreementUrl: d.projectAgreementUrl
          }))
        }
        // const formData = new FormData();
        // formData.append('ProjectId', projectId);
        // formData.append('AgreementFile', selectedFile);

        // console.log(formData, 'formData');

        onSubmit({ projectId, projectAgreementUrl: selectedFile });
        handleNext(step4Values);
      };

      return (
        <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
            <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
                <Modal {...{ open: isDecisionModalOpen, handleClose: handleCloseModal }}>
                    <div className="app_modal__ctt__mid">
                        <h2 className="app_modal__ctt__mid__h2">Are you sure you want to delete this agreement?</h2>
                        <p className='text-[#888888]'>Agreement will be deleted permanently.</p>
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
                            color='white'
                            size="xl"
                            className="w-full"
                            onClick={() => { handleDelete(); }}
                        >
                            Delete
                        </Button>
                    </div>
                </Modal>

                <h3 className="font-bold">Agreement</h3>
                <p className="text-gray-500 -mt-9">Please upload your agreement.</p>

                <div className="w-full border border-gray-300 rounded-lg p-6 text-center">
                    {selectedFile
                      ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {selectedFile.type === 'application/pdf'
                                  ? (
                                    <span className="w-6 h-6 mr-3">📄</span> // Use an icon for PDFs
                                    )
                                  : (
                                    <Image src={imagePreview} alt="Preview" className="w-12 h-12 rounded-md" width={48} height={48} />
                                    )}
                                <div>
                                    <p className="text-sm font-medium">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                </div>
                            </div>
                            <button onClick={() => { setIsDecisionModalOpen(true); }}>
                                <Delete className="cursor-pointer" onClick={handleRemoveFile} />
                            </button>
                        </div>
                        )
                      : (
                        <label className="cursor-pointer hover:underline">
                            <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={(e) => { handleFileChange(e, () => {}); }}
                            />
                            <div className="flex flex-col items-center">
                                <Upload />
                                <p className="mt-2 font-bold">Upload your agreement</p>
                                <p className="text-xs text-gray-500">PDF, PNG, JPG | 10MB max.</p>
                            </div>
                        </label>
                        )}
                </div>
                <div className='flex gap-5'>
                <Button
                    type="submit"
                    size="xl"
                    backgroundColor="primary-blue-500"
                    className="w-full py-3 px-12"
                    onClick={handleNextStep}

                >
                    Save & Continue
                </Button>
                {/* <Button
                    type="button"
                    size="xl"
                    backgroundColor="primary-blue-500"
                    className="w-full py-3 px-12"
                    onClick={handleSkip}

                >
                    Close
                </Button> */}
                </div>

            </div>
        </div>
      );
}
