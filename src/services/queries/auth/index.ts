import { useMutation } from 'react-query'

import api from '../../api'
import {
  errorToast, handleErrors, setLocalStorage, successToast
} from '../../helper'
import queryKey from './keys'
import routes from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { type AxiosError } from 'axios'
import { type Request } from '../../api'
import { getMockApiData } from '@/lib/utils'
import featureFlags from '@/lib/feature-flags'
import config from '@/lib/config'

const mock = { email: 'ayobami.aladenoye+streak@wemabank.com', userName: 'bambam', accessToken: 'string', refreshToken: 'string' }

const BASE_URL = config.services.onboarding + '/v1/users'

const useLogin = (options = {}) => {
  const router = useRouter()

  const {
    mutate, ...response
  } = useMutation(async (args: Request) => {
    return await api.post(args)
  }, {
    mutationKey: [queryKey.login],
    ...options,
    onSuccess: (data) => {
      setLocalStorage(config.tokenKey, data?.responseData)

      successToast('Sign in successful')

      setTimeout(() => { router.push(routes.dashboard.entry.path) }, 1000)
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })
  return {
    ...response,
    mutate: (body: any) => { mutate({ url: `${BASE_URL}/login`, body, mockData: getMockApiData(mock), useMock: featureFlags.MOCK_DATA_ENABLED, auth: false }) }
  }
}

const queries = { login: useLogin }

export default queries
