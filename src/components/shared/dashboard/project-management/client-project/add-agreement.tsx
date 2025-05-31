"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CenterModal, Delete, Upload } from "@/components/shared"
import Image from "next/image"
import type { InitialStep5Values } from "@/app/creatives/dashboard/project-management/client-project/create/page"
import { toast } from "react-toastify"
import { errorToast, successToast, useCreateAgreementMutation, useDeleteAgreementMutation } from "@/services"
import { useAppDispatch } from "@/store"
import { storeValues, nextStep } from "@/store/slices/project"

interface IProps {
  handleNext: (formData: InitialStep5Values) => void
  projectId: string
}

interface Agreement {
  documentUrl: string
  // projectId: string
  agreementId: string
}

export function ProjectAgreement(props: IProps) {
  const { handleNext, projectId } = props
  const dispatch = useAppDispatch()

  const [createAgreement, { isLoading }] = useCreateAgreementMutation()
  const [deleteAgreement] = useDeleteAgreementMutation()

  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [, setAgreement] = useState<Agreement[]>([])

  const handleDelete = async () => {
    setAgreement((prev) => prev.filter((d) => d.agreementId !== projectId))
    try {
      await deleteAgreement({
        projectId,
        agreementId: "",
      }).unwrap()
      toast.success("Agreement deleted successfully")
      handleRemoveFile()
    } catch (error) {
      toast.error("Failed to delete agreement")
    }
    setIsDecisionModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsDecisionModalOpen(false)
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFieldValue?: (field: string, value: any) => void,
  ) => {
    const file = e.target.files?.[0]

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]

      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file)

        // Store file info in Redux
        dispatch(
          storeValues({
            agreementFile: file.name,
            agreementType: file.type,
          }),
        )

        if (setFieldValue) {
          setFieldValue("documentUrl", file)
        }

        if (file.type === "application/pdf") {
          setImagePreview("")
        } else {
          const reader = new FileReader()
          reader.onload = () => {
            setImagePreview(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
      } else {
        toast.error("Unsupported file type. Please upload a PDF, JPEG, PNG, or JPG file.")
        setSelectedFile(null)
        if (setFieldValue) {
          setFieldValue("documentUrl", null)
        }

        if (e.target) {
          e.target.value = ""
        }
      }
    } else {
      setSelectedFile(null)
      if (setFieldValue) {
        setFieldValue("documentUrl", null)
      }
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setImagePreview("")

    // Clear from Redux
    dispatch(
      storeValues({
        agreementFile: "",
        agreementType: "",
      }),
    )
  }

 const onSubmit = async (values: { document: File | null }) => {
  if (!values.document) {
    toast.error("Please upload a valid file")
    return false
  }

  try {
    const response = await createAgreement({ projectId, document: values.document,}).unwrap()
    dispatch( storeValues({agreementUploaded: true,}))
    setAgreement([
      {
        documentUrl: URL.createObjectURL(values.document),
        agreementId: "",
      },
    ])

    successToast(response?.message || "Agreement uploaded successfully")
    return true
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorToast(error?.data?.message || "Something went wrong")
    return false
  }
}

const handleNextStep = async () => {
  if (!projectId || projectId.trim() === "") {
    toast.error("Project ID is missing. Please go back to step 1 to create a project first.")
    return
  }

  if (!selectedFile) {
    toast.error("Please upload an agreement before continuing.")
    return
  }

  const values = {
    document: selectedFile,
  }

  await onSubmit(values)

  const step5Values: InitialStep5Values = {
    agreement: [
      {
        documentUrl: imagePreview || URL.createObjectURL(selectedFile),
      },
    ],
  }

  dispatch(storeValues(step5Values))
  dispatch(nextStep())

  handleNext(step5Values)
}


  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        {/* Delete Confirmation Modal */}
        <CenterModal
          headerImageType={3}
          isOpen={isDecisionModalOpen}
          onClose={handleCloseModal}
          showFooter
          footerChildren={
            <div className="w-full flex items-center gap-5">
              <button
                className="border p-3 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="border p-3 bg-[#F9403A] rounded-full w-full border-[#F1F1F1] text-white"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="font-semibold">Are you sure you want to delete this agreement?</p>
            <p>It will be permanently removed.</p>
          </div>
        </CenterModal>

        <h3 className="font-bold">Agreement</h3>
        <p className="text-gray-500 -mt-9">Please upload your agreement.</p>

        <div className="w-full border border-gray-300 rounded-lg p-6 text-center">
          {selectedFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {selectedFile.type === "application/pdf" ? (
                  <span className="w-6 h-6 mr-3">📄</span>
                ) : (
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-12 h-12 rounded-md"
                    width={48}
                    height={48}
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
              <Delete className="cursor-pointer" onClick={() => setIsDecisionModalOpen(true)} />
            </div>
          ) : (
            <label className="cursor-pointer hover:underline">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => handleFileChange(e)}
              />
              <div className="flex flex-col items-center">
                <Upload />
                <p className="mt-2 font-bold">Upload your agreement</p>
                <p className="text-xs text-gray-500">PDF, PNG, JPG | 10MB max.</p>
              </div>
            </label>
          )}
        </div>

        <div className="flex gap-5">
          <Button
            type="submit"
            size="xl"
            backgroundColor="primary-blue-500"
            className="w-full py-3 px-12"
            onClick={handleNextStep}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
