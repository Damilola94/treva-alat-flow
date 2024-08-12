'use client'
import React from 'react'
import { ChevronRight, Filter, MoreSquare, RenderIf, Warning } from '../..'
import Image from 'next/image'
import { Search } from 'lucide-react'
import Link from 'next/link'
import routes from '@/lib/routes'
import usePagination from '@/hooks/use-pagination'
import queries from '@/services/queries/customer-management'
import { Skeleton } from '@/components/ui/skeleton'
import config from '@/lib/config'
import { getAvatar } from '@/lib/utils'
import { Pagination } from '../pagination'
import { useSearchParams } from 'next/navigation'
import { useCreateQueryString } from '@/hooks/use-create-query-string'
import { FilterEnum } from '@/lib/models'

export function CustomerTable () {
  const searchParams = useSearchParams()
  const searchValue = searchParams.get(FilterEnum.SEARCH_QUERY)

  const { pushQuery } = useCreateQueryString()

  const { data, isLoading } = queries.read()

  const { handlePageClick, paginate } = usePagination({
    total: data?.metaData?.totalCount ?? 1
  })

  return (
    <div className="flex flex-col app_customer_information_table">
      <div className="app_customer_information_table__search flex flex-wrap items-center justify-between">
        <div className="flex gap-5 items-center flex-1">
          <div className="app_customer_information_table__search__bar">
            <input
              onChange={(e) => {
                pushQuery(FilterEnum.SEARCH_QUERY, e.target.value)
              }}
              value={searchValue ?? ''}
              placeholder="Search"
            />
            <div className="app_customer_information_table__search__bar__icon">
              <Search color="#222" size={17} />
            </div>
          </div>
          {/* <Input placeholder="Search" size="lg" /> */}

          <div>
            <button
              className="app_customer_information_table__search__btn"
              type="button"
            >
              <Filter />
            </button>
          </div>
        </div>
        <p className="app_customer_information_table__search__text">
          Showing <span>1-1</span> of <span>{data?.metaData?.totalCount}</span>
        </p>
      </div>
      <div className="app_customer_information_table__cct">
        <div className="app_customer_information_table__cct__con">
          <table className="table-auto app_customer_table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.responseData?.map((item, index) => {
                const href = `${routes.dashboard.customerInformation.path}/${item.accountNumber}`

                return (
                  <tr key={item.accountNumber + index}>
                    <td className="image">
                      <Link href={href}>
                        <div className="app_customer_table__avi">
                          <Image
                            src={getAvatar({
                              name: `${item.firstName} ${item.lastName}`,
                              length: 2
                            })}
                            alt="avi"
                            className="w-full"
                            height={50}
                            width={50}
                          />
                        </div>
                      </Link>
                    </td>
                    <td>
                      <Link href={href}>
                        {item.firstName} {item.middleName} {item.lastName}
                      </Link>
                    </td>
                    <td>
                      <Link href={href}>{item.email ?? '--'}</Link>
                    </td>
                    <td>
                      <Link href={href}>{item.phoneNumber ?? '--'}</Link>
                    </td>
                    <td className="action">
                      <div className="flex items-center gap-1">
                        <div className="app_customer_table__warning">
                          <RenderIf condition={index % 2 === 0}>
                            <Warning />
                          </RenderIf>
                        </div>
                        <button
                          type="button"
                          className="flex items-center justify-center"
                        >
                          <MoreSquare className="hidden md:block" />
                          <ChevronRight />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {isLoading &&
                !data?.responseData?.length &&
                Array(Number(config.pagination.PageSize))
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td colSpan={5}>
                        <Skeleton height={64} />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="app_customer_information_table__cct__nav flex justify-between items-center my-6">
          <p className="app_customer_information_table__cct__nav__total">
            Total: <span>{data?.metaData?.totalCount}</span>
          </p>

          <Pagination handlePageClick={handlePageClick} paginate={paginate} />
        </div>
      </div>
    </div>
  )
}
