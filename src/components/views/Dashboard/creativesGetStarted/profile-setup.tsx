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
import { readFileToDataUrl } from '@/utils';
import { useUsers } from '@/hooks/Users';
import { Textarea } from '@/components/ui/textarea';

const validationSchema = Yup.object().shape({
  // startTour: Yup.string().required('Please enter company name')
});

export default function ProfileSetup() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const {
    saveCreativeOnboarding,
    saveOnboardingResponse,
    creativeOnboardingData,
    loading,
  } = useUsers();

  // const initialValues = useMemo(
  //   () => ({
  //     cv: null as File | null, // file upload is manual; we'll preview with photoUrl
  //     portfolio: creativeOnboardingData?.data?.portfolioLink || '',
  //   }),
  //   [creativeOnboardingData?.data],
  // );

  const initialValues = {
    bio: '',
    portfolio: '',
    socialMedial: '',
    professionalHeadshot: null as File | null,
    cv: null as File | null,
    awards: null as File | null,
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        bio: values?.bio,
        portfolio: values?.portfolio,
        socialMedial: values?.socialMedial,
        professionalHeadshot: values?.professionalHeadshot,
        cv: values?.cv,
        awards: values?.awards,
        currentStep: 1,
      };
      saveCreativeOnboarding(payload);
    },
    validationSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    values,
    setFieldValue,
  } = formik;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue('cv', file);

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
    setFieldValue('cv', '');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input field
    }
  };

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(
        routes.creatives.dashboard.getStarted.bvnVerification.path,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveOnboardingResponse]);

  useEffect(() => {
    if (creativeOnboardingData?.data?.cvUrl) {
      setPreviewUrl(creativeOnboardingData?.data.cvUrl);
    }
  }, [creativeOnboardingData?.data?.cvUrl]);

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14 ">
      <div
        className="flex items-center gap-4 overflow-x-auto px-2 md:px-0 
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                snap-x snap-mandatory md:justify-center"
      >
        <ProgressStatus
          label="Profile Setup"
          checked
          className="snap-start shrink-0"
        />
        <ProgressStatus
          label="BVN Verification"
          className="snap-start shrink-0"
        />
        <ProgressStatus
          label="NIN verification"
          className="snap-start shrink-0"
        />
        <ProgressStatus
          label="Address verification"
          className="snap-start shrink-0"
        />
        <ProgressStatus label="Select plan" className="snap-start shrink-0" />
        <ProgressStatus label="Finish" className="snap-start shrink-0" />
      </div>

      {/* <ProgressStatus label="Team setup" /> */}

      <div className="app_get_started_professional_details__form flex flex-col gap-10">
        <h3 className="app_get_started_professional_details__form__title !font-bold">
          Profile Setup
        </h3>
        <div className="">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-8">
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
                    name="portfolio"
                    type="text"
                    label="Portfolio Link (Optional)"
                    placeholder="Enter Link"
                    size="lg"
                    value={values.portfolio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                  <div className="">
                  <Input
                    name="portfolio"
                    type="text"
                    label="Preferred Social Media Profile"
                    placeholder="Enter profile URL"
                    size="lg"
                    value={values.portfolio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                
                <div>
                    <label htmlFor="">Professional headshot</label>
                </div>
                {values.cv || previewUrl ? (
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
                      {typeof values?.cv === 'string'
                        ? values?.cv
                        : values?.cv?.name}
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
                        <p className="app_upload_con__title !font-bold">Upload your professional headshot</p>
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
                    <label htmlFor="">Curriculum Vitae</label>
                </div>
                {values.cv || previewUrl ? (
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
                      {typeof values?.cv === 'string'
                        ? values?.cv
                        : values?.cv?.name}
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
                        <p className="app_upload_con__title !font-bold">Upload your CV</p>
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
                    <label htmlFor="">Awards/Certifications (Optional)</label>
                </div>
                {values.cv || previewUrl ? (
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
                      {typeof values?.cv === 'string'
                        ? values?.cv
                        : values?.cv?.name}
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
                        <p className="app_upload_con__title !font-bold">Upload your awards/certifications</p>
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
              </div>

              <div className="pt-4 flex">
                <div className="">
                  <Button
                    size="xl"
                    backgroundColor="primary-blue-500"
                    className="w-full py-3 px-12"
                    isLoading={loading}
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
