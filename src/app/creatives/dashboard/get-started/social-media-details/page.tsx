'use client';
import React, { useEffect } from 'react';
import {  useFormik } from 'formik';
// import * as Yup from 'yup';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import { useUsers } from '@/hooks/Users';

// const validationSchema = Yup.object().shape({
//   // startTour: Yup.string().required('Please enter company name'),
// });

export default function Page() {
  const router = useRouter();

  const {
    saveCreativeOnboarding,
    saveOnboardingResponse,
    creativeOnboardingData,
    loading,
  } = useUsers();

  const initialValues = React.useMemo(
    () => ({
      x: creativeOnboardingData?.data?.x || '',
      linkedin: creativeOnboardingData?.data?.linkedIn || '',
      instagram: creativeOnboardingData?.data?.instagram || '',
      facebook: creativeOnboardingData?.data?.facebook || '',
      tiktok: creativeOnboardingData?.data?.tikTok || '',
    }),
    [creativeOnboardingData?.data],
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        currentStep: 3,
      };
      saveCreativeOnboarding(payload);
    },
  });

  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    formik;

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.creatives.dashboard.getStarted.bio.path);
    }
  }, [router, saveOnboardingResponse]);

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Professional details" checked />
        <ProgressStatus label="Social media details" active />
        <ProgressStatus label="Bio" />
        <ProgressStatus label="Select plan" />
        <ProgressStatus label="Finish" />
        {/* <ProgressStatus label="Team setup" /> */}
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10">
        <h3 className="app_get_started_professional_details__form__title">
          Social media details
        </h3>
        <div className="">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-8">
                <div className="">
                  <Input
                    name="linkedin"
                    type="text"
                    id="linkedin"
                    label="Linkedin"
                    placeholder="Enter company name"
                    size="lg"
                    value={values.linkedin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="">
                  <Input
                    name="instagram"
                    type="text"
                    id="instagram"
                    label="Instagram"
                    placeholder="Enter instagram handle"
                    size="lg"
                    value={values.instagram}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="">
                  <Input
                    name="facebook"
                    type="text"
                    id="facebook"
                    label="Facebook"
                    placeholder="Enter facebook handle"
                    size="lg"
                    value={values.facebook}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="">
                  <Input
                    name="x"
                    type="text"
                    id="x"
                    label="X"
                    placeholder="Enter x handle"
                    size="lg"
                    value={values.x}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="">
                  <Input
                    name="tiktok"
                    type="text"
                    id="tiktok"
                    label="Tiktok"
                    placeholder="Enter tiktok handle"
                    size="lg"
                    value={values.tiktok}
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
