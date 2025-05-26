import {
  errorToast,
  successToast,
  useAddClientMutation,
  useGetMyClientsQuery,
  useUpdateClientMutation,
} from '@/services';
import { useAppSelector } from '@/store';
import { ITrevaProjectService } from '@/types';
import { getErrorMessage } from '@/utils';
import { useMemo, useState } from 'react';

interface IParams {
  birthday?: string;
  birthmonth?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

interface IAddClient {
  name?: string | null;
  email?: string | null;
  phoneNumber?: string;
  avatar?: File | null;
  birthMonth?: string | null;
  birthDay?: number | null;
}

const useClientManagement = (params?: IParams) => {
  const { loggedIn, role } = useAppSelector((state) => state?.auth);
  const [addClientResponse, setAddClientResponse] =
    useState<ITrevaProjectService['schemas']['MyClientModelBaseResponse']>();

  // Filter params
  const filteredParams = useMemo(() => {
    return Object.fromEntries(
      Object.entries(params ?? {}).filter(
        ([, value]) => value !== null && value !== '' && value !== 0,
      ),
    );
  }, [params]);

  const {
    data: myClientData,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetMyClientsQuery(filteredParams, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn || !role?.includes('Creative'),
  });

  const [triggerAddClient, { isLoading: addClientLoading }] =
    useAddClientMutation();
  const [triggerUpdateClient, { isLoading: updateClientLoading }] =
    useUpdateClientMutation();

  const addClient = async (payload: IAddClient) => {
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
      const response = await triggerAddClient(formData).unwrap();

      if (response?.isSuccess) {
        successToast(response?.message || 'Client Addedd Successfully');
        setAddClientResponse(response);
        refetch();
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  const updateClient = async (payload: IAddClient) => {
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
      const response = await triggerUpdateClient(formData).unwrap();

      if (response?.isSuccess) {
        successToast(response?.message || 'Client Addedd Successfully');
        setAddClientResponse(response);
        refetch();
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  return {
    addClientResponse,
    addClient,
    updateClient,
    myClientData,
    loading: isFetching || isLoading || addClientLoading || updateClientLoading,
    error,
    isError,
    refetch,
  };
};

export default useClientManagement;
