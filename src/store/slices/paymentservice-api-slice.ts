import {
  PAYMENT_SERVICE_BASE_API_URL,
  USER_SERVICE_BASE_API_URL,
} from '@/constants';
import { getCookie, handleLogoutRedirect, setCookie } from '@/utils';
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import axios from 'axios';

let refreshPromise: Promise<void> | null = null;

const baseQuery = fetchBaseQuery({
  baseUrl: `${PAYMENT_SERVICE_BASE_API_URL}`,
  credentials: 'same-origin',
  prepareHeaders: (headers) => {
    const token = getCookie('_tk');
    headers.set('Access-Control-Allow-Origin', '*');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
}) as BaseQueryFn<string | FetchArgs, unknown, unknown, object>;

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  // If a refresh is in progress, wait for it before proceeding with other api calls
  if (refreshPromise) {
    await refreshPromise;
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error as { status?: number }).status === 401) {
    const refreshToken = getCookie('_rtk');
    const expiredToken = getCookie('_tk');
    if (refreshToken) {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshResponse = await axios.post(
              `${USER_SERVICE_BASE_API_URL}/auth/refresh-token`,
              { expiredToken: expiredToken, refreshToken: refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((refreshResponse as any)?.isSuccess && refreshResponse?.data) {
              const { accessToken, refreshToken: newRefreshToken } =
                refreshResponse?.data;
              if (
                accessToken &&
                typeof accessToken === 'string' &&
                newRefreshToken &&
                typeof newRefreshToken === 'string'
              ) {
                setCookie('_tk', accessToken);
                setCookie('_rtk', newRefreshToken);
              } else {
                handleLogoutRedirect();
              }
            } else {
              handleLogoutRedirect();
            }
          } catch (error) {
            console.error(error);
            handleLogoutRedirect();
          } finally {
            refreshPromise = null;
          }
        })();
      }

      // Wait for the refresh to finish
      await refreshPromise;

      // Retry the original request with the new token
      const token = getCookie('_tk');
      const retryHeaders = new Headers(
        args && typeof args !== 'string' && args.headers instanceof Headers
          ? Array.from(args.headers.entries())
          : undefined,
      );

      if (token) {
        retryHeaders.set('Authorization', `Bearer ${token}`);
      }
      result = await baseQuery(
        {
          ...(typeof args === 'object' && args !== null ? args : {}),
          headers: retryHeaders,
          url:
            typeof args === 'object' && args !== null && 'url' in args
              ? args.url
              : '',
        },
        api,
        extraOptions,
      );
    } else {
      handleLogoutRedirect();
    }
  }

  if (result.error && (result.error as { status?: number }).status === 401) {
    handleLogoutRedirect();
  }
  return result;
};

export const paymentServiceApiSlice = createApi({
  reducerPath: 'payment-service-api-slice',
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
  tagTypes: ['MyWallet', 'Transactions'],
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
});
