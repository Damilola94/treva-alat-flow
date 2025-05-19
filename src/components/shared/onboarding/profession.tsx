'use client';

/* eslint-disable @typescript-eslint/no-misused-promises */

// eslint-disable-next-line

/* eslint-disable */

import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { Pill } from '@/components/shared';
import { useAppSelector, useCreativeOnboardingForm } from '@/store';
import {
  errorToast,
  successToast,
  useGetProfessionsQuery,
  useRegisterMutation,
} from '@/services';
import { useMemo } from 'react';
import { extractName } from '@/lib/utils';
import { getErrorMessage } from '@/utils';

const validationSchema = Yup.object().shape({
  profession: Yup.string().required('Please select your profession'),
});

export function Profession() {
  const rt = useRouter();
  const { password, fullName, ...rest } = useAppSelector(
    (state) => state?.register,
  );

  // const { isLoading } = queries.login();
  // const { data: professions } = queries.read();
  const { data: professionsData, isLoading: loadingProfessions } =
    useGetProfessionsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [triggerRegister, { isLoading }] = useRegisterMutation();

  const professions = useMemo(
    () => professionsData?.data || [],
    [professionsData],
  );
  const { setFormData, formData } = useCreativeOnboardingForm();

  const initialValues = {
    profession: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setFormData(values);
      const { email, fullName, password, accountType } = formData;
      const { firstName, lastName } = extractName(fullName);

      try {
        const payload = {
          ...rest,
          actorType: 'Creative',
          accountType,
          email,
          password,
          firstName,
          lastName,
          professionId: values?.profession,
          companySize: '',
          companyName: '',
        };

        const response = await triggerRegister(payload).unwrap();
        if (response?.isSuccess) {
          successToast(response?.message || 'Account created successfully');
          rt.push(routes.creatives.onboarding.emailVerification.path);
        } else {
          errorToast(getErrorMessage(response));
        }
      } catch (error) {
        errorToast(getErrorMessage(error));
      }

      rt.push(routes.creatives.onboarding.emailVerification.path);
    },
    validationSchema,
  });

  const { values, setFieldValue, handleSubmit } = formik;

  const toggleProfession = (id: string) => {
    const current = values.profession;
    setFieldValue('professions', current === id ? '' : id); // deselect if clicked again
  };

  return (
    <div className="app_auth_login_container">
      <Header />
      <div className="app_auth_login_container__upper">
        <div className="app_auth_login">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h3 className="app_auth_login__title">What is your profession</h3>
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-wrap gap-2">
                    {!professions ? (
                      <div>Loading professions...</div>
                    ) : (
                      professions?.map(({ name, id }: any) => (
                        <Pill
                          key={id}
                          onClick={() => {
                            toggleProfession(id);
                          }}
                          active={values.profession === id}
                        >
                          {name}
                        </Pill>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div>
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
