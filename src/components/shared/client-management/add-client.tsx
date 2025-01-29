/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import React, { useRef, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Delete, Upload } from '@/components/shared'
import Image from 'next/image'
import projectManagement from '@/lib/assets/project-management'
import queries from '@/services/queries/client-management'

interface IProps {
  onClose: () => void
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Please enter a full name'),
  emailAddress: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter an email address'),
  phoneNumber: Yup.string().required('Please enter a phone number'),
  birthday: Yup.date().required('Please enter your birthday'),
  image: Yup.mixed()
    .required('Please select an image')
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value || !(value instanceof File)) return false;
      const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      return supportedFormats.includes(value.type);
    })
    .test('fileSize', 'File size is too large', (value) => {
      const maxSize = 2 * 1024 * 1024; // 2MB
      return value && value instanceof File && value.size <= maxSize;
    })
});

const initialValues = {
  fullName: '',
  emailAddress: '',
  phoneNumber: '',
  birthday: '',
  image: null
}

type InitialValues = ReturnType<() => typeof initialValues>

export function AddClient ({ onClose }: IProps) {
  const { mutate, isLoading } = queries.create()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onSubmit = (values: InitialValues) => {
    mutate({
      ...values,
      image: values.image
    });
    console.log(values, 'values');
  };

  return (
    <div className="app_auth_login_container relative !overflow-y-auto">
      <Image src={projectManagement.topGradient} alt="top gradient" className="" />

      <div className="app_auth_login_container__upper ">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title mb-5">
              Add new client
            </h3>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(props) => {
                const {
                  values,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  errors,
                  touched
                } = props
                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8">
                      <div className="">
                        <Input
                          name="fullName"
                          id="fullName"
                          placeholder="Client full name"
                          size="xl"
                          value={values.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          name="emailAddress"
                          id="emailAddress"
                          placeholder="Email address"
                          size="xl"
                          value={values.emailAddress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                        <Input
                          name="phoneNumber"
                          id="phoneNumber"
                          placeholder="Phone number"
                          size="xl"
                          value={values.phoneNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="birthday" className="text-sm font-medium text-gray-700">
                          Date of Birth
                        </label>
                        <Input
                          name="birthday"
                          id="birthday"
                          type="date"
                          size="xl"
                          value={values.birthday}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="app_upload_con py-5 px-4 flex flex-col gap-3 items-center">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/png, image/jpeg, image/jpg"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            void props.setFieldValue('image', file);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col"
                      >
                        <div className="pt-5">
                          <Upload />
                        </div>
                        <div className="flex flex-col gap-1 pb-5">
                          <p className="app_upload_con__title">Upload client’s image</p>
                          <p className="app_upload_con__description">
                            PDF, PNG, JPG | 10MB max.
                          </p>
                        </div>
                      </Button>

                    </div>
                    {selectedFile && (
                      <div className="flex items-center justify-between w-full app_upload_con rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            void props.setFieldValue('image', null);
                          }}
                          className="text-gray-500 hover:text-gray-900"
                        >
                          <Delete className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-4 w-fu`">
                    {/* flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5 m */}
                      <Button
                        size="md"
                        type='button'
                        backgroundColor="transparent"
                        color="primary-blue-500"
                        className="w-full hover:bg-transparent app_auth_login__btn border border-[#F1F1F1]"
                        onClick={onClose}
                      >
                        Close
                      </Button>
                      <Button
                        size="md"
                        isLoading={isLoading}
                        type='submit'
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn"
                      >
                        Add client
                      </Button>
                    </div>
                  </form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}
