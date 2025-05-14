/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Delete, Upload } from '@/components/shared';
import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';
import { toast } from 'react-toastify';
import clientQueries from '@/services/queries/client-management';

interface IProps {
  id: string;
  item: string;
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

const initialValues = {
  fullName: '',
  emailAddress: '',
  phoneNumber: '',
  birthday: '',
  image: null as File | null,
};

type InitialValues = ReturnType<() => typeof initialValues>;

export function EditClient({ id, onClose }: IProps) {
  const clientId = id;
  const { data, refetch } = clientQueries.readone({ clientId });
  const { mutate, isLoading } = clientQueries.update({
    onSuccess: () => {
      void refetch();
      onClose();
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imagePreview, setImagePreview] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (data) {
      /* empty */
    }
  }, [data, clientId]);

  const onSubmit = (_values: InitialValues) => {
    const formData: {
      id: string;
      fullName: string;
      emailAddress: string;
      phoneNumber: string;
      birthday: string;
      image?: File | null;
    } = {
      id: clientId,
      fullName: _values.fullName,
      emailAddress: _values.emailAddress,
      phoneNumber: _values.phoneNumber,
      birthday: _values.birthday,
      image: _values.image,
    };

    mutate(formData);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setFieldValue('image', file);

        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(
          'Unsupported file type. Please upload a JPEG, PNG, or JPG file.',
        );

        setSelectedFile(null);
        setFieldValue('image', null);

        if (e.target) {
          e.target.value = '';
        }
      }
    } else {
      setSelectedFile(null);
      setFieldValue('image', null);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app_auth_login_container relative">
      <Image
        src={projectManagement.topGradient}
        alt="top gradient"
        className="w-full"
      />
      <div className="app_auth_login_container__upper !-mt-80">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title mb-5">Edit client</h3>
            <Formik
              enableReinitialize
              initialValues={{
                ...initialValues,
                fullName: data?.fullName ?? '',
                emailAddress: data?.emailAddress ?? '',
                phoneNumber: String(data?.phoneNumber ?? ''),
                birthday: data.birthday ? data.birthday.split('T')[0] : '',
                image: data?.image ? null : null,
              }}
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
                  touched,
                } = props;
                return (
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
                        id="image"
                        name="image"
                        accept="image/png, image/jpeg, image/jpg"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          handleFileChange(e, props.setFieldValue);
                        }}
                      />
                      {errors.image && touched.image && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.image}
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
                        isLoading={isLoading}
                        type="submit"
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn"
                      >
                        Update client
                      </Button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
