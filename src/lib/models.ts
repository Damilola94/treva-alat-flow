export interface ApiResponse<T> {
  isSuccess?: boolean
  statusCode?: string
  message?: string
  data?: T
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
