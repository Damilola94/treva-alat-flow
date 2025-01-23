import { useMutation, useQuery } from 'react-query';

import api from '../../api';
import {
  errorToast,
  handleErrors,
  setLocalStorage,
  successToast
} from '../../helper';
import queryKey from './keys';
import routes from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { type AxiosError } from 'axios';
import { type Request } from '../../api';
import { getMockApiData } from '@/lib/utils';
import { type CreateUserBody } from './types';
import config from '@/lib/config';

const mock = {
  email: 'ayobami.aladenoye+streak@wemabank.com',
  userName: 'bambam',
  accessToken: 'string',
  refreshToken: 'string'
};

const BASE_URL = config.services;

const useCreate = (options = {}) => {
  const { mutate, ...response } = useMutation(api.post, {
    mutationKey: [queryKey.create],
    ...options,
    onSuccess: (data) => {
      console.log(data, 'datadatadatadata');

      successToast('Verification mail sent');
      setLocalStorage(config.tokenKey, data?.fullName);
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err));
    }
  });

  return {
    ...response,
    mutate: (body: CreateUserBody) => {
      mutate({
        url: `${BASE_URL.onboarding}/create-account`,
        body,
        auth: false
      });
    }
  };
};

const useLogin = (options = {}) => {
  const router = useRouter();

  const { mutate, ...response } = useMutation(
    async (args: Request) => {
      return await api.post(args);
    },
    {
      mutationKey: [queryKey.login],
      ...options,
      onSuccess: (data) => {
        if (data.statusCode === '200') {
          setLocalStorage(config.tokenKey, data?.responseData);
          successToast('Sign in successful');
          setTimeout(() => {
            router.push(routes.dashboard.entry.path);
          }, 1000);
        }
      },
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err));
      }
    }
  );
  return {
    ...response,
    mutate: (body: any) => {
      mutate({
        url: `${BASE_URL.auth}/login`,
        body,
        mockData: getMockApiData(mock),
        auth: false
      });
    }
  };
};

const useRead = (options = {}) => {
  const response = useQuery(
    [queryKey.read],
    async () => await api.get({ url: `${BASE_URL.professions}` }),
    {
      ...options,
      onSuccess: () => {},
      onError: () => {}
    }
  );

  return response;
};

const queries = { create: useCreate, login: useLogin, read: useRead };

export default queries;
