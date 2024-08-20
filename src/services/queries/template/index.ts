import { useMutation, useQuery } from 'react-query'
import api from '../../api'
import { errorToast, handleErrors, successToast } from '../../helper'
import queryKey from './keys'
import { type AxiosError } from 'axios'

const BASE_URL = '/template'

const useCreate = (options = {}) => {
  const {
    mutate, ...response
  } = useMutation(api.post, {
    mutationKey: [queryKey.create],
    ...options,
    onSuccess: () => {
      successToast('')
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })
  return {
    ...response,
    mutate: (body: any) => { mutate({ url: `${BASE_URL}`, body }) }
  }
}

const useRead = (options = {}) => {
  const response = useQuery([queryKey.read], async () => await api.get({ url: `${BASE_URL}` }), {
    ...options,
    onSuccess: () => {},
    onError: () => {}
  })

  return response
}

const queries = { create: useCreate, read: useRead }

export default queries
