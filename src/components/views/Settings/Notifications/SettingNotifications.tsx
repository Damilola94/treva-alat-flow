'use client';
import { Button } from '@/components/ui/button';
import { useProfile, useUsers } from '@/hooks/Users';
import { handleErrors } from '@/services';
import { useFormik } from 'formik';
import { useEffect, useMemo } from 'react';

const SettingNotification = () => {
  const { data, refetch } = useProfile();
  const { updateProfileDetails, loading, updateResponse } = useUsers();
  const userData = useMemo(() => data?.data || null, [data]);

  const formik = useFormik({
    initialValues: {
      allowInAppNotifications: userData?.allowInAppNotifications || false,
      allowEmailNotifications: userData?.allowEmailNotifications || false,
      allowPushNotifications: userData?.allowPushNotifications || false,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      try {
        updateProfileDetails(values);
      } catch (error) {
        handleErrors(error);
      } finally {
        refetch && refetch();
      }
    },
  });

  useEffect(() => {
    if (updateResponse === 'success') {
      refetch && refetch();
    }
  }, [updateResponse]);

  console.log(formik.values);

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="font-bold">Notifications</h2>

      <div className="flex items-center justify-between mb-8 mt-12">
        <p className="flex flex-col font-bold text-[#262626]">
          In-App Notifications
          <span className="text-[#939393] text-sm font-normal">
            Show alerts in the Treva app interface
          </span>
        </p>
        <button
          type="button"
          onClick={() =>
            formik.setFieldValue(
              'allowInAppNotifications',
              !formik.values.allowInAppNotifications,
            )
          }
          className={`w-10 h-6 rounded-full p-1 flex items-center transition-all ${
            formik.values.allowInAppNotifications
              ? 'bg-[#4BA8E6] justify-end'
              : 'bg-[#C8C8C8] justify-start'
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <p className="flex flex-col font-bold text-[#262626]">
          Email Notifications
          <span className="text-[#939393] text-sm font-normal">
            Get updates via email
          </span>
        </p>
        <button
          type="button"
          onClick={() =>
            formik.setFieldValue(
              'allowEmailNotifications',
              !formik.values.allowEmailNotifications,
            )
          }
          className={`w-10 h-6 rounded-full p-1 flex items-center transition-all ${
            formik.values.allowEmailNotifications
              ? 'bg-[#4BA8E6] justify-end'
              : 'bg-[#C8C8C8] justify-start'
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="flex flex-col font-bold text-[#262626]">
          Push Notifications
          <span className="text-[#939393] text-sm font-normal">
            Real-time pop-up notifications
          </span>
        </p>
        <button
          type="button"
          onClick={() =>
            formik.setFieldValue(
              'allowPushNotifications',
              !formik.values.allowPushNotifications,
            )
          }
          className={`w-10 h-6 rounded-full p-1 flex items-center transition-all ${
            formik.values.allowPushNotifications
              ? 'bg-[#4BA8E6] justify-end'
              : 'bg-[#C8C8C8] justify-start'
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </button>
      </div>

      <div className="flex justify-end mt-14">
        <Button
          type="submit"
          className="app_auth_login__btn"
          size="md"
          backgroundColor="primary-blue-500"
          isLoading={loading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default SettingNotification;
