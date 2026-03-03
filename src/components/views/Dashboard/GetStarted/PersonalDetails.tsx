'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from '@/components/shared';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import { useUsers } from '@/hooks/Users';
import { readFileToDataUrl } from '@/utils';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const validationSchema = Yup.object().shape({
  bio: Yup.string()
    .max(500, 'Bio cannot be more than 500 characters')
    .nullable(),
  photo: Yup.mixed().nullable(), // optional
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

  const { saveClientOnboarding, saveOnboardingResponse, userOnboardingData, loading } =
    useUsers();
  const onboarding = userOnboardingData?.data;

  const initialValues = {
    bio: onboarding?.bio || '',
    photo: onboarding?.photoUrl || null,
    websiteUrl: onboarding?.websiteUrl || '',
    socialMediaUrl: onboarding?.socialMediaUrl || '',
    firstName: onboarding?.firstName ?? '',
    lastName: onboarding?.lastName ?? '',
    phoneNumber: onboarding?.phoneNumber || '',
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        bio: values?.bio,
        professionalHeadshot: values?.photo,
        websiteUrl: values?.websiteUrl,
        socialMediaUrl: values?.socialMediaUrl,
        firstName: values?.firstName,
        lastName: values?.lastName,
        phoneNumber: values?.phoneNumber,
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
    if (userOnboardingData?.data?.profilePicture) {
      setPreviewUrl(userOnboardingData?.data.profilePicture);
    }
  }, [userOnboardingData?.data?.profilePicture]);

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
      formik.setFieldValue(
        'websiteUrl',
        userOnboardingData.data.websiteUrl || '',
      );
      formik.setFieldValue(
        'socialMediaUrl',
        userOnboardingData.data.socialMediaUrl || '',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOnboardingData?.data]);

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Profile Setup" checked />
        <ProgressStatus label="ID Verification" />
        {/* <ProgressStatus label="NIN Verification" /> */}
        <ProgressStatus label="Address Verification" />
        <ProgressStatus label="Finish" />
        {/* <ProgressStatus label="Team setup" /> */}
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !mb-28 !max-w-[600px]">
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

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row w-full sm:items-center justify-between gap-6">
                    <div className="w-full">
                      <Input
                        name="firstName"
                        label="First Name"
                        type="text"
                        placeholder="First Name"
                        size="lg"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="w-full">
                      <Input
                        name="lastName"
                        type="text"
                        label="Last Name"
                        placeholder="Last Name"
                        size="lg"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <Input
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    placeholder="(+234)"
                    size="lg"
                    value={values.phoneNumber}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '');
                      setFieldValue('phoneNumber', digitsOnly);
                    }}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

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

                <div className="flex  flex-col sm:flex-row w-full sm:items-center justify-between gap-6">
                  <div className="w-full">
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

                  <div className="w-full">
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
                      {/* <p className="text-sm text-gray-700">
                        {typeof values?.photo === 'string'
                          ? values?.photo
                          : values?.photo?.name}
                      </p> */}
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
              <hr className="mt-6 mb-2" />

              <div className="pt-4 flex justify-end">
                <div className="">
                  <Button
                    size="xl"
                    backgroundColor="primary-blue-500"
                    className="w-full py-3 px-12 flex items-center justify-center gap-2"
                    disabled={!(isValid && dirty) || loading}
                  >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    <span>Save & Continue</span>
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
