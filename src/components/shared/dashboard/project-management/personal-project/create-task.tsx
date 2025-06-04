import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pill } from '../../../pill';
import { useAppDispatch, useAppSelector } from '@/store';
import { errorToast, successToast, useCreateDeliverableTaskMutation } from '@/services';
import { storeValues } from '@/store/slices/project';
import { useParams } from 'next/navigation';
import { useDeliverable } from '@/hooks/Projects/useProjects';
import { getErrorMessage } from '@/utils';

interface IProps {
  onClose: () => void;
  projectId: string;
  deliverableId?: string;
  setDeliverableId: (id: string) => void;
}

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export function CreateTaskCard(props: IProps) {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  const { onClose } = props;
  const dispatch = useAppDispatch();
  const { name, startDate, endDate, priority, deliverableId } = useAppSelector(
    (state) => state?.project,
  );

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter a task name'),
    startDate: Yup.date().required('Please select a start date'),
    endDate: Yup.date().required('Please select a due date'),
    priority: Yup.string().required('Please select a priority'),
    deliverableId: Yup.string().required('Please select a deliverable'),
  });

  const [createTask, { isLoading }] = useCreateDeliverableTaskMutation();
 const { allDeliverablesData } = useDeliverable(projectId);
  const deliverables = allDeliverablesData?.data;

  const initialValues = {
    projectId,
    deliverableId: deliverableId,
    name: name,
    startDate: startDate,
    endDate: endDate,
    priority: priority,
  };

  type InitialValues = ReturnType<() => typeof initialValues>;

  const onSubmit = async (_values: InitialValues) => {
    try {
      const response = await createTask(_values).unwrap();
      if (response?.data?.id) {
        dispatch(storeValues(_values));
        onClose();
        successToast(response.message || "Task added successfully")
      } else {
       errorToast(response.message || 'Something went wrong')
      }
    } catch (error) {
      const message = getErrorMessage(error)
      errorToast(message || 'Something went wrong')
    }
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
            <h3 className="app_auth_login__title mb-5">Add new task</h3>
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
                setFieldValue,
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
                    placeholder="Task Name"
                    size="xl"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />

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
                  />

                  <div className="flex flex-col gap-8 my-5">
                    <p className="text-[#6D6D6D]">Task Priority</p>
                    <div className="flex gap-2">
                      {Object.values(AccountType).map((priority) => (
                        <Pill
                          key={priority}
                          size="md"
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () =>
                            await setFieldValue('priority', priority)
                          }
                          active={values.priority === priority}
                          className="w-full"
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <select
                    name="deliverableId"
                    value={values.deliverableId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border rounded px-3 py-2"
                  >
                    <option value="">Select Deliverable</option>
                    {deliverables &&
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      deliverables.map((deliverables: any) =>
                        <option key={deliverables.id} value={deliverables.id}>
                          {deliverables.name}
                        </option>
                      )}
                  </select>

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
