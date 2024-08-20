import { useQuery } from 'react-query'
import api from '../../api'
import { errorToast, getLocalStorage, handleErrors } from '../../helper'
import queryKey from './keys'
import { type AxiosError } from 'axios'
import config from '@/lib/config'
import { type UserProfile } from './types'

const BASE_URL = '/v1/users'

const useReadOne = (options = {}) => {
  const response = useQuery([queryKey.readOne], async () => await api.get({ url: `${BASE_URL}/profile` }), {
    ...options,
    refetchOnWindowFocus: false,
    onSuccess: () => {},
    onError: (err: AxiosError) => { false && errorToast(handleErrors(err)) }
  })

  const userDetails = getLocalStorage(config.tokenKey)

  if (userDetails?.accessToken) delete userDetails.accessToken
  if (userDetails?.refreshToken) delete userDetails.refreshToken

  return {
    ...response,
    data: (response.data?.responseData ?? userDetails ?? {}) as UserProfile | undefined
  }
}

const queries = { readOne: useReadOne }

export default queries
