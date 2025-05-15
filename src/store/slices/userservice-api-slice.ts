import { USER_SERVICE_BASE_API_URL } from '@/constants';
import { getCookie, handleLogoutRedirect } from '@/utils';
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: `${USER_SERVICE_BASE_API_URL}`,
  credentials: 'same-origin',
  prepareHeaders: (headers) => {
    const token = getCookie('_tk');
    headers.set('Access-Control-Allow-Origin', '*');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  validateStatus: (response) => {
    if (
      response.status === 401 &&
      (window.location.pathname !== '/auth/sign-in')
    ) {
      if (typeof globalThis.window !== 'undefined') {
        handleLogoutRedirect();
      }
    }

    return true;
  },
}) as BaseQueryFn<string | FetchArgs, unknown, unknown, object>;

export const userServiceApiSlice = createApi({
  reducerPath: 'user-service-api-slice',
  baseQuery,
  endpoints: () => ({}),
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
});
