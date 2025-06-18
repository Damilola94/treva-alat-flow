/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Delete, Upload } from '@/components/shared';
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';
import { dayJs, readFileToDataUrl } from '@/utils';
import { useClientManagement } from '@/hooks/Projects';

export interface IClient {
  avatarUrl: string;
  birthMonth: number;
  birthday: number;
  clientUserId: string;
  email: string;
  name: string;
  phoneNumber: string;
}

interface IProps {
  id: string;
  item: IClient | null;
  handleClick: () => void;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().optional(),
  emailAddress: Yup.string()
    .email('Please enter a valid email address')
    .optional(),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{11}$/, 'Phone number must be exactly 11 digits')
    .optional(),
  birthday: Yup.date().optional(),
});

export function EditClient({ id, onClose, item }: IProps) {
  const { updateClient, addClientResponse, loading, refetch } =
    useClientManagement();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setPreviewUrl] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialValues = {
    fullName: item?.name ?? '',
    emailAddress: item?.email ?? '',
    phoneNumber: item?.phoneNumber ?? '',
    birthday: '',
    avatar: item?.avatarUrl ?? null,
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = {
        name: values?.fullName,
        email: values?.emailAddress,
        phoneNumber: values?.phoneNumber,
        birthMonth: dayJs(values?.birthday).format('MMMM'),
        birthDay: dayJs(values?.birthday).date(),
        clientUserId: id,
      };
      console.log(formData);
      updateClient(formData);
    },
    validationSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    setFieldValue,
  } = formik;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue('avatar', file);
      setSelectedFile(file);

      // generate preview URL for image files
      if (file.type.startsWith('image/')) {
        const fileData = (await readFileToDataUrl(file)) as string;
        setPreviewUrl(fileData);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFieldValue('avatar', '');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input field
    }
  };

  useEffect(() => {
    if (addClientResponse?.isSuccess) {
      onClose();
      refetch && refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addClientResponse]);

  return (
    <div className="app_auth_login_container relative">
      <Image
        src={projectManagement.topGradient}
        alt="top gradient"
        className="w-full"
        unoptimized
      />
      <div className="app_auth_login_container__upper !-mt-80">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title mb-5">Edit client</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-8">
                <div className="">
                  <Input
                    name="fullName"
                    type="text"
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
                    type="email"
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
                    type="text"
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
                  <label
                    htmlFor="birthday"
                    className="text-sm font-medium text-gray-700"
                  >
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
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg, image/jpg"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {errors.avatar && touched.avatar && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.avatar}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col"
                >
                  <div className="pt-5">
                    <Upload />
                  </div>
                  <div className="flex flex-col gap-1 pb-5">
                    <p className="app_upload_con__title">
                      Upload client’s image
                    </p>
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
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="flex gap-4 w-full">
                {/* flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5 m */}
                <Button
                  size="md"
                  type="button"
                  backgroundColor="transparent"
                  color="primary-blue-500"
                  className="w-full hover:bg-transparent app_auth_login__btn border border-[#F1F1F1]"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  size="md"
                  isLoading={loading}
                  type="submit"
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn"
                >
                  Update client
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
