import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getLocalStorage, setLocalStorage } from './helper';
// import routes from '@/lib/routes'
import config from '@/lib/config';

const baseURL = config.baseUrl;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  },
});

export const refreshToken = async (originalRequest: AxiosRequestConfig) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = getLocalStorage(config.tokenKey);

    const url = `${baseURL}/auth/refresh-token`;

    const response = await axios.post(url, {
      expiredToken: token?.accessToken,
      refreshToken: token?.refreshToken,
    });

    const { data } = response;

    if (data.status === 200) {
      setLocalStorage(config.tokenKey, data.data);

      if (originalRequest && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${
          data.data?.jwToken || data.data?.accessToken
        }`;
      }

      return await axios(originalRequest);
    }

    return await Promise.reject(response);
  } catch (error) {
    return await Promise.reject(error);
  }
};

const decodeJwt = (jwt: string) => {
  try {
    return JSON.parse(atob(jwt.split('.')[1]));
  } catch (error) {
    return { sessionId: '' };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onRequest = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: InternalAxiosRequestConfig<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): InternalAxiosRequestConfig<any> => {
  const token = getLocalStorage(config.tokenKey);
  const jwt = token?.accessToken || '';
  const { sessionId } = decodeJwt(jwt as string);

  if (!request.headers) return request;

  request.headers.Authorization = `Bearer ${jwt}`;
  request.headers.signature = sessionId;

  return request;
};

const onRequestError = async (error: AxiosError): Promise<AxiosError> => {
  return await Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = async (error: AxiosError) => {
  const originalRequest = error.config;
  const statusCode = error.response?.status;

  if (statusCode === 401 && originalRequest) {
    try {
      return await refreshToken(originalRequest);
    } catch (refreshError) {
      return await Promise.reject(refreshError);
    }
  }

  return await Promise.reject(error);
};

// https://axios-http.com/docs/interceptors
axiosInstance.interceptors.request.use(onRequest, onRequestError);
axiosInstance.interceptors.response.use(onResponse, onResponseError);

export default axiosInstance;
