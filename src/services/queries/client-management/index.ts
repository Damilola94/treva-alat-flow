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

const useCreate = (options: { onSuccess: () => void }) => {
  const {
    onSuccess = () => {}
  } = options
  const queryClient = useQueryClient()
  const { mutate, ...response } = useMutation(api.post, {
    mutationKey: [queryKey.create],
    ...options,
    onSuccess: async () => {
      onSuccess()
      await queryClient.invalidateQueries({
        queryKey: [queryKey.read]
      })

      successToast('Client added')
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })

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
      const formData = new FormData();
      formData.append('FullName', body.fullName);
      formData.append('EmailAddress', body.emailAddress);
      formData.append('PhoneNumber', body.phoneNumber);
      formData.append('Birthday', body.birthday);

      if (body.image instanceof File) {
        formData.append('Image', body.image);
      } else {
        throw new Error('Image is required and must be a valid file');
      }

      mutate({
        url: `${BASE_URL.clientManagement}`,
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  };
};

const useRead = ({ pageNumber = 1, pageSize = 50 } = {}, options = {}) => {
  const response = useQuery(
    [queryKey.read, pageNumber, pageSize],
    async () => {
      const queryParams = new URLSearchParams()
      queryParams.append('PageNumber', pageNumber.toString())
      queryParams.append('PageSize', pageSize.toString())

      const url = `${BASE_URL.clientManagement}?${queryParams.toString()}`
      return await api.get({ url })
    },
    {
      ...options,
      onSuccess: () => {},
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err))
      }
    }
  )

  return {
    ...response,
    data: (response.data || undefined) as ApiResponse<ClientManagement[]> | undefined,
    metaData: response.data?.metaData
  }
}

const useReadOne = ({ clientId = '', pageNumber = 1, pageSize = 50 } = {}, options = {}) => {
  const url = `${BASE_URL.clientManagement}/${clientId}`

  const response = useQuery(
    [queryKey.readOne, clientId, pageNumber, pageSize], async () => await api.get({ url }),
    {
      ...options,
      enabled: !!clientId,
      onSuccess: () => {},
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err))
      }
    }
  )

  return {
    ...response,
    data: response.data ? (response.data as ClientManagement) : undefined,
    metaData: response.data?.metaData
  }
}

const useUpdate = (options: { onSuccess: () => void }) => {
  const {
    onSuccess = () => {}
  } = options
  const queryClient = useQueryClient()
  const { mutate, ...response } = useMutation(api.put, {
    mutationKey: [queryKey.create],
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

      if (body.image instanceof File) {
        formData.append('Image', body.image);
      } else {
        throw new Error('Image is required and must be a valid file');
      }

      mutate({
        url: `${BASE_URL.clientManagement}/${body.id}`,
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
  }
}

const useDelete = (options: { onSuccess: () => void }) => {
  const {
    onSuccess = () => {}
  } = options
  const queryClient = useQueryClient()

  const { mutate, ...response } = useMutation(api.delete, {
    mutationKey: [queryKey.delete],
    ...options,
    onSuccess: async () => {
      onSuccess()
      await queryClient.invalidateQueries({
        queryKey: [queryKey.read]
      })
      successToast('Client deleted')
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
          'Content-Type': 'application/json'
        }
      }

      mutate({
        url: `${BASE_URL.clientManagement}/${clientId}`,
        ...config
      })
    }
  }
}

const queries = { create: useCreate, read: useRead, update: useUpdate, delete: useDelete, readone: useReadOne };

export default queries;
