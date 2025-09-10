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
  bio: Yup.string()
    .max(500, 'Bio cannot be more than 500 characters')
    .nullable(),
  professionalHeadshot: Yup.mixed().nullable(),
  socialMediaUrl: Yup.string()
    .url('Must be a valid social media URL')
    .nullable()
    .notRequired(),
  cv: Yup.mixed().nullable(),
  awardsAndCertifications: Yup.mixed().nullable(),
  portfolioLink: Yup.string()
    .url('Must be a valid portfolio URL')
    .nullable()
    .notRequired(),
});

export default function ProfileSetup() {
  const [previewUrl, setPreviewUrl] = useState<Record<string, string | null>>({
    professionalHeadshot: null,
    cv: null,
    awardsAndCertifications: null,
  });
  const router = useRouter();

  const {
    saveCreativeOnboarding,
    saveOnboardingResponse,
    creativeOnboardingData,
    loading,
  } = useUsers();

  const initialValues = {
    bio: '',
    portfolioLink: '',
    socialMediaUrl: '',
    professionalHeadshot: null as File | null,
    cv: null as File | null,
    awardsAndCertifications: null as File | null,
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        bio: values?.bio,
        professionalHeadshot: values?.professionalHeadshot,
        portfolioLink: values?.portfolioLink,
        socialMedialUrl: values?.socialMediaUrl,
        cv: values?.cv,
        awardsAndCertifications: values?.awardsAndCertifications,
        currentStep: 1,
      };
      saveCreativeOnboarding(payload);
    },
    validationSchema,
  });

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.creatives.dashboard.getStarted.bvnVerification.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveOnboardingResponse]);

  useEffect(() => {
    const url = creativeOnboardingData?.data?.professionalHeadshotUrl ?? null;
    if (url) {
      setPreviewUrl((p) => ({ ...p, professionalHeadshot: url }));
    }
  }, [creativeOnboardingData?.data?.professionalHeadshotUrl]);

  useEffect(() => {
    const url = creativeOnboardingData?.data?.cvUrl ?? null;
    if (url) {
      setPreviewUrl((p) => ({ ...p, cv: url }));
    }
  }, [creativeOnboardingData?.data?.cvUrl]);

  useEffect(() => {
    const url =
      creativeOnboardingData?.data?.awardsAndCertificationsUrl ?? null;
    if (url) {
      setPreviewUrl((p) => ({ ...p, awardsAndCertifications: url }));
    }
  }, [creativeOnboardingData?.data?.awardsAndCertificationsUrl]);

  const headshotRef = useRef<HTMLInputElement | null>(null);
  const cvRef = useRef<HTMLInputElement | null>(null);
  const awardsRef = useRef<HTMLInputElement | null>(null);

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    values,
    isValid,
    dirty,
    setFieldValue,
  } = formik;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'professionalHeadshot' | 'cv' | 'awardsAndCertifications',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFieldValue(field, file);

    // preview only for images
    if (file.type.startsWith('image/')) {
      const dataUrl = (await readFileToDataUrl(file)) as string;
      setPreviewUrl((p) => ({ ...p, [field]: dataUrl }));
    } else {
      setPreviewUrl((p) => ({ ...p, [field]: null }));
    }
  };

  const handleRemoveFile = (
    field: 'professionalHeadshot' | 'cv' | 'awardsAndCertifications',
    ref: React.RefObject<HTMLInputElement>,
  ) => {
    setFieldValue(field, null);
    setPreviewUrl((p) => ({ ...p, [field]: null }));
    if (ref.current) ref.current.value = '';
  };

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.creatives.dashboard.getStarted.bvnVerification.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveOnboardingResponse]);

  useEffect(() => {
    if (creativeOnboardingData?.data) {
      formik.setFieldValue('bio', creativeOnboardingData.data.bio || '');
      formik.setFieldValue(
        'portfolio',
        creativeOnboardingData.data.portfolioLink || '',
      );
      formik.setFieldValue('cv', creativeOnboardingData.data.cvUrl || '');
      formik.setFieldValue(
        'socialMediaUrl',
        creativeOnboardingData.data.scocialMediaUrl || '',
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creativeOnboardingData?.data]);

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
                    name="portfolioLink"
                    type="text"
                    label="Portfolio Link (Optional)"
                    placeholder="Enter portfolio Link"
                    size="lg"
                    value={values.portfolioLink}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="">
                  <Input
                    name="socialMediaUrl"
                    type="text"
                    id='social'
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

                {values.professionalHeadshot ||
                previewUrl.professionalHeadshot ? (
                  <div>
                    <p className="app_input_con__lbl mb-5">
                      Professional headshot
                    </p>
                    <div className="flex flex-col items-center gap-2 border p-4 rounded-md bg-gray-50">
                      {previewUrl.professionalHeadshot && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl.professionalHeadshot}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      )}
                      <p className="text-sm text-gray-700">
                        {typeof values.professionalHeadshot === 'string'
                          ? values.professionalHeadshot
                          : values.professionalHeadshot?.name}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFile('professionalHeadshot', headshotRef)
                        }
                        className="text-red-500 underline text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="app_input_con__lbl mb-5">
                      Professional headshot
                    </p>
                    <button
                      type="button"
                      onClick={() => headshotRef.current?.click()}
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
                <input
                  ref={headshotRef}
                  className="hidden"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'professionalHeadshot')}
                />

                <div>
                  <label htmlFor="">Curriculum Vitae</label>
                </div>
                {values.cv ? (
                  <div className="flex flex-col items-center gap-2 border p-4 rounded-md bg-gray-50">
                    <p className="text-sm text-gray-700">
                      {typeof values.cv === 'string'
                        ? values.cv
                        : values.cv?.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('cv', cvRef)}
                      className="text-red-500 underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => cvRef.current?.click()}
                    className="border border-dashed border-gray-300 rounded-md w-full"
                  >
                    <div className="app_upload_con py-5 px-4 flex flex-col gap-3 items-center">
                      <Upload />
                      <div className="flex flex-col gap-1">
                        <p className="app_upload_con__title !font-bold">
                          Upload your CV
                        </p>
                        <p className="app_upload_con__description">
                          PDF, PNG, JPG, GIF | 10MB max.
                        </p>
                      </div>
                    </div>
                  </button>
                )}
                <input
                  ref={cvRef}
                  className="hidden"
                  type="file"
                 accept=".png,.doc,.pdf,.gif,.jpg,.jpeg,image/png,image/jpeg,image/gif,application/pdf,application/msword"
                  onChange={(e) => handleFileChange(e, 'cv')}
                />

                <div>
                  <label htmlFor="">Awards/Certifications (Optional)</label>
                </div>
                {values.awardsAndCertifications ||
                previewUrl.awardsAndCertifications ? (
                  <div className="flex flex-col items-center gap-2 border p-4 rounded-md bg-gray-50">
                    {previewUrl.awardsAndCertifications && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl.awardsAndCertifications}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    )}
                    <p className="text-sm text-gray-700">
                      {typeof values.awardsAndCertifications === 'string'
                        ? values.awardsAndCertifications
                        : values.awardsAndCertifications?.name}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFile('awardsAndCertifications', awardsRef)
                      }
                      className="text-red-500 underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => awardsRef.current?.click()}
                    className="border border-dashed border-gray-300 rounded-md w-full"
                  >
                    <div className="app_upload_con py-5 px-4 flex flex-col gap-3 items-center">
                      <Upload />
                      <div className="flex flex-col gap-1">
                        <p className="app_upload_con__title !font-bold">
                          Upload your awards/certifications
                        </p>
                        <p className="app_upload_con__description">
                          PDF, PNG, JPG, GIF | 10MB max.
                        </p>
                      </div>
                    </div>
                  </button>
                )}
                <input
                  ref={awardsRef}
                  className="hidden"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
                  onChange={(e) =>
                    handleFileChange(e, 'awardsAndCertifications')
                  }
                />
              </div>

              <div className="pt-4 flex">
                <div className="">
                  <Button
                    size="xl"
                    backgroundColor="primary-blue-500"
                    className="w-full py-3 px-12"
                    isLoading={loading}
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
