import { useQuery } from 'react-query'
import api from '../../api'
import { errorToast, handleErrors } from '../../helper'
import queryKey from './keys'
import { type AxiosError } from 'axios'
import { FilterEnum, PaginationEnum, type ApiResponse } from '@/lib/models'
import { type CustomerDetails, type Customer } from './types'
import featureFlags from '@/lib/feature-flags'
import { customerDetails, customers } from './mock'
import config from '@/lib/config'
import { useParams, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'

const BASE_URL = config.services.customerManagement + '/v1/customers'

const useRead = (options = { ...config.pagination, SearchQuery: '' }) => {
  const searchParams = useSearchParams()
  const [searchQuery] = useDebounce(searchParams.get(FilterEnum.SEARCH_QUERY) ?? '', 700)

  const queries = {
    ...config.pagination,
    [PaginationEnum.PAGE_NUMBER]: searchParams.get(PaginationEnum.PAGE_NUMBER) ?? config.pagination.PageNumber,
    [FilterEnum.SEARCH_QUERY]: searchQuery
  }

  const urlSearchParams = new URLSearchParams(queries).toString()
  const url = `${BASE_URL}` + (urlSearchParams ? `?${urlSearchParams}` : '')

  const response = useQuery([queryKey.read, JSON.stringify(queries)], async () => await api.get({ url, mockData: customers, useMock: featureFlags.MOCK_DATA_ENABLED }), {
    ...options,
    onSuccess: () => {},
    onError: (err: AxiosError) => { errorToast(handleErrors(err)) }
  })

  return {
    ...response,
    data: (response.data) as ApiResponse<Customer[]> | undefined
  }
}

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

const queries = { read: useRead, readOne: useReadOne }

export default queries
