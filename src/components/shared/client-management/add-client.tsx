/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Delete, Upload } from '@/components/shared';
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';
import { readFileToDataUrl } from '@/utils';
import { useClientManagement } from '@/hooks/Projects';

interface IProps {
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Please enter a full name'),
  emailAddress: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter an email address'),
  phoneNumber: Yup.string()
    .matches(
      /^(0\d{10}|234\d{10})$/,
      'Phone number must start with 0 or 234 and be valid',
    )
    .required('Phone number is required'),
  birthMonth: Yup.string().required('Month is required'),
  birthDay: Yup.string().required('Day is required'),
  avatar: Yup.mixed().optional(),
});

export function AddClient({ onClose }: IProps) {
  const [, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addClient, addClientResponse, loading, refetch } =
    useClientManagement();

  const initialValues = {
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    birthDay: '',
    birthMonth: '',
    avatar: null,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const payload = {
        name: values?.fullName,
        email: values?.emailAddress,
        // phoneNumber: values?.phoneNumber,
        phoneNumber: values.phoneNumber.startsWith('0')
          ? `234${values.phoneNumber.slice(1)}`
          : values.phoneNumber,

        avatar: values?.avatar,
        birthMonth: values.birthMonth,
        birthDay: Number(values.birthDay),
      };
      addClient(payload);
    },
    validationSchema,
  });

  const {
    setFieldValue,
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    dirty,
    isValid,
  } = formik;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue('avatar', file);

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
    <div className="app_auth_login_container relative !overflow-y-auto">
      <Image
        src={projectManagement.topGradient}
        alt="top gradient"
        className=""
      />

      <div className="app_auth_login_container__upper ">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title mb-5">Add new client</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="flex flex-col gap-8"
            >
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
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, '');
                      if (onlyNums.length <= 13) {
                        setFieldValue('phoneNumber', onlyNums);
                      }
                    }}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div>
                  <p>Birthday</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <select
                        name="birthMonth"
                        id="birthMonth"
                        value={values.birthMonth}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className=""
                      >
                        <option value="">MM</option>
                        {[
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
                        ].map((month) => (
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
                    <div>
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
              {values?.avatar && (
                <div className="flex items-center justify-between w-full app_upload_con rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(values?.avatar as any)?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ((values?.avatar as any)?.size / 1024 / 1024).toFixed(
                            2,
                          )
                        }{' '}
                        MB
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
                  disabled={!(isValid && dirty)}
                >
                  Add client
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
