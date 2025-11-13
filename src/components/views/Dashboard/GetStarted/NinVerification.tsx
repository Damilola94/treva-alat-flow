'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import { useUsers } from '@/hooks/Users';
import { Camera } from '@/components/shared';
import {
  errorToast,
  useCallbackMutation,
  useVerifyNinMutation,
} from '@/services';
import { getErrorMessage } from '@/utils';
import { ImagePlaceholder } from '@/app/assets/svgs';

const validationSchema = Yup.object().shape({
  nin: Yup.string()
    .required('Please enter your NIN')
    .matches(/^\d{11}$/, 'NIN must be exactly 11 digits'),
});

export default function NinVerification() {
  const router = useRouter();
  const { userOnboardingData, saveClientOnboarding, saveOnboardingResponse } =
    useUsers();
  const [triggerNinVerify, { isLoading }] = useVerifyNinMutation();
  const [triggerCallback, { isLoading: callbackLoading }] =
    useCallbackMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const initialValues = React.useMemo(
    () => ({
      nin: userOnboardingData?.data?.nin || '',
    }),
    [userOnboardingData?.data],
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
        };
        const response = await triggerNinVerify(payload).unwrap();
        if (response?.isSuccess && response?.data?.url) {
          window.location.href = response?.data?.url;
        } else {
          errorToast(response?.message || 'Something went wrong');
        }
      } catch (error) {
        const message = getErrorMessage(error);
        errorToast(message || 'Something went wrong');
      }
    },
    validationSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
  } = formik;

  const handleCallback = async (payload: {
    success: boolean;
    id: string;
    c_id: string;
    id_type: string;
  }) => {
    try {
      const response = await triggerCallback(payload).unwrap();
      if (response?.isSuccess) {
        setIsSuccess(true);
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const success = params.get('success') === 'true';
    const id = params.get('id') || '';
    const c_id = params.get('c_id') || '';
    const id_type = params.get('id_type') || '';

    if (success && id_type === 'nin') {
      setFieldValue('nin', id, true);

      const payload = {
        success,
        id,
        c_id,
        id_type,
      };
      handleCallback(payload);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !!userOnboardingData?.data?.nin &&
      userOnboardingData?.data?.isNinVerified
    ) {
      setIsSuccess(true);
    }
  }, [userOnboardingData]);

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(routes.client.dashboard.getStarted.addressVerification.path);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveOnboardingResponse]);

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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-8">
                <div className="">
                  <Input
                    name="nin"
                    type="text"
                    label="NIN validation"
                    placeholder=""
                    size="lg"
                    value={values.nin || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div>
                  {isSuccess ? (
                    <>
                      <div className="w-full flex gap-6 items-center">
                        <div>
                          <ImagePlaceholder />
                        </div>
                        <div className="w-full">
                          <p className="text-sm font-bold">Photo captured</p>
                          <div className="h-1.5 bg-[#7B37F0] rounded mt-1" />
                          <p className="text-sm font-normal mt-2">Completed</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-bold mb-2">Take a selfie</h2>
                      <ul className="list-disc list-outside ml-5 text-[#6D6D6D]">
                        <li>Make sure you are in a well -lit area</li>
                        <li>
                          Make sure you are in a front of a plain background
                        </li>
                        <li>
                          Make sure you remove hats, thick glasses or anything
                          else
                        </li>
                        <li>
                          Make sure you keep your expression neutral Make sure
                          to keep your face within the circle
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {!isSuccess && (
                <button
                  className="border border-[#E5E5E8] rounded-lg p-4 flex items-center justify-center gap-2 mt-4"
                  onClick={() => handleSubmit()}
                  disabled={isLoading || isSuccess}
                >
                  <Camera />
                  Click to take a picture
                </button>
              )}

              <div className="pt-4 flex">
                <div className="">
                  <Button
                    size="xl"
                    backgroundColor="primary-blue-500"
                    className="w-full py-3 px-12"
                    onClick={() => saveClientOnboarding({ currentStep: 3 })}
                    disabled={!isSuccess || callbackLoading}
                  >
                    Save & Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
