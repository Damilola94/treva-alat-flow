'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import {
  storeValues,
  useAppDispatch,
  useAppSelector,
  useClientOnboardingForm,
} from '@/store';
// import { useForm } from '../../context/onboard-context';

interface FormData {
  phoneNumber: string;
}

export default function Page() {
  const dispatch = useAppDispatch();
  const { phoneNumber } = useAppSelector((state) => state?.register);
  const rt = useRouter();
  const { isLoading } = queries.login();
  const { setFormData } = useClientOnboardingForm();

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .test('phone', 'Enter a valid Nigerian phone number', (value) => {
        if (!value) return false;
        const phoneRegex = /^0[789][01]\d{8}$/;
        return phoneRegex.test(value);
      })
      .required('Phone number is required'),
  });

  const initialValues: FormData = {
    phoneNumber: phoneNumber,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      dispatch(storeValues({ ...values, countryCode: '+234' }));
      setFormData(values);
      rt.push(routes.client.onboarding.security.path);
    },
    validationSchema,
  });

  const { handleBlur, handleChange, handleSubmit, errors, touched, values } =
    formik;

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">Your Phone Number</h3>
              <div className="flex flex-col gap-6">
                <div className="">
                  <Input
                    name="phoneNumber"
                    type="text"
                    placeholder="(+234)"
                    size="xl"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="">
                <Button
                  size="xl"
                  isLoading={isLoading}
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn"
                >
                  Next
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
