'use client';
import React from 'react';
import { useFormik } from 'formik';
// import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
// import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { Pill } from '@/components/shared';
import {
  storeValues,
  useAppDispatch,
  useAppSelector,
  useCreativeOnboardingForm,
} from '@/store';

// const validationSchema = Yup.object().shape({});

enum AccountType {
  Individual = 'Individual',
  Team = 'Company',
}

export default function Page() {
  const rt = useRouter();
  // const { isLoading } = queries.login();
  const { setFormData } = useCreativeOnboardingForm();
  const dispatch = useAppDispatch();
  const { accountType } = useAppSelector((state) => state?.register);

  const initialValues = {
    accountType: accountType || (AccountType.Individual as `${AccountType}`),
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setFormData(values);
      dispatch(storeValues(values));
      if (values.accountType === AccountType.Individual) {
        rt.push(routes.creatives.onboarding.individual.profession.path);
      } else {
        rt.push(routes.creatives.onboarding.team.companyDetails.path);
      }
    },
  });

  const { handleSubmit, values, setFieldValue } = formik;

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">
                What kind of account do you want?
              </h3>
              <div className="flex flex-col gap-8">
                <div className="flex gap-2">
                  <Pill
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async () =>
                      await setFieldValue('accountType', AccountType.Individual)
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
                  // isLoading={isLoading}
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
