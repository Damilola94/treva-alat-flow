'use client';
import { ProgressStatus } from '@/components/shared/dashboard/get-started';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCities, useStates, useUsers } from '@/hooks/Users';
import { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { SelectField } from '@/components/shared';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  // startTour: Yup.string().required('Please enter company name')
});

export default function AddressVerificationPage() {
  const router = useRouter();
  const [state, setState] = useState('');

  const { stateData } = useStates({ country: 'Nigeria' });
  const { citiesData } = useCities({ state: state });

  const stateOptions = useMemo(() => {
    return (
      stateData?.data?.map((state) => ({
        label: state.name ?? '',
        value: state.id ?? '',
      })) ?? []
    );
  }, [stateData]);

  const citiesOptions = useMemo(() => {
    return (
      citiesData?.data?.map((state) => ({
        label: state.name ?? '',
        value: state.id ?? '',
      })) ?? []
    );
  }, [citiesData]);

  const {
    // saveCreativeOnboarding,
    saveOnboardingResponse,
    // creativeOnboardingData,
    loading,
  } = useUsers();

//   const initialValues = useMemo(
//     () => ({
//       buildingNo: creativeOnboardingData?.data?.buildingNo || '',
//       city: creativeOnboardingData?.data?.cityId || '',
//       state: creativeOnboardingData?.data?.stateId || '',
//       apartment: creativeOnboardingData?.data?.apartment || '',
//       street: creativeOnboardingData?.data?.street || '',
//       landmark: creativeOnboardingData?.data?.landmark || '',
//       address: creativeOnboardingData?.data?.address || '',
//     }),
//     [creativeOnboardingData?.data],
//   );

 const initialValues = {
    buildingNo: '',
    city: '',
    state: '',
    apartment: '',
    street: '',
    landmark: '',
    address: '',
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    // onSubmit: (values) => {
    //   const payload = {
    //     buildingNo: values?.buildingNo,
    //     apartment: values?.apartment,
    //     street: values?.street,
    //     cityId: values?.city,
    //     stateId: values?.state,
    //     landmark: values?.landmark,
    //     address: values?.address,
    //     currentStep: 4,
    //   };
    //   saveCreativeOnboarding(payload);
    // },
     onSubmit: () => {
      // Skip validation + API call
      router.push(routes.creatives.dashboard.getStarted.selectPlan.path);
    },
    validationSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
    values,
  } = formik;

  useEffect(() => {
    if (saveOnboardingResponse?.isSuccess) {
      router.push(
        routes.creatives.dashboard.getStarted.selectPlan.path,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveOnboardingResponse]);
  
  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14 ">
      <div
        className="flex items-center gap-4 overflow-x-auto px-2 md:px-0 
                        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                        snap-x snap-mandatory md:justify-center"
      >
        <ProgressStatus label="Profile Setup" className="snap-start shrink-0" />
        <ProgressStatus
          label="BVN Verification"
          className="snap-start shrink-0"
        />
        <ProgressStatus
          label="NIN verification"
          className="snap-start shrink-0"
        />
        <ProgressStatus
          label="Address verification"
          checked
          className="snap-start shrink-0"
        />
        <ProgressStatus label="Select plan" className="snap-start shrink-0" />
        <ProgressStatus label="Finish" className="snap-start shrink-0" />
      </div>

      <div className="app_get_started_professional_details__form flex flex-col gap-10">
        <h3 className="app_get_started_professional_details__form__title !font-bold">
          Address Verification
        </h3>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-8">
              <div className="">
                <Input
                  name="buildingNo"
                  type="text"
                  label="Building No"
                //   required
                  placeholder="e.g 15, Block A"
                  size="lg"
                  value={values.buildingNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="">
                <Input
                  name="apartment"
                  type="text"
                  label="Apartment"
                //   required
                  placeholder="e.g 3B, Suite 201"
                  size="lg"
                  value={values.apartment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="">
                <Input
                  name="street"
                  type="text"
                  label="Street"
                //   required
                  placeholder="e.g Adeniran Ogunsanya Street"
                  size="lg"
                  value={values.street}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div>
                <SelectField
                  name="city"
                  label="City"
                  options={citiesOptions}
                  placeholder="Select city"
                  onChange={(option) => {
                    setFieldValue('city', option.value);
                  }}
                  value={values?.city}
                />
              </div>

              <div>
                <SelectField
                  name="town"
                  label="Town"
                  options={citiesOptions}
                  placeholder="Select Town"
                  onChange={(option) => {
                    setFieldValue('city', option.value);
                  }}
                  value={values?.city}
                />
              </div>

              <div>
                <SelectField
                  name="state"
                  label="State"
                  options={stateOptions}
                  placeholder="Select State"
                  onChange={(option) => {
                    setFieldValue('state', option.value);
                    setState(option?.label);
                  }}
                  value={values?.state}
                />
              </div>

              <div>
                <SelectField
                  name="lga"
                  label="LGA"
                  options={stateOptions}
                  placeholder="Select LGA"
                  onChange={(option) => {
                    setFieldValue('state', option.value);
                    setState(option?.label);
                  }}
                  value={values?.state}
                />
              </div>

              <div className="">
                <Input
                  name="landmark"
                  type="text"
                  label="Landmark"
                //   required
                  placeholder="e.g National Theathre, GTBank"
                  size="lg"
                  value={values.landmark}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="">
                <Input
                  name="address"
                  type="text"
                  label="Enter Full Address*"
                //   required
                  placeholder="e.g No 5, Adeniran street off Anthony street Lagos, Nigeria"
                  size="lg"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>

            <div className="pt-4 flex">
              <div className="">
                <Button
                  size="xl"
                  backgroundColor="primary-blue-500"
                  className="w-full py-3 px-12"
                  isLoading={loading}
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
