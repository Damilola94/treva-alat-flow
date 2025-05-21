import {
  errorToast,
  successToast,
  useGetClientOnboardingQuery,
  useSaveClientOnboardingMutation,
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

interface ISaveOnboardingResponse {
  isSuccess?: boolean;
  statusCode?: string | null;
  message?: string | null;
  data?: Record<string, unknown>;
  metaData?: unknown;
}

const useUsers = () => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  const [saveOnboardingResponse, setSaveOnboardingResponse] = useState<
    ISaveOnboardingResponse | undefined
  >(undefined);

  const {
    data: userOnboardingData,
    isLoading: userOnboardingLoading,
    isFetching: userOnboardingFetching,
    refetch: refetchUserOnboardingData,
  } = useGetClientOnboardingQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  const [triggerSaveClientOnboarding, { isLoading }] =
    useSaveClientOnboardingMutation();

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

  return {
    userOnboardingData,
    saveOnboardingResponse,
    loading: userOnboardingFetching || userOnboardingLoading || isLoading,
    refetchUserOnboardingData,
    saveClientOnboarding,
  };
};

export default useUsers;
