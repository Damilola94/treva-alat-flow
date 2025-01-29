'use client';

/* eslint-disable @typescript-eslint/no-misused-promises */

// eslint-disable-next-line

/* eslint-disable */

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import queries from '@/services/queries/auth';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/onboarding';
import { Pill } from '@/components/shared';
import { useForm } from '@/app/onboarding/context/onboard-context';

const validationSchema = Yup.object().shape({
  professions: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one profession')
    .required()
});

const initialValues = {
  professions: [] as string[]
};

type InitialValues = typeof initialValues;

export function Profession (props?: {
  onSubmit?: (values: InitialValues) => void
}) {
  const rt = useRouter();
  const { isLoading } = queries.login();
  const { data: professions } = queries.read();
  const { setFormData } = useForm();

  const onSubmit = (values: InitialValues) => {
    setFormData(values);
    rt.push(routes.onboarding.emailVerification.path);
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
              {({ values, setFieldValue, handleSubmit }) => {
                const toggleProfession = (id: string) => {
                  const currentSelections = values.professions;
                  const isSelected = currentSelections.includes(id);
                  const updatedSelections = isSelected
                    ? currentSelections.filter((item) => item !== id)
                    : [...currentSelections, id];
                  setFieldValue('professions', updatedSelections);
                };

                return (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <h3 className="app_auth_login__title">
                      What is your profession
                    </h3>
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-wrap gap-2">
                      <div className="flex flex-wrap gap-2">
                        {
                          !professions 
                            ? (
                                <div>Loading professions...</div>
                              )
                            : (
                                professions.data.map(({ name, id }: any) => (
                                  <Pill
                                    key={id}
                                    onClick={() => { toggleProfession(id); } }
                                    active={values.professions.includes(id)}
                                  >
                                    {name}
                                  </Pill>
                                ))
                              )
                        }
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
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
