import Image from 'next/image';
import projectManagement from '@/lib/assets/project-management';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pill } from '../../../pill';
import { useAppDispatch } from '@/store';
import {
  // useCreateDeliverableTaskMutation,
  useUpdateDeliverableTaskMutation,
} from '@/services';
import { storeValues } from '@/store/slices/project';
import { useParams } from 'next/navigation';
import { useGetTaskById } from '@/hooks/Projects/useProjects';
import { AccountType, priorityMap } from './edit-project-details';

interface IProps {
  onClose: () => void;
  projectId: string;
  deliverableId?: string;
  setDeliverableId: (id: string) => void;
  taskId?: string;
}

export function EditTaskCard(props: IProps) {
  const { deliverableId, taskId } = props;
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  const { onClose } = props;
  const dispatch = useAppDispatch();

  const [updateTask, { isLoading }] = useUpdateDeliverableTaskMutation();
  const { allTaskByIdData, refetchAllTasks } = useGetTaskById(projectId, deliverableId, taskId);
  const tasksData = allTaskByIdData?.data;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter a task name'),
    startDate: Yup.date().required('Please select a start date'),
    endDate: Yup.date().required('Please select a end date'),
    priority: Yup.string().required('Please select a priority'),
    deliverableId: Yup.string().required('Please select a deliverable'),
  });

  const initialValues = {
    name: tasksData?.name || '',
    startDate: tasksData?.startDate ? tasksData.startDate.split('T')[0] : '',
    endDate: tasksData?.endDate ? tasksData.endDate.split('T')[0] : '',
    priority:
      typeof tasksData?.priority === 'number'
        ? priorityMap[tasksData.priority]
        : AccountType.Low,
    deliverableId: tasksData?.id,
  };

  type InitialValues = ReturnType<() => typeof initialValues>;

  const onSubmit = async (values: InitialValues) => {
    try {
      const response = await updateTask({
        ...values,
        projectId,
        deliverableId,
        taskId,
      }).unwrap();
      if (response?.data?.id) {
        await refetchAllTasks();
        dispatch(storeValues(values));
        onClose();
      } else {
        console.warn('Project ID not found. Cannot proceed to next step.');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
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
            <h3 className="app_auth_login__title mb-5">Edit task</h3>
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

                  {/* <select
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
                  </select> */}

                  <input
                    type="hidden"
                    name="deliverableId"
                    value={values.deliverableId}
                    onChange={handleChange}
                  />

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
                      Update
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
