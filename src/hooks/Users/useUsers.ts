import {
  errorToast,
  successToast,
  useGetClientOnboardingQuery,
  useGetCreativeOnboardingQuery,
  useSaveClientOnboardingMutation,
  useSaveCreativeOnboardingMutation,
  useUpdateUserProfileMutation,
} from '@/services';
import { useAppSelector } from '@/store';
import { getErrorMessage } from '@/utils';
import { useState } from 'react';

interface ISaveClientOnboaring {
  photo?: File | null;
  stateId?: string;
  cityId?: string;
  address?: string;
  websiteUrl?: string;
  linkedIn?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
  tikTok?: string;
  bio?: string;
  currentStep?: number;
}

interface ISaveCreativeOnboaring {
  cv?: File | null;
  portfolioLink?: string;
  linkedIn?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
  tikTok?: string;
  bio?: string;
  currentStep?: number;
  subscriptionId?: string;
}

interface ISaveOnboardingResponse {
  isSuccess?: boolean;
  statusCode?: string | null;
  message?: string | null;
  data?: Record<string, unknown>;
  metaData?: unknown;
}

interface IUpdateUserProfile {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phoneNumber?: string;
  bio?: string;
  portfolioLink?: string;
  websiteUrl?: string;
  picture?: string;
  allowInAppNotifications?: boolean;
  allowEmailNotifications?: boolean;
  allowPushNotifications?: boolean;
}

const useUsers = () => {
  const { loggedIn, role } = useAppSelector((state) => state?.auth);
  const [saveOnboardingResponse, setSaveOnboardingResponse] = useState<
    ISaveOnboardingResponse | undefined
  >(undefined);
  const [updateResponse, setUpdateResponse] = useState('');

  const {
    data: userOnboardingData,
    isLoading: userOnboardingLoading,
    isFetching: userOnboardingFetching,
    refetch: refetchUserOnboardingData,
  } = useGetClientOnboardingQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn || !role?.includes('Client'),
  });

  const {
    data: creativeOnboardingData,
    isLoading: creativeLoading,
    isFetching: creativeOnboardingFetching,
    // refetch: refetchCreativeOnboardingData,
  } = useGetCreativeOnboardingQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn || !role?.includes('Creative'),
  });

  const [triggerSaveClientOnboarding, { isLoading }] =
    useSaveClientOnboardingMutation();
  const [
    triggerSaveCreativeOnboarding,
    { isLoading: creativeOnboardingLoading },
  ] = useSaveCreativeOnboardingMutation();
  const [triggerUpdateProfile, { isLoading: updateProfileLoading }] =
    useUpdateUserProfileMutation();

  const saveClientOnboarding = async (payload: ISaveClientOnboaring) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Convert number to string
          if (typeof value === 'number') {
            formData.append(key, value.toString());
          }
          // Allow File/Blob to be appended as is
          else {
            formData.append(key, value);
          }
        }
      });
      const response = await triggerSaveClientOnboarding(formData).unwrap();

      if (response?.isSuccess) {
        successToast(response?.message || 'Details Saved Successfully');
        setSaveOnboardingResponse(response);
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  const saveCreativeOnboarding = async (payload: ISaveCreativeOnboaring) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Convert number to string
          if (typeof value === 'number') {
            formData.append(key, value.toString());
          }
          // Allow File/Blob to be appended as is
          else {
            formData.append(key, value);
          }
        }
      });
      const response = await triggerSaveCreativeOnboarding(formData).unwrap();

      if (response?.isSuccess) {
        successToast(response?.message || 'Details Saved Successfully');
        setSaveOnboardingResponse(response);
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  const updateProfileDetails = async (payload: IUpdateUserProfile) => {
    try {
      setUpdateResponse('');
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        const isFile = value instanceof Blob;

        if (
          (typeof value === 'string' && value.trim() !== '') ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          isFile
        ) {
          formData.append(
            key,
            typeof value === 'boolean' || typeof value === 'number'
              ? value.toString()
              : value,
          );
        }
      });

      const response = await triggerUpdateProfile(formData).unwrap();

      if (response?.isSuccess) {
        successToast(response?.message || 'Details Saved Successfully');
        setUpdateResponse('success');
      } else {
        errorToast(response?.message || 'Something went wrong');
        setUpdateResponse('');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
      setUpdateResponse('');
    }
  };

  return {
    userOnboardingData,
    creativeOnboardingData,
    saveOnboardingResponse,
    loading:
      userOnboardingFetching ||
      userOnboardingLoading ||
      isLoading ||
      creativeOnboardingLoading ||
      creativeLoading ||
      updateProfileLoading ||
      creativeOnboardingFetching,
    refetchUserOnboardingData,
    saveClientOnboarding,
    saveCreativeOnboarding,
    updateProfileDetails,
    updateResponse,
  };
};

export default useUsers;
