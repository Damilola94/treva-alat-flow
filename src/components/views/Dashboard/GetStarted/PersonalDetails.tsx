'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SelectField, Upload } from '@/components/shared';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import { useCities, useStates, useUsers } from '@/hooks/Users';
import { readFileToDataUrl } from '@/utils';

const validationSchema = Yup.object().shape({
  // startTour: Yup.string().required('Please enter company name')
});

export default function PersonalDetails() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [state, setState] = useState('');

  const { stateData } = useStates({ country: 'Nigeria' });
  const { citiesData } = useCities({ state: state });
  const { saveClientOnboarding, saveOnboardingResponse } = useUsers();

  const stateOptions = useMemo(() => {
    return (
      stateData?.data?.map((state) => ({
        label: state.name ?? '',
        value: state.id ?? '',
      })) ?? []
    );
  }, [stateData]);

  const citiesOptions = useMemo(() => {
    return (
      citiesData?.data?.map((state) => ({
        label: state.name ?? '',
        value: state.id ?? '',
      })) ?? []
    );
  }, [citiesData]);

  const initialValues = {
    photo: null as File | null,
    address: '',
    website: '',
    city: '',
    state: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const payload = {
        photo: values?.photo,
        stateId: values?.state,
        cityId: values?.city,
        address: values?.address,
        websiteUrl: values?.website,
        currentStep: 1,
      };
      saveClientOnboarding(payload);
      // router.push(routes.client.dashboard.getStarted.socialMediaDetails.path);
    },
    validationSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    values,
  } = formik;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue('photo', file);

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
    setFieldValue('photo', '');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input field
    }
  };

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.client.dashboard.getStarted.socialMediaDetails.path);
    }
  }, [router, saveOnboardingResponse]);

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Your details" checked />
        <ProgressStatus label="Social media details" />
        <ProgressStatus label="Bio" />
        <ProgressStatus label="Finish" />
        {/* <ProgressStatus label="Team setup" /> */}
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10">
        <h3 className="app_get_started_professional_details__form__title">
          Professional details
        </h3>
        <div className="">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-8">
                {values.photo ? (
                  <div className="flex flex-col items-center gap-2 border p-4 rounded-md bg-gray-50">
                    {previewUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    )}
                    <p className="text-sm text-gray-700">
                      {typeof values.photo === 'string'
                        ? values.photo
                        : values.photo.name}
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef?.current?.click()}
                    className="border border-dashed border-gray-300 rounded-md w-full"
                  >
                    <div className="app_upload_con py-5 px-4 flex flex-col gap-3 items-center">
                      <Upload />
                      <div className="flex flex-col gap-1">
                        <p className="app_upload_con__title">Your photo</p>
                        <p className="app_upload_con__description">
                          PDF, PNG, JPG, GIF | 10MB max.
                        </p>
                      </div>
                    </div>
                  </button>
                )}
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept=".pdf,.png,.jpg,.jpeg,.gif"
                  onChange={handleFileChange}
                />

                <div>
                  <SelectField
                    name="state"
                    label="State"
                    options={stateOptions}
                    placeholder="Select State"
                    onChange={(option) => {
                      setFieldValue('state', option.value);
                      setState(option?.label);
                    }}
                    value={values?.state}
                  />
                </div>

                <div>
                  <SelectField
                    name="city"
                    label="LGA"
                    options={citiesOptions}
                    placeholder="Select LGA"
                    onChange={(option) => {
                      setFieldValue('city', option.value);
                    }}
                    value={values?.city}
                  />
                </div>

                <div className="">
                  <Input
                    name="address"
                    type="text"
                    id="address"
                    label="Enter Address"
                    placeholder="House No./Street"
                    size="lg"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="">
                  <Input
                    name="website"
                    type="text"
                    id="website"
                    label="Website (Optional)"
                    placeholder="Enter website"
                    size="lg"
                    value={values.website}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="pt-4 flex">
                <div className="">
                  <Button
                    size="xl"
                    backgroundColor="primary-blue-500"
                    className="w-full py-3 px-12"
                  >
                    Save & Continue
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
