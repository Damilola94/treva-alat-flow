'use client';
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import { useUsers } from '@/hooks/Users';
import { Camera } from '@/components/shared';

// const validationSchema = Yup.object().shape({
//   // startTour: Yup.string().required('Please enter company name'),
// });

export default function NinVerification() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { saveOnboardingResponse, userOnboardingData } = useUsers();

  const initialValues = React.useMemo(
    () => ({
      ninValidation: '',
    }),
    [userOnboardingData?.data],
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        currentStep: 2,
      };
      console.log(payload);
      // saveClientOnboarding(payload);
      router.push(routes.client.dashboard.getStarted.addressVerification.path);
    },
  });

  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    formik;

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.client.dashboard.getStarted.addressVerification.path);
    }
  }, [router, saveOnboardingResponse]);

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <div className="flex justify-center items-center gap-4">
        <ProgressStatus label="Profile Setup" />
        <ProgressStatus label="BVN Verification" />
        <ProgressStatus label="NIN Verification" checked />
        <ProgressStatus label="Address Verification" />
        <ProgressStatus label="Finish" />
        {/* <ProgressStatus label="Team setup" /> */}
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10">
        <h3 className="app_get_started_professional_details__form__title">
          NIN Verification
        </h3>
        <div className="">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-8">
                <div className="">
                  <Input
                    name="ninValidation"
                    type="text"
                    label="NIN validation"
                    placeholder=""
                    size="lg"
                    value={values.ninValidation || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div>
                  <h2 className="font-bold mb-2">Take a selfie</h2>
                  <ul className="list-disc list-outside ml-5 text-[#6D6D6D]">
                    <li>Make sure you are in a well -lit area</li>
                    <li>Make sure you are in a front of a plain background</li>
                    <li>
                      Make sure you remove hats, thick glasses or anything else
                    </li>
                    <li>
                      Make sure you keep your expression neutral Make sure to
                      keep your face within the circle
                    </li>
                  </ul>
                </div>
              </div>

              <button
                className="border border-[#E5E5E8] rounded-lg p-4 flex items-center justify-center gap-2 mt-4"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera />
                Click to take a picture
              </button>

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
