export interface ApiResponse<T> {
  isSuccess?: boolean
  responseCode?: string
  responseMessage?: string
  responseData?: T
  metaData?: {
    totalCount: number
    pageSize: number
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export enum PaginationEnum {
  PAGE_NUMBER = 'PageNumber',
  PAGE_SIZE = 'PageSize'
}

export enum FilterEnum {
  SEARCH_QUERY = 'SearchQuery'
}
