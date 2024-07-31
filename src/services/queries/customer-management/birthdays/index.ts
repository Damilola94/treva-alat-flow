import { useQuery } from 'react-query'
import api from '../../../api'
import { errorToast, handleErrors } from '../../../helper'
import queryKey from './keys'
import { type AxiosError } from 'axios'
import { type ApiResponse } from '@/lib/models'
import { type Customer } from './types'
import featureFlags from '@/lib/feature-flags'
import { format, getMonth } from 'date-fns'
import config from '@/lib/config'
import { customers } from '../mock'

const BASE_URL = config.services.customerManagement + '/v1/customers/birthdays'

const useRead = (options = { birthday: new Date() }) => {
  const body = { day: Number(format(options.birthday, 'd')), month: getMonth(options.birthday) + 1 }
  const url = BASE_URL

  const response = useQuery([queryKey.read, JSON.stringify(body)], async () => await api.post({ url, body, mockData: customers, useMock: featureFlags.MOCK_DATA_ENABLED }), {
    ...options,
    onSuccess: () => {},
    onError: (err: AxiosError) => { errorToast(handleErrors(err)) }
  })

  return {
    ...response,
    data: (response.data) as ApiResponse<Customer[]> | undefined
  }
}

const queries = { read: useRead }

export default queries
