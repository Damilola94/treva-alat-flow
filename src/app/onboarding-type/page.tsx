'use client';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { Pill } from '@/components/shared';
import {
  storeValues,
  useAppDispatch,
  useAppSelector,
  useClientOnboardingForm,
} from '@/store';
// import { useForm } from './context/onboard-context';

enum OnboardingType {
  Creative = 'Creative',
  Client = 'Client',
}

export default function Page() {
  const dispatch = useAppDispatch();
  const { actorType } = useAppSelector((state) => state?.register);
  const rt = useRouter();
  const { isLoading } = queries.login();
  const { setFormData } = useClientOnboardingForm();

  const initialValues = {
    onboardingType: OnboardingType.Creative as `${OnboardingType}`,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      setFormData(values);
      dispatch(storeValues({ actorType: values?.onboardingType }));
      if (values.onboardingType === OnboardingType.Creative) {
        rt.push(routes.creatives.onboarding.inputEmail.path);
      } else {
        rt.push(routes.client.onboarding.personalDetails.path);
      }
    },
  });

  const { values, handleSubmit, setFieldValue } = formik;

  useEffect(() => {
    if (actorType) {
      setFieldValue('onboardingType', actorType);
    }
  }, [actorType]);

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">
                What type of account do you want?
              </h3>
              <div className="flex flex-col gap-8">
                <div className="flex gap-2">
                  <Pill
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async () =>
                      await setFieldValue(
                        'onboardingType',
                        OnboardingType.Creative,
                      )
                    }
                    active={values.onboardingType === OnboardingType.Creative}
                    className="w-full"
                  >
                    Creative
                  </Pill>

                  <Pill
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async () =>
                      await setFieldValue(
                        'onboardingType',
                        OnboardingType.Client,
                      )
                    }
                    active={values.onboardingType === OnboardingType.Client}
                    className="w-full"
                  >
                    Client
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
          </div>
        </div>
      </div>
    </div>
  );
}
