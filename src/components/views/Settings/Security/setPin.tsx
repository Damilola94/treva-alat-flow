'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { errorToast, successToast } from '@/services';
import { getErrorMessage } from '@/utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  useChangeWalletPinMutation,
  useSendWalletOtpMutation,
  useVerifyWalletOtpMutation,
} from '@/services/paymentService';


const otpValidationSchema = Yup.object().shape({
  otp: Yup.string().required('OTP is required'),
});

const OtpStep = ({ onProceed }: { onProceed: () => void }) => {
  const [sendOtp, { isLoading: isSendingOtp }] = useSendWalletOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyWalletOtpMutation();

  const formik = useFormik({
    initialValues: { otp: '' },
    validationSchema: otpValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await verifyOtp({ otp: values.otp }).unwrap();
        if (response?.isSuccess) {
          successToast(response?.message || 'OTP verified successfully');
          onProceed();
        } else {
          errorToast(response?.message || 'Invalid OTP, please try again');
        }
      } catch (e) {
        errorToast(getErrorMessage(e));
      }
    },
  });

  const { handleBlur, handleChange, handleSubmit, values, isValid, dirty, touched, errors } =
    formik;

  const handleSendOtp = async () => {
    try {
      const response = await sendOtp().unwrap();
      if (response?.isSuccess) {
        successToast(response?.message || 'OTP sent to your email');
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      errorToast(getErrorMessage(error) || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <p className="text-[#3D3D3D] mb-12 max-w-lg">
        To reset your PIN code, you&apos;ll need to verify with a verification code sent to your mail
      </p>

      <div className="max-w-sm mb-6 text-[#6D6D6D]">
        <Input
          name="otp"
          type="text"
          placeholder="OTP verification code"
          value={values.otp}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="flex justify-end gap-5 mt-36 w-full">
        <Button
          size="md"
          backgroundColor="transparent"
          color="treva-purple"
          className="app_auth_login__btn border border-[#E7E7E7] font-bold"
          onClick={handleSendOtp}
          isLoading={isSendingOtp}
        >
          Send OTP
        </Button>

        <Button
          className="app_auth_login__btn font-bold"
          size="md"
          backgroundColor="primary-blue-500"
          onClick={() => handleSubmit()}
          disabled={!(dirty && isValid)}
          isLoading={isVerifyingOtp}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};


const setPinValidationSchema = Yup.object().shape({
  pin: Yup.string()
    .min(4, 'PIN must be at least 4 characters')
    .required('New PIN is required'),
  confirmPin: Yup.string()
    .oneOf([Yup.ref('pin')], 'PINs must match')
    .required('Confirm PIN is required'),
});

const SetPinStep = () => {
  const [triggerChangePin, { isLoading }] = useChangeWalletPinMutation();

  const formik = useFormik({
    initialValues: {
      pin: '',
      confirmPin: '',
    },
    validationSchema: setPinValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await triggerChangePin({
          pin: values.pin,
          confirmPin: values.confirmPin,
        }).unwrap();
        if (response?.isSuccess) {
          successToast(response?.message || 'PIN changed successfully');
        } else {
          errorToast(response?.message || getErrorMessage(response));
        }
      } catch (error) {
        errorToast(getErrorMessage(error));
      }
    },
  });

  const { handleBlur, handleChange, handleSubmit, values, isValid, dirty, touched, errors } =
    formik;

  return (
    <div className="flex flex-col h-full">
      <div className="max-w-sm mt-6 mb-10">
        <Input
          name="pin"
          type="password"
          placeholder="Your new PIN code"
          value={values.pin}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="max-w-sm mb-6">
        <Input
          name="confirmPin"
          type="password"
          placeholder="Confirm code"
          value={values.confirmPin}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="flex justify-end mt-44">
        <Button
          className="app_auth_login__btn"
          size="md"
          backgroundColor="primary-blue-500"
          onClick={() => handleSubmit()}
          disabled={!(dirty && isValid)}
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};


const ResetPin = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<'otp' | 'setPin'>('otp');

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1 text-[#1D1B20] hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <h2 className="mb-2 font-bold text-[16px]">Reset PIN code</h2>

      {step === 'otp' ? (
        <OtpStep onProceed={() => setStep('setPin')} />
      ) : (
        <SetPinStep />
      )}
    </div>
  );
};

export default ResetPin;