import { useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import {
  errorToast,
  handleErrors,
  successToast
} from '../../helper';
import queryKey from './keys';
import { type AxiosError } from 'axios';
import config from '@/lib/config';
import { type ApiResponse } from '@/lib/models';
import { type ClientManagement } from './types';

const BASE_URL = config.services;

const useCreate = (options = {}) => {
  const { mutate, ...response } = useMutation(api.post, {
    mutationKey: [queryKey.create],
    ...options,
    onSuccess: () => {
      successToast('Client added successfully');
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err));
    }
  });

  interface Body {
    fullName: string
    emailAddress: string
    phoneNumber: string
    birthday: string
    image: File | null
  }

  return {
    ...response,
    mutate: (body: Body) => {
      const formData = new FormData()
      formData.append('FullName', body.fullName)
      formData.append('EmailAddress', body.emailAddress)
      formData.append('PhoneNumber', body.phoneNumber)
      formData.append('Birthday', body.birthday)
      if (body.image) {
        formData.append('Image', body.image);
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      mutate({
        url: `${BASE_URL.clientManagement}`,
        body: formData,
        ...config
      });
    }
  };
};

const useRead = (options = {}) => {
  const response = useQuery(
    [queryKey.read],
    async () => await api.get({ url: `${BASE_URL.clientManagement}`, auth: true }),
    {
      ...options,
      onSuccess: () => { },
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err))
      }
    }
  );

  return {
    ...response,
    data: (response.data) as ApiResponse<ClientManagement> | undefined

  }
};

const useUpdate = (options: { onSuccess: () => void }) => {
  const {
    onSuccess = () => { }
  } = options
  const queryClient = useQueryClient()

  const { mutate, ...response } = useMutation(api.put, {
    mutationKey: [queryKey.update],
    ...options,
    onSuccess: async () => {
      onSuccess()
      await queryClient.invalidateQueries({
        queryKey: [queryKey.read]
      })
      successToast('Client updated')
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })

  interface Body {
    id: string
    fullName: string
    emailAddress: string
    phoneNumber: string
    birthday: string
    image: File | null
  }

  return {
    ...response,
    mutate: (body: Body) => {
      const formData = new FormData()
      formData.append('FullName', body.fullName)
      formData.append('EmailAddress', body.emailAddress)
      formData.append('PhoneNumber', body.phoneNumber)
      formData.append('Birthday', body.birthday)
      formData.append('ClientId', body.id)

      if (body.image) {
        formData.append('Image', body.image)
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      mutate({
        url: `${BASE_URL.clientManagement}/clients/${body.id}`,
        body: formData,
        ...config
      });
    }
  }
}

const useDelete = (options = { onSuccess: () => { } }) => {
  const queryClient = useQueryClient()

  const { mutate, ...response } = useMutation(api.delete, {
    mutationKey: [queryKey.delete],
    ...options,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKey.read]
      })
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })
  return {
    ...response,
    mutate: (clientId: string) => {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      mutate({
        url: `${BASE_URL.clientManagement}/clients/${clientId}`,
        ...config
      })
    }
  }
}

const queries = { create: useCreate, read: useRead, update: useUpdate, delete: useDelete };

export default queries;
