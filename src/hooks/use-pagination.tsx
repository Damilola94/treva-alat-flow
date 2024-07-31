import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import config from '@/lib/config'
import { getParseFloat } from '@/lib/numbers'
import { useCreateQueryString } from './use-create-query-string'
import { PaginationEnum } from '@/lib/models'

const PAGE_PARAMS_KEY = PaginationEnum.PAGE_NUMBER

interface IPaginateProps {
  marginPagesDisplayed?: number
  pageRangeDisplayed?: number
  pageCount?: number
  currentPage?: number
}

interface IProps {
  total?: number
  totalPages?: number
  pageSize?: number
}

export default function usePagination ({ total, totalPages, pageSize = Number(config.pagination.PageSize) }: IProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageParams = searchParams.get(PAGE_PARAMS_KEY)
  const pathName = usePathname()

  const [paginate] = useState<IPaginateProps>({
    marginPagesDisplayed: 1,
    pageRangeDisplayed: 2
  })

  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const { createQueryString } = useCreateQueryString()

  useEffect(() => {
    if (typeof total === 'number') {
      setPageCount(Math.ceil(total / pageSize))
    } else if (totalPages) {
      setPageCount(totalPages)
    } else {
      setPageCount(0)
    }
  }, [total, totalPages, pageSize])

  useEffect(() => {
    if (pageParams) {
      setCurrentPage(pageParams ? getParseFloat(pageParams) - 1 : 0)
    }
  }, [pageParams])

  const handlePageClick = ({ selected: page }: { selected: number }) => {
    router.push(pathName + '?' + createQueryString(PAGE_PARAMS_KEY, `${page + 1}`), { scroll: false })
    setCurrentPage(page || 0)
  }

  return { paginate: { ...paginate, pageCount, currentPage }, handlePageClick }
}
