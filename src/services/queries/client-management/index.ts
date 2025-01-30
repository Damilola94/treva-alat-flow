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

const useCreate = (options = { onSuccess: () => { } }) => {
  const queryClient = useQueryClient()
  const { mutate, ...response } = useMutation(api.post, {
    mutationKey: [queryKey.create],
    ...options,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKey.read]
      })

      options.onSuccess()
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
      const formData = new FormData()
      formData.append('FullName', body.fullName)
      formData.append('EmailAddress', body.emailAddress)
      formData.append('PhoneNumber', body.phoneNumber)
      formData.append('Birthday', body.birthday)
      if (body.image) {
        formData.append('Image', body.image);
      }
      console.log(formData, 'form data');
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

const queries = { create: useCreate, read: useRead, update: useUpdate, delete: useDelete };

export default queries;
