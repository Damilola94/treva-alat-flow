'use client';
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
// import queries from '@/services/queries/auth';
import { Header } from '@/components/shared/onboarding';
import { clearValues, useAppDispatch, useAppSelector } from '@/store';

const validationSchema = Yup.object().shape({});

const initialValues = {
  email: '',
};

export default function Page() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state?.register);
  // const { isLoading, mutate } = queries.create()
  const onSubmit = () => {
    // const { email, profession, fullName, password, accountType } = formData;
    // const { firstName, lastName } = extractName(fullName)
    // const payload = {
    //   accountType,
    //   email,
    //   password,
    //   firstName,
    //   lastName,
    //   professionIds: profession,
    //   organization: {
    //     name: 'string',
    //     organizationSizeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    //   }
    // }
    // mutate(payload)
  };

  const email = formData.email ?? '';

  useEffect(() => {
    dispatch(clearValues());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app_auth_login_container">
      <Header />

      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(props) => {
                const { handleSubmit } = props;

                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <h3 className="app_auth_login__title">
                      Email Verification
                    </h3>

                    <div className="flex flex-col gap-8">
                      <p className="app_auth_verification__p">
                        We have sent an email to
                        <br />
                        <span className="app_auth_verification__p__span">
                          <strong>{email}</strong>
                        </span>
                        <br />
                        <br />
                        Check your email and click the verification link to
                        begin.
                      </p>
                      {/* <Button
                        size="xl"
                        isLoading={isLoading}
                        backgroundColor="primary-blue-500"
                        className="w-full app_auth_login__btn"
                      >
                        Sign Up
                      </Button> */}
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
