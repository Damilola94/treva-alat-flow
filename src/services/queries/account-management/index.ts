import { useQuery } from 'react-query'
import api from '../../api'
import { errorToast, handleErrors } from '../../helper'
import queryKey from './keys'
import { type AxiosError } from 'axios'
import { type ApiResponse } from '@/lib/models'
import { type CustomerDetails } from './types'
import featureFlags from '@/lib/feature-flags'
import { customerDetails, customers } from './mock'
import config from '@/lib/config'
import { useParams } from 'next/navigation'

const BASE_URL = config.services.accountManagement + '/v1/accounts'

const useReadOne = (options = { accountNumber: undefined as string | undefined }) => {
  const params = useParams()
  const accountNumber = options.accountNumber ?? (typeof params.id === 'string' ? params.id : undefined)

  const searchParams = new URLSearchParams({ accountNumber: accountNumber ?? '' }).toString()
  const url = `${BASE_URL}` + (searchParams ? `?${searchParams}` : '')

  const responseData = customers.responseData.find((item) => item.accountNumber === accountNumber) ?? customerDetails.responseData

  const response = useQuery([queryKey.readOne, searchParams], async () => await api.get({ url, mockData: { ...customerDetails, responseData }, useMock: featureFlags.MOCK_DATA_ENABLED }), {
    enabled: !!accountNumber,
    ...options,
    onSuccess: () => {},
    onError: (err: AxiosError) => { errorToast(handleErrors(err)) }
  })

  return {
    ...response,
    data: (response.data) as ApiResponse<CustomerDetails> | undefined
  }
}

const queries = { readOne: useReadOne }

export default queries
