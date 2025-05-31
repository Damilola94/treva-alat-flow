'use client';
import { Fragment, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedModal, Pill, RenderIf } from '@/components/shared';
import type { InitialStep1Values } from '@/app/creatives/dashboard/project-management/client-project/create/page';
import { AddClient } from '../../../client-management';
import { useClientManagement } from '@/hooks/Projects';
import { errorToast, successToast, useCreateProjectMutation } from '@/services';
import { useAppDispatch, useAppSelector } from '@/store';
import { storeValues, setCurrentStep } from '@/store/slices/project';
import { getErrorMessage } from '@/utils';

interface IProps {
  handleNext: (formData: InitialStep1Values) => void;
  setProjectId: (id: string) => void;
}

enum AccountType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export function ProjectDetails(props: IProps) {
  const { handleNext, setProjectId } = props;
  const dispatch = useAppDispatch();
  const {
    title,
    description,
    expectedDeliveryDate,
    priority,
    clientUserId,
    ...rest
  } = useAppSelector((state) => state?.project);
  // const projectValues = useAppSelector((state) => state.project.projectValues)
  console.log(rest, 'rest');

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Please enter a project title'),
    description: Yup.string().required('Please enter a project description'),
    expectedDeliveryDate: Yup.date()
      .min(new Date(), 'Expected delivery date must be in the future')
      .required('Please enter an expected delivery date'),
    priority: Yup.string().required('Please select a priority'),
    clientUserId: Yup.string().required('Please select a client'),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [params, setParams] = useState({
    birthday: '',
    birthmonth: '',
    pageNumber: 0,
    pageSize: 10,
    searchKey: '',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { myClientData, refetch } = useClientManagement(params);
  const [createProject, { isLoading: isSubmitting }] =
    useCreateProjectMutation();

  const clientData = useMemo(
    () => myClientData?.data || [],
    [myClientData?.data],
  );
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string | null>(null);

  const initialValues = {
    title: title,
    description: description,
    expectedDeliveryDate: expectedDeliveryDate,
    priority: priority,
    type: 'Client',
    clientUserId: clientUserId,
  };


  type InitialValues = ReturnType<() => typeof initialValues>;

  console.log(storeValues, 'store values');
  const onSubmit = async (_values: InitialValues) => {
    try {
      const response = await createProject(_values).unwrap();
      if (response?.data?.id) {
        successToast(response?.message || 'Project created successfully');
        dispatch(storeValues(_values));
        dispatch(setCurrentStep(2));
        setProjectId(response.data.id);
        handleNext(_values);
      } else {
        errorToast(response?.message || 'Failed to create project');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  const handleAddClientClick = () => {
    setIsAddClientModalOpen(true);
  };

  const handleCloseAddClientModal = () => {
    setIsAddClientModalOpen(false);
    void refetch();
  };

  return (
    <div className="app_get_started_professional_details flex flex-col gap-14 my-8">
      <div className="app_get_started_professional_details__form flex flex-col gap-2 !overflow-y-auto">
        <h3 className="app_get_started_professional_details__form__title !font-bold !lg:text-2xl text-lg">
          Project details
        </h3>
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({
              values,
              handleChange,
              setFieldValue,
              handleBlur,
              errors,
              touched,
            }) => (
              <Form className="flex flex-col gap-8">
                <div className="flex flex-col gap-8">
                  <div className="">
                    <Input
                      name="title"
                      type="text"
                      id="title"
                      placeholder="Project title"
                      size="xl"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <Input
                    name="description"
                    type="text"
                    id="description"
                    placeholder="Project description"
                    size="xl"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                  <div>
                    <label htmlFor="">Expected delivery date</label>
                    <Input
                      name="expectedDeliveryDate"
                      type="date"
                      id="expectedDeliveryDate"
                      placeholder="Expected delivery date"
                      size="xl"
                      value={values.expectedDeliveryDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8 my-5">
                  <p className="text-[#6D6D6D]">Project Priority</p>
                  <div className="flex gap-2">
                    <Pill
                      size="md"
                      onClick={() =>
                        // eslint-disable-next-line no-void
                        void setFieldValue('priority', AccountType.Low)
                      }
                      active={values.priority === AccountType.Low}
                      className="w-full"
                    >
                      Low
                    </Pill>
                    <Pill
                      size="md"
                      onClick={() =>
                        // eslint-disable-next-line no-void
                        void setFieldValue('priority', AccountType.Medium)
                      }
                      active={values.priority === AccountType.Medium}
                      className="w-full"
                    >
                      Medium
                    </Pill>
                    <Pill
                      size="md"
                      onClick={() =>
                        // eslint-disable-next-line no-void
                        void setFieldValue('priority', AccountType.High)
                      }
                      active={values.priority === AccountType.High}
                      className="w-full"
                    >
                      High
                    </Pill>
                  </div>
                </div>
                <div className="relative w-full">
                  <select
                    name="clientUserId"
                    value={values.clientUserId ?? ''}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (value === 'new-client') {
                        handleAddClientClick();
                      } else {
                        setSelected(value);
                        void setFieldValue('clientUserId', value);
                      }
                    }}
                    className="w-full border-b-[#d1d5db] p-2 focus:ring-1 focus:ring-[#7B37F0] bg-white text-left"
                  >
                    <option value="" disabled>
                      Select client
                    </option>
                    {clientData?.map((item) => (
                      <option
                        key={item.clientUserId ?? ''}
                        value={item.clientUserId ?? ''}
                      >
                        {item.name}
                      </option>
                    ))}
                    <option value="new-client" className="text-blue-400">
                      {' '}
                      + Add new client
                    </option>
                  </select>
                </div>
                <RenderIf condition={!!errors.clientUserId}>
                  <div>
                    <p className="app_input_con__spt--error">
                      {errors.clientUserId}
                    </p>
                  </div>
                </RenderIf>
                <div className="">
                  <Button
                    type="submit"
                    size="md"
                    isLoading={isSubmitting}
                    backgroundColor="primary-blue-500"
                    className="w-1/2 app_auth_login__btn flex items-center justify-center gap-2"
                  >
                    Save and Continue
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <RenderIf condition={isAddClientModalOpen}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'right',
              onClose: handleCloseAddClientModal,
              className:
                'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2',
            }}
          >
            <AddClient onClose={handleCloseAddClientModal} />
          </AnimatedModal>
        </Fragment>
      </RenderIf>
    </div>
  );
}
