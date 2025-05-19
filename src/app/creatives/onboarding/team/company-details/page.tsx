'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { Pill } from '@/components/shared';
import { storeValues, useAppDispatch, useAppSelector } from '@/store';

enum CompanySize {
  '1-10' = '1-10',
  '11-50' = '11-50',
  '101 - 500' = '101 - 500',
  '501 - 2000+' = '501 - 2000+',
}

const validationSchema = Yup.object().shape({
  companyName: Yup.string().min(3).required(),
});

export default function Page() {
  const dispatch = useAppDispatch();
  const { companySize, companyName } = useAppSelector((state) => state?.register);
  const rt = useRouter();
  const { isLoading } = queries.login();
  const [show, setShow] = useState(false);

  const initialValues = {
    companyName: companyName,
    companySize: companySize || CompanySize['1-10'],
  };

  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      if (show) {
        dispatch(storeValues(values));
        rt.push(routes.creatives.onboarding.team.profession.path);
      } else {
        setShow(true);
      }
    },
    validationSchema,
  });

  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    values,
    handleBlur,
  } = formik;

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">
                Your company {show ? 'size' : 'name'}
              </h3>

              <div className="flex flex-col gap-6">
                {show ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(CompanySize).map(([label]) => (
                      <Pill
                        key={label}
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={async () =>
                          await setFieldValue('companySize', label)
                        }
                        active={values.companySize === label}
                      >
                        {label}
                      </Pill>
                    ))}
                  </div>
                ) : (
                  <div className="">
                    <Input
                      name="companyName"
                      placeholder="Enter company name"
                      size="xl"
                      value={values.companyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
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
