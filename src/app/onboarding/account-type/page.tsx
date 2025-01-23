'use client';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { Pill } from '@/components/shared';
import { useForm } from '../context/onboard-context';

const validationSchema = Yup.object().shape({});

enum AccountType {
  Individual = 'Individual',
  Team = 'Company'
}

const initialValues = {
  accountType: AccountType.Individual as `${AccountType}`
};

type InitialValues = ReturnType<() => typeof initialValues>;

export default function Page () {
  const rt = useRouter();
  const { isLoading } = queries.login();
  const { setFormData } = useForm();

  const onSubmit = (values: InitialValues) => {
    setFormData(values);
    if (values.accountType === AccountType.Individual) {
      rt.push(routes.onboarding.individual.profession.path);
    } else {
      rt.push(routes.onboarding.team.companyDetails.path);
    }
  };

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
                const { values, setFieldValue, handleSubmit } = props;

                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <h3 className="app_auth_login__title">
                      What kind of account do you want?
                    </h3>
                    <div className="flex flex-col gap-8">
                      <div className="flex gap-2">
                        <Pill
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () =>
                            await setFieldValue(
                              'accountType',
                              AccountType.Individual
                            )
                          }
                          active={values.accountType === AccountType.Individual}
                          className="w-full"
                        >
                          Individual
                        </Pill>

                        <Pill
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () =>
                            await setFieldValue('accountType', AccountType.Team)
                          }
                          active={values.accountType === AccountType.Team}
                          className="w-full"
                        >
                          Team
                        </Pill>
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
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
