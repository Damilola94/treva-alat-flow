'use client';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
// import * as Yup from 'yup';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import { useUsers } from '@/hooks/Users';

// const validationSchema = Yup.object().shape({
//   // startTour: Yup.string().required('Please enter company name')
// });

export default function Bio() {
  const router = useRouter();
  const { saveClientOnboarding, saveOnboardingResponse, userOnboardingData } =
    useUsers();

  const initialValues = {
    bio: userOnboardingData?.data?.bio || '',
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        ...values,
        currentStep: 3,
      };
      saveClientOnboarding(payload);
    },
  });

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    formik;

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.client.dashboard.getStarted.done.path);
    }
  }, [saveOnboardingResponse]);

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Personal details" checked />
        <ProgressStatus label="Social media details" checked />
        <ProgressStatus label="Bio" active />
        <ProgressStatus label="Finish" />
        {/* <ProgressStatus label="Team setup" /> */}
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10">
        <h3 className="app_get_started_professional_details__form__title">
          Bio{' '}
          <span className="text-[#6D6D6D] font-light text-sm">
            (150 words max)
          </span>
        </h3>
        <div className="">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-8">
                <div className="">
                  <Input
                    name="bio"
                    type="text"
                    id="bio"
                    placeholder="Enter your bio"
                    size="lg"
                    value={values.bio}
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
