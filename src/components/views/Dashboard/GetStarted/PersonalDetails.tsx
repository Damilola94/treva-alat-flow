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
import { Textarea } from '@/components/ui/textarea';

const validationSchema = Yup.object().shape({
  bio: Yup.string()
    .max(500, 'Bio cannot be more than 500 characters')
    .nullable(),
  photo: Yup.mixed().nullable(), // optional
  state: Yup.string()
    .typeError('State is required')
    .required('State is required'),
  city: Yup.string().typeError('City is required').required('City is required'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  websiteUrl: Yup.string()
    .url('Must be a valid website URL')
    .nullable()
    .notRequired(),
  socialMediaUrl: Yup.string()
    .url('Must be a valid social media URL')
    .nullable()
    .notRequired(),
});

export default function PersonalDetails() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [state, setState] = useState('');

  const { stateData } = useStates({ country: 'Nigeria' });
  const { citiesData } = useCities({ state: state });
  const { saveClientOnboarding, saveOnboardingResponse, userOnboardingData } =
    useUsers();

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
    bio: '',
    photo: null as File | null,
    address: '',
    websiteUrl: '',
    city: '',
    state: '',
    socialMediaUrl: '',
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // this is important
    onSubmit: (values) => {
      const payload = {
        bio: values?.bio,
        photo: values?.photo,
        stateId: values?.state,
        cityId: values?.city,
        address: values?.address,
        websiteUrl: values?.websiteUrl,
        socialMediaUrl: values?.socialMediaUrl,
        currentStep: 1,
      };
      saveClientOnboarding(payload);
      // router.push(routes.client.dashboard.getStarted.bvnVerification.path);
    },
    validationSchema,
  });

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.client.dashboard.getStarted.bvnVerification.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveOnboardingResponse]);

  useEffect(() => {
    if (userOnboardingData?.data?.photoUrl) {
      setPreviewUrl(userOnboardingData?.data.photoUrl);
    }
  }, [userOnboardingData?.data?.photoUrl]);

  useEffect(() => {
    if (userOnboardingData?.data?.stateId) {
      const state =
        stateOptions?.find(
          (x) => x?.value === userOnboardingData?.data?.stateId,
        )?.label || '';
      setState(state);
    }
  }, [userOnboardingData?.data?.stateId]);

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    values,
    isValid,
    dirty,
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
      router.push(routes.client.dashboard.getStarted.bvnVerification.path);
    }
  }, [router, saveOnboardingResponse]);

  // Update Formik values when userOnboardingData changes
  useEffect(() => {
    if (userOnboardingData?.data) {
      formik.setFieldValue('bio', userOnboardingData.data.bio || '');
      formik.setFieldValue('address', userOnboardingData.data.address || '');
      formik.setFieldValue(
        'websiteUrl',
        userOnboardingData.data.websiteUrl || '',
      );
      formik.setFieldValue('city', userOnboardingData.data.cityId || '');
      formik.setFieldValue('state', userOnboardingData.data.stateId || '');
      formik.setFieldValue(
        'socialMediaUrl',
        userOnboardingData.data.socialMediaUrl || '',
      );
    }

    if (userOnboardingData?.data?.stateId) {
      const state =
        stateOptions?.find(
          (x) => x?.value === userOnboardingData?.data?.stateId,
        )?.label || '';
      setState(state);
    }
  }, [userOnboardingData?.data]);

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Profile Setup" checked />
        <ProgressStatus label="BVN Verification" />
        <ProgressStatus label="NIN Verification" />
        <ProgressStatus label="Address Verification" />
        <ProgressStatus label="Finish" />
        {/* <ProgressStatus label="Team setup" /> */}
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10">
        <h3 className="app_get_started_professional_details__form__title">
          Profile Setup
        </h3>
        <div className="">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-8">
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept=".pdf,.png,.jpg,.jpeg,.gif"
                  onChange={handleFileChange}
                />

                <div className="">
                  <Textarea
                    name="bio"
                    id="bio"
                    placeholder="Enter your bio"
                    label="Bio (150 words max)"
                    value={values.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    wordCount={{
                      limit: 1000,
                      current: values?.bio?.length,
                    }}
                  />
                </div>

                <div className="">
                  <Input
                    name="socialMediaUrl"
                    type="text"
                    id="social"
                    label="Preferred Social Media Profile"
                    placeholder="Enter profile URL"
                    size="lg"
                    value={values.socialMediaUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div>
                  <SelectField
                    name="state"
                    label="State"
                    options={stateOptions}
                    placeholder="Select State"
                    onChange={(option) => {
                      setFieldValue('state', option.value, true);
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
                      setFieldValue('city', option.value, true);
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
                    name="websiteUrl"
                    type="text"
                    id="website"
                    label="Website (Optional)"
                    placeholder="Enter website"
                    size="lg"
                    value={values.websiteUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {values.photo || previewUrl ? (
                  <div>
                    <p className="app_input_con__lbl mb-5">Profile Photo</p>
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
                        {typeof values?.photo === 'string'
                          ? values?.photo
                          : values?.photo?.name}
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-red-500 underline text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="app_input_con__lbl mb-5">Profile Photo</p>
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
                  </div>
                )}
              </div>

              <div className="pt-4 flex">
                <div className="">
                  <Button
                    size="xl"
                    backgroundColor="primary-blue-500"
                    className="w-full py-3 px-12"
                    disabled={!(isValid && dirty)}
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
