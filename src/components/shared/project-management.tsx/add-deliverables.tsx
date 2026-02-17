/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import projectManagement from '@/lib/assets/project-management';
import Image from 'next/image';
import {
  errorToast,
  successToast,
  useCreateDeliverableMutation,
} from '@/services';
import { useAppDispatch, useAppSelector } from '@/store';
import { storeValues } from '@/store/slices/project';
import { getErrorMessage } from '@/utils';
import { numberFormat } from '@/lib/numbers';

interface IProps {
  onClose: () => void;
  projectId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddDeliverable: (values: any) => void;
  setDeliverableId: (id: string) => void;
}

export function AddDeliverables(props: IProps) {
  const dispatch = useAppDispatch();
  const { onClose, projectId, setDeliverableId, onAddDeliverable } = props;
  const [createDeliverables, { isLoading }] = useCreateDeliverableMutation();
  const {
    name,
    deliverableDescription,
    startDate,
    endDate,
    unitAmount,
    unit,
    projectId: projectIdStore,
  } = useAppSelector((state) => state?.project);

  const today = new Date();
  const maxEndDate = new Date(today);
  maxEndDate.setMonth(maxEndDate.getMonth() + 3);
  const todayStr = today.toISOString().split('T')[0];

  const initialValues = {
    name: name,
    description: deliverableDescription,
    startDate: startDate,
    endDate: endDate,
    unitAmount: unitAmount,
    unit: unit,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter a deliverable name'),
    description: Yup.string().required('Please enter a description'),
    startDate: Yup.date().required('Please select a start date'),
    // endDate: Yup.date().required('Please select a due date'),
    endDate: Yup.date()
      .min(today, 'End date cannot be in the past')
      .max(maxEndDate, 'End date cannot be more than 3 months from today')
      .required('Please select a due date'),
    unitAmount: Yup.number().required('Please enter unit amount'),
    unit: Yup.number().required('Please enter unit'),
  });

  const onSubmit = async (values: typeof initialValues) => {
    const projectIdAPI: string = projectIdStore ? projectIdStore : projectId;
    try {
      const response = await createDeliverables({
        projectId: projectIdAPI,
        ...values,
        description: values.description,
      }).unwrap();
      const deliverable = response?.data;
      if (deliverable?.id) {
        dispatch(storeValues(values));
        setDeliverableId(deliverable.id);
        onAddDeliverable({
          ...deliverable,
          deliverableId: deliverable.id,
          unitAmount: values.unitAmount,
          unit: values.unit,
          total: (Number(values.unitAmount) || 0) * (Number(values.unit) || 0),
        });
        successToast(response?.message || 'Deliverable created successfully');
        // resetForm()
        onClose();
        // dispatch(storeValues(values))

        dispatch(
          storeValues({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            unitAmount: '',
            unit: '',
          }),
        );
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  return (
    <div className="app_auth_login_container relative">
      <Image
        src={projectManagement.topGradient || '/placeholder.svg'}
        alt="top gradient"
        className="w-full"
        unoptimized
      />
      <div className="app_auth_login_container__upper !-mt-80">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title mb-5">Add new deliverable</h3>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize={true}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                errors,
                touched,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 mt-14"
                >
                  <Input
                    name="name"
                    type="text"
                    placeholder="Deliverable Name"
                    size="xl"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />

                  <Input
                    name="description"
                    type="text"
                    placeholder="Description"
                    size="xl"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                  <div className="flex gap-5">
                    <Input
                      name="startDate"
                      type="date"
                      label="Start Date"
                      size="xl"
                      value={values.startDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />

                    <Input
                      name="endDate"
                      type="date"
                      label="End Date"
                      size="xl"
                      value={values.endDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      min={todayStr}
                      // max={maxEndDateStr}
                    />
                  </div>

                  <div className="flex gap-5">
                    <Input
                      name="unitAmount"
                      type="number"
                      placeholder="Unit Amount"
                      size="xl"
                      value={values.unitAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />

                    <Input
                      name="unit"
                      type="number"
                      placeholder="Unit Price"
                      size="xl"
                      value={values.unit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <p className="font-bold text-lg mt-2">
                    Total Amount:{' '}
                    <span>
                      {numberFormat(
                        (Number(values.unitAmount) || 0) *
                          (Number(values.unit) || 0),
                      )}
                    </span>
                  </p>

                  <div className="flex justify-between space-x-10 absolute bottom-0 w-full -left-5 mb-5">
                    <Button
                      size="md"
                      type="button"
                      backgroundColor="transparent"
                      color="primary-blue-500"
                      className="w-full hover:bg-transparent ml-10 app_auth_login__btn border border-[text-color-100]"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      size="md"
                      backgroundColor="primary-blue-500"
                      className="w-full app_auth_login__btn"
                      isLoading={isLoading}
                    >
                      Add
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
