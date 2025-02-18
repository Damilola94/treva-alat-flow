import Image from 'next/image'
import projectManagement from '@/lib/assets/project-management'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pill } from '../../pill'
import queries from '@/services/queries/projects'

interface IProps {
  onClose: () => void
  projectId: string
  setDeliverableId: (id: string) => void
}

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

const validationSchema = Yup.object().shape({
  taskName: Yup.string().required('Please enter a task name'),
  startDate: Yup.date().required('Please select a start date'),
  dueDate: Yup.date().required('Please select a due date'),
  taskPriority: Yup.string().required('Please select a priority')
})

export function CreateTaskCard (props: IProps) {
  const { onClose, projectId, setDeliverableId } = props

  const initialValues = {
    projectId,
    taskName: '',
    startDate: '',
    dueDate: '',
    taskPriority: AccountType.Low as `${AccountType}`
  }

  const { mutate, isLoading } = queries.createTasks({
    onSuccess: (response) => {
      if (response?.data?.id) {
        const deliverableId = response.data.id
        setDeliverableId(deliverableId)
      } else {
        console.warn('Task ID not found in response')
      }
      onClose()
    }
  })

  const onSubmit = (values: typeof initialValues) => {
    mutate(values)
  }

  return (
    <div className="app_auth_login_container relative">
      <Image src={projectManagement.topGradient || '/placeholder.svg'} alt="top gradient" className="w-full" />
      <div className="app_auth_login_container__upper !-mt-80">
        <div className="app_auth_login">
          <div>
            <h3 className="app_auth_login__title mb-5">Add new task</h3>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
              {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched }) => (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-14">
                  <Input
                    name="taskName"
                    type="text"
                    placeholder="Task Name"
                    size="xl"
                    value={values.taskName}
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

                  <div className="flex flex-col gap-8 my-5">
                    <p className="text-[#6D6D6D]">Task Priority</p>
                    <div className="flex gap-2">
                      {Object.values(AccountType).map((priority) => (
                        <Pill
                          key={priority}
                          size="md"
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () => await setFieldValue('taskPriority', priority)}
                          active={values.taskPriority === priority}
                          className="w-full"
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </Pill>
                      ))}
                    </div>
                  </div>

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
  )
}
