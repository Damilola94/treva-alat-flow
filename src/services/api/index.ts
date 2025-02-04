import axios from 'axios'
import config from '@/lib/config'
import axiosInstance from '../axiosConfig'

const { baseUrl } = config

export interface Request {
  url: string
  useMock?: boolean
  mockData?: any
  body?: any
  auth?: boolean
  headers?: Record<string, string>
}

const del = async ({ url, body: data }: Request) => (await axiosInstance.delete(url, {
  data
})).data

const get = async ({ url, auth = true, ...req }: Request) => {
  if (req.useMock) {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Success!')
      }, 1500)
    })

    await promise

    try {
      const data = (await (auth ? axiosInstance.get(url) : axios.get(baseUrl + url))).data
      return req.mockData ?? data
    } catch (error) {
      return req.mockData
    }
  }

  return (await (auth ? axiosInstance.get(url) : axios.get(baseUrl + url))).data
}

const post = async ({ url, body, auth = true, headers = {}, ...req }: Request) => {
  const options = {
    headers: {
      ...headers // Merge passed headers with any defaults
    }
  };

  if (req.useMock) {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Success!');
      }, 1500);
    });

    await promise;

    try {
      const data = (await (auth ? axiosInstance.get(url) : axios.get(baseUrl + url))).data;
      return req.mockData ?? data;
    } catch (error) {
      return req.mockData;
    }
  }

  // Send request with the appropriate headers
  return (await (auth ? axiosInstance.post(url, body, options) : axios.post(baseUrl + url, body, options))).data;
};

const patch = async ({ url, body }: Request) => (await axiosInstance.patch(url, body)).data

// const put = async ({ url, body }: Request) => (await axiosInstance.put(url, body)).data

const put = async ({ url, body, headers = {} }: Request) => {
  return (await axiosInstance.put(url, body, {
    headers: {
      ...headers // Merge passed headers to ensure multipart/form-data works
    }
  })).data;
};

const api = {
  delete: del,
  get,
  patch,
  post,
  put
}

export default api
