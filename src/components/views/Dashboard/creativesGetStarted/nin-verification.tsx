'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera } from '@/components/shared';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import { useUsers } from '@/hooks/Users';

const validationSchema = Yup.object().shape({
  // startTour: Yup.string().required('Please enter company name')
});

export default function NinVerification() {
  const [, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const {
    saveCreativeOnboarding,
    saveOnboardingResponse,
    creativeOnboardingData,
    loading,
  } = useUsers();

  const initialValues = useMemo(
    () => ({
      cv: null as File | null, // file upload is manual; we'll preview with photoUrl
      portfolio: creativeOnboardingData?.data?.portfolioLink || '',
    }),
    [creativeOnboardingData?.data],
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        cv: values?.cv,
        portfolioLink: values?.portfolio,
        currentStep: 3,
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
  } = formik;


  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.creatives.dashboard.getStarted.addressVerification.path);
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
        <ProgressStatus label="Profile Setup" className="snap-start shrink-0" />
        <ProgressStatus
          label="BVN Verification"
          className="snap-start shrink-0"
        />
        <ProgressStatus
          label="NIN verification"
          checked
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
          NIN Verification
        </h3>
        <div className="">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-8">
                <div className="">
                  <Input
                    name="portfolio"
                    type="text"
                    label="NIN validation"
                    placeholder=""
                    size="lg"
                    value={values.portfolio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div>
                  <h2 className='font-bold mb-2'>Take a selfie</h2>
                  <ul className='list-disc list-outside ml-5 text-[#6D6D6D]'>
                    <li>Make sure you are in a well -lit area</li> 
                    <li>Make sure you are in a front of a plain background</li> 
                    <li>Make sure you remove hats, thick glasses or anything else</li> 
                    <li>Make sure you keep your expression neutral Make sure to keep your face within the circle</li>
                  </ul>
                </div>
              </div>

              <button className='border border-[#E5E5E8] rounded-lg p-4 flex items-center justify-center gap-2 mt-4' type="button" onClick={() => fileInputRef.current?.click()}>
                <Camera/>
                Click to take a picture
              </button>

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
