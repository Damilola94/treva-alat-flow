import { useQuery } from 'react-query'
import api from '../../../api'
import { errorToast, handleErrors } from '../../../helper'
import queryKey from './keys'
import { type AxiosError } from 'axios'
import { type ApiResponse } from '@/lib/models'
import { type TransactionSummary } from './types'
import featureFlags from '@/lib/feature-flags'
import config from '@/lib/config'
import { mock } from './mock'

const BASE_URL = config.services.accountManagement + '/v1/accounts/transact-summary'

const useRead = (options = {}) => {
  const url = BASE_URL

  const response = useQuery([queryKey.read], async () => await api.get({ url, mockData: mock, useMock: featureFlags.MOCK_DATA_ENABLED }), {
    ...options,
    onSuccess: () => {},
    onError: (err: AxiosError) => { errorToast(handleErrors(err)) }
  })

  return {
    ...response,
    data: (response.data) as ApiResponse<TransactionSummary> | undefined
  }
}

const queries = { read: useRead }

export default queries
