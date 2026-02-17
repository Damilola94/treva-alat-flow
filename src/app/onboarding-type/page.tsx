'use client';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { Clientlogo, Freelancerlogo, Pill } from '@/components/shared';
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
        // rt.push(routes.creatives.onboarding.inputEmail.path);
        rt.push(routes.register.createAccount.path);
      } else {
        // rt.push(routes.client.onboarding.personalDetails.path);
        rt.push(routes.register.createAccount.path);
      }
    },
  });

  const { values, handleSubmit, setFieldValue } = formik;

  useEffect(() => {
    if (actorType) {
      setFieldValue('onboardingType', actorType);
    }
  }, [actorType, setFieldValue]);

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">
                Join as a client or freelancer
              </h3>
              <div className="flex flex-col gap-8 mt-5">
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
                    className="w-full min-h-[120px] flex flex-col justify-center items-center"
                  >
                    <div className="flex flex-col space-y-4">
                      <Freelancerlogo />
                      <div className="text-start mb-4">
                        <p className="font-bold text-[#333333] text-sm">
                          Freelancer
                        </p>
                        <p className="text-[#808080] text-sm">
                          I&apos;m looking for freelance work
                        </p>
                      </div>
                    </div>
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
                    className="w-full min-h-[120px] flex flex-col justify-center items-center"
                  >
                    <div className="flex flex-col space-y-4">
                      <Clientlogo />
                      <div className="text-start mb-4">
                        <p className="font-bold text-[#333333] text-sm">
                          Client
                        </p>
                        <p className="text-[#808080] text-sm">
                          I&apos;m looking to hire freelancers.
                        </p>
                      </div>
                    </div>
                  </Pill>
                </div>
              </div>

              <div className="">
                <Button
                  size="xl"
                  isLoading={isLoading}
                  backgroundColor="primary-blue-500"
                  className="w-full app_auth_login__btn mt-10"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
