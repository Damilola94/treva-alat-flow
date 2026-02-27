'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
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
  useVerifyBvnMutation,
} from '@/services';
import { getErrorMessage } from '@/utils';
import { ImagePlaceholder } from '@/app/assets/svgs';
import NinVerification from './NinVerification';
import { Loader2 } from 'lucide-react';

const validationSchema = Yup.object().shape({
  bvn: Yup.string()
    .required('Please enter your BVN')
    .matches(/^\d{11}$/, 'BVN must be exactly 11 digits'),
});

export default function BvnVerification() {
  const router = useRouter();
  const {
    userOnboardingData,
    saveClientOnboarding,
    saveOnboardingResponse,
    loading,
  } = useUsers();
  const [triggerBvnVerify, { isLoading }] = useVerifyBvnMutation();
  const [triggerCallback, { isLoading: callbackLoading }] =
    useCallbackMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [idType, setIdType] = useState<'BVN' | 'NIN'>('BVN');

  const initialValues = React.useMemo(
    () => ({
      bvn: userOnboardingData?.data?.bvn || '',
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
        const response = await triggerBvnVerify(payload).unwrap();
        if (response?.isSuccess && response?.data?.url) {
          window.location.href = response?.data?.url;
        } else {
          errorToast(response?.message || 'Something went wrong');
        }
        // } catch (error) {
        //   const message = getErrorMessage(error);
        //   errorToast(message || 'Something went wrong');
        // }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const message =
          error?.data?.message ||
          error?.message ||
          getErrorMessage(error) ||
          'Something went wrong';
        errorToast(message);
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

    if (success && id_type === 'bvn') {
      setFieldValue('bvn', id, true);

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
      !!userOnboardingData?.data?.bvn &&
      userOnboardingData?.data?.isBvnVerified
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
        <ProgressStatus label="ID Verification" checked />
        {/* <ProgressStatus label="NIN Verification" /> */}
        <ProgressStatus label="Address Verification" />
        <ProgressStatus label="Finish" />
        {/* <ProgressStatus label="Team setup" /> */}
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10">
        <div>
          <h3 className="app_get_started_professional_details__form__title !font-bold">
            ID Verification
          </h3>
          <hr className="my-5" />
          <h3 className="app_get_started_professional_details__form__title !font-bold mb-3">
            Select ID Type
          </h3>
          <div className="w-full sm:flex-row flex-col flex justify-between sm:items-center gap-4">
            <button
              type="button"
              onClick={() => setIdType('BVN')}
              className={`w-full py-6 px-4 bg-[#F9FAFB] rounded-2xl border transition-colors
      ${idType === 'BVN' ? 'border-[#7B37F0]' : 'border-gray-300 '}
    `}
            >
              BVN
            </button>

            <button
              type="button"
              onClick={() => setIdType('NIN')}
              className={`w-full bg-[#F9FAFB] py-6 px-4 rounded-2xl border transition-colors
${idType === 'NIN' ? 'border-[#7B37F0]' : 'border-gray-300 '}
    `}
            >
              NIN
            </button>
          </div>
        </div>
        {idType === 'BVN' && (
          <div className="">
            <div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-8">
                  <div className="">
                    <Input
                      name="bvn"
                      type="text"
                      label="BVN validation"
                      placeholder=""
                      size="lg"
                      value={values.bvn || ''}
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
                            <p className="text-sm font-normal mt-2">
                              Completed
                            </p>
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
                      className="w-full py-3 px-12 flex items-center justify-center gap-2"
                      onClick={() => saveClientOnboarding({ currentStep: 2 })}
                      disabled={!isSuccess || callbackLoading || loading}
                      // isLoading={loading}
                    >
                      {loading && (
                        <Loader2 size={18} className="animate-spin" />
                      )}
                      <span>Save & Continue</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {idType === 'NIN' && <NinVerification />}
      </div>
    </div>
  );
}
