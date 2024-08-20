import { useQuery } from 'react-query'
import api from '../../../api'
import { errorToast, handleErrors } from '../../../helper'
import queryKey from './keys'
import { type AxiosError } from 'axios'
import { type ApiResponse } from '@/lib/models'
import { type Demographic } from './types'
import featureFlags from '@/lib/feature-flags'
import config from '@/lib/config'
import { mock } from './mock'

const BASE_URL = config.services.customerManagement + '/v1/customers/demographics'

const useRead = (options = { ...config.pagination, SearchQuery: '' }) => {
  const url = BASE_URL

  const response = useQuery([queryKey.read], async () => await api.get({ url, mockData: mock, useMock: featureFlags.MOCK_DATA_ENABLED }), {
    ...options,
    onSuccess: () => {},
    onError: (err: AxiosError) => { errorToast(handleErrors(err)) }
  })

  return {
    ...response,
    data: (response.data) as ApiResponse<Demographic[]> | undefined
  }
}

const queries = { read: useRead }

export default queries
