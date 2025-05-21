'use client';

/* eslint-disable @typescript-eslint/no-misused-promises */

// eslint-disable-next-line

/* eslint-disable */

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { Pill } from '@/components/shared';
import {
  storeValues,
  useAppSelector,
  useCreativeOnboardingForm,
} from '@/store';
import {
  errorToast,
  successToast,
  useGetProfessionsQuery,
  useRegisterMutation,
} from '@/services';
import { useMemo } from 'react';
import { extractName } from '@/lib/utils';
import { getErrorMessage } from '@/utils';
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object().shape({
  profession: Yup.string().required('Please select your profession'),
});

enum CompanySize {
  '1-10' = '1-10',
  '11-50' = '11-50',
  '101 - 500' = '101 - 500',
  '501 - 2000+' = '501 - 2000+',
}

const companySizeMap: Record<CompanySize, string> = {
  [CompanySize['1-10']]: 'OneToTen',
  [CompanySize['11-50']]: 'ElevenToFifty',
  [CompanySize['101 - 500']]: 'TwoHundredOneToFiveHundred', // Assuming this is the right match
  [CompanySize['501 - 2000+']]: 'FiveHundredOneToThousand', // Could also be 'ThousandOneToTwoThousand' or 'TwoThousandPlus' depending on UX
};

export function Profession() {
  const rt = useRouter();
  const dispatch = useDispatch();
  const { password, fullName, companySize, professionId, ...rest } =
    useAppSelector((state) => state?.register);

  // const { isLoading } = queries.login();
  // const { data: professions } = queries.read();
  const { data: professionsData, isLoading: loadingProfessions } =
    useGetProfessionsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [triggerRegister, { isLoading }] = useRegisterMutation();

  const professions = useMemo(
    () => professionsData?.data || [],
    [professionsData],
  );
  const { setFormData } = useCreativeOnboardingForm();

  const initialValues = {
    profession: professionId,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      dispatch(storeValues({ professionId: values?.profession }));
      setFormData(values);
      const { firstName, lastName } = extractName(fullName);

      try {
        const payload = {
          ...rest,
          actorType: 'Creative',
          firstName,
          lastName,
          password,
          professionId: values?.profession,
          companySize: companySizeMap[companySize as CompanySize] || '',
          countryCode: '+234',
        };

        console.log(payload);

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
    },
    validationSchema,
  });

  const { values, setFieldValue, handleSubmit } = formik;

  const toggleProfession = (id: string) => {
    const current = values.profession;
    setFieldValue('profession', current === id ? '' : id); // deselect if clicked again
  };

  console.log(values);

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
