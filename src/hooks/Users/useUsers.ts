import {
  errorToast,
  successToast,
  useGetClientOnboardingQuery,
  useGetCreativeOnboardingQuery,
  useSaveClientOnboardingMutation,
  useSaveCreativeOnboardingMutation,
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

const useUsers = () => {
  const { loggedIn, role } = useAppSelector((state) => state?.auth);
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
      creativeOnboardingFetching,
    refetchUserOnboardingData,
    saveClientOnboarding,
    saveCreativeOnboarding,
  };
};

export default useUsers;
