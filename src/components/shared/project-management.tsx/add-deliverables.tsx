/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import projectManagement from '@/lib/assets/project-management';
import Image from 'next/image';
import queries from '@/services/queries/projects';

interface IProps {
  onClose: () => void;
  projectId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddDeliverable: (values: any) => void;
  setDeliverableId: (id: string) => void;
}

const validationSchema = Yup.object().shape({
  deliverableName: Yup.string().required('Please enter a deliverable name'),
  description: Yup.string().required('Please enter a description'),
  startDate: Yup.date().required('Please select a start date'),
  dueDate: Yup.date().required('Please select a due date'),
});

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export function AddDeliverables(props: IProps) {
  const { onClose, projectId, setDeliverableId, onAddDeliverable } = props;

  const { mutate, isLoading } = queries.createDeliverables({
    onSuccess: (response) => {
      if (response?.data?.id) {
        const deliverableId = response.data.id;
        setDeliverableId(deliverableId);

        const newDeliverable = {
          deliverableId,
          deliverableName: response.data.deliverableName,
          deliverableDescription: response.data.description,
          startDate: response.data.startDate,
          dueDate: response.data.dueDate,
          deliverableAmount: response.data.deliverableAmount,
        };

        onAddDeliverable(newDeliverable);
      }
      onClose();
    },
  });

  const initialValues = {
    projectId,
    deliverableName: '',
    description: '',
    startDate: '',
    dueDate: '',
    unitDeliverableAmount: '',
    units: '',
    accountType: AccountType.Low as `${AccountType}`,
  };

  type InitialValues = ReturnType<() => typeof initialValues>;

  const onSubmit = (_values: InitialValues) => {
    mutate({ ..._values });
  };

  return (
    <div className="app_auth_login_container relative">
      <Image
        src={projectManagement.topGradient || '/placeholder.svg'}
        alt="top gradient"
        className="w-full"
      />
      <div className="app_auth_login_container__upper !-mt-80">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title mb-5">Add new deliverable</h3>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
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
                    name="deliverableName"
                    type="text"
                    placeholder="Deliverable Name"
                    size="xl"
                    value={values.deliverableName}
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
                      name="dueDate"
                      type="date"
                      label="Due Date"
                      size="xl"
                      value={values.dueDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="flex gap-5">
                    <Input
                      name="unitDeliverableAmount"
                      type="number"
                      placeholder="Unit Amount"
                      size="xl"
                      value={values.unitDeliverableAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />

                    <Input
                      name="units"
                      type="number"
                      placeholder="Units"
                      size="xl"
                      value={values.units}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <p className="font-semibold">
                    Total Amount:{' '}
                    <span className="font-normal">
                      {Number(values.unitDeliverableAmount) *
                        Number(values.units)}
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
