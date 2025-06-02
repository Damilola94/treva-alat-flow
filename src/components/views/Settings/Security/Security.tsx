'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  errorToast,
  successToast,
  useChangePasswordMutation,
} from '@/services';
import { getErrorMessage } from '@/utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('CurrentPassword is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Security = () => {
  const [triggerChangePassword, { isLoading }] = useChangePasswordMutation();
  const initialValues = {
    currentPassword: '',
    newPassword: '.',
    confirmNewPassword: '.',
  };
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        const response = await triggerChangePassword(values).unwrap();
        if (response?.isSuccess) {
          successToast(response?.data || 'Password changed successfully');
        } else {
          errorToast(response?.message || getErrorMessage(response));
        }
      } catch (error) {
        errorToast(getErrorMessage(error));
      }
    },
    validationSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    isValid,
    dirty,
    touched,
    errors,
  } = formik;

  return (
    <div>
      <h2 className="mb-8">Set new password</h2>
      <div className="mb-10 max-w-sm">
        <Input
          name="currentPassword"
          type="password"
          placeholder="Current password"
          value={values.currentPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="mb-10 max-w-sm">
        <Input
          name="newPassword"
          type="password"
          placeholder="New password"
          value={values.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="mb-10 max-w-sm">
        <Input
          placeholder="Confirm password"
          type="password"
          name="confirmNewPassword"
          value={values.confirmNewPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="flex justify-end">
        <Button
          className="app_auth_login__btn"
          size="md"
          backgroundColor="primary-blue-500"
          onClick={() => handleSubmit()}
          disabled={!(dirty && isValid)}
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Security;
