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
import { readFileToDataUrl } from '@/utils';
import { useClientManagement } from '@/hooks/Projects';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export interface IClient {
  avatarUrl: File | string | null;
  birthMonth: string;
  birthDay: number;
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
    .matches(
      /^(0\d{10}|234\d{10})$/,
      'Phone number must start with 0 or 234 and be valid',
    )
    .optional(),
  birthMonth: Yup.string().required('Month is required'),
  birthDay:  Yup.number().required('Day is required').min(1).max(31),
});

export function EditClient({ id, onClose, item }: IProps) {
  const { updateClient, addClientResponse, loading, refetch } =
    useClientManagement();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialValues = {
    fullName: item?.name ?? '',
    emailAddress: item?.email ?? '',
    phoneNumber: item?.phoneNumber ?? '',
    birthDay: item?.birthDay ?? '',
    birthMonth:
      typeof item?.birthMonth === 'number' &&
      item.birthMonth >= 1 &&
      item.birthMonth <= 12
        ? months[item.birthMonth - 1]
        : '',
    avatar: item?.avatarUrl ?? null,
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = {
        name: values?.fullName,
        email: values?.emailAddress,
        phoneNumber: values.phoneNumber.startsWith('0')
          ? `234${values.phoneNumber.slice(1)}`
          : values.phoneNumber,
        birthMonth: values.birthMonth,
        birthDay: Number(values.birthDay),
        clientUserId: id,
        avatarUrl: values.avatar instanceof File ? values.avatar : null,
      };
      if (values.avatar instanceof File) {
    values.avatar = values.avatar;
  }
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

      if (file.type.startsWith('image/')) {
        const fileData = (await readFileToDataUrl(file)) as string;
        setPreviewUrl(fileData);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFieldValue('avatar', null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
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
      <div className="flex flex-col h-full overflow-y-auto p-2 !-mt-20">
        {/* app_auth_login_container__upper !-mt-80 */}
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
                <div>
                  <p>Birthday</p>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <select
                        name="birthMonth"
                        id="birthMonth"
                        value={values.birthMonth}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">MM</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      {errors.birthMonth && touched.birthMonth && (
                        <div className="text-red-500 text-xs">
                          {errors.birthMonth}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        name="birthDay"
                        type="number"
                        min={1}
                        max={31}
                        placeholder="DD"
                        size="xl"
                        value={values.birthDay}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="app_upload_con py-5 px-4 flex flex-col gap-3 items-center">
                {(previewUrl || item?.avatarUrl) && (
                  <div className="flex justify-center">
                    <Image
                      // src={previewUrl ?? item!.avatarUrl}
                      src={previewUrl ?? (item!.avatarUrl as string)}
                      alt="Client Avatar"
                      // width={120}
                      // height={120}
                      width={128}
                      height={128}
                      // className="rounded-full object-cover border"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

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
                  // className="flex flex-col"
                  className="flex flex-col items-center justify-center w-full h-24 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-md"
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

              <div className="flex gap-4 w-full mt-auto pt-4">
                {/* className="flex gap-4 w-full" */}
                {/* flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5 m */}
                <Button
                  size="md"
                  type="button"
                  backgroundColor="transparent"
                  color="primary-blue-500"
                  className="w-full "
                  variant="outline"
                  // hover:bg-transparent app_auth_login__btn border border-[#F1F1F1]
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
