import React from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import Link from 'next/link'
import routes from '@/lib/routes'
import usePagination from '@/hooks/use-pagination'
import { Pagination } from '../pagination'
import config from '@/lib/config'
import { Skeleton } from '@/components/ui/skeleton'
import { getAvatar } from '@/lib/utils'
import queries from '@/services/queries/customer-management'
import { useCreateQueryString } from '@/hooks/use-create-query-string'
import { useSearchParams } from 'next/navigation'
import { FilterEnum } from '@/lib/models'

const accounts = [
  {
    name: 'Toluwalase Opeyemi Obasun',
    phone: '08142635524',
    loanStatus: 'Ongoing',
    accountType: [{ type: 'savings' }, { type: 'current' }]
  },
  {
    name: 'Ibrahim Lawal Oladoyin',
    phone: '08142635524',
    loanStatus: null,
    accountType: [{ type: 'current' }]
  },
  {
    name: 'Adewale Joel Babafemi',
    phone: '08142635524',
    loanStatus: null,
    accountType: [{ type: 'current' }]
  },
  {
    name: 'Titilayo Christiana Adeyemi',
    phone: '08142635524',
    loanStatus: 'Ongoing',
    accountType: [{ type: 'current' }, { type: 'savings' }]
  }
]

export function CustomerTable () {
  const searchParams = useSearchParams()
  const searchValue = searchParams.get(FilterEnum.SEARCH_QUERY)

  const { pushQuery } = useCreateQueryString()

  const { data, isLoading } = queries.read()

  const { handlePageClick, paginate } = usePagination({
    total: data?.metaData?.totalCount ?? 1
  })

  return (
    <div className="flex flex-col app_customer_information_table acct_mgt">
      <div className="app_customer_information_table__search flex items-center justify-between">
        <div className="flex gap-5 items-center justify-between flex-1">
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
        </div>
      </div>
      <div className="app_customer_information_table__cct">
        <div className="app_customer_information_table__cct__con">
          <table className="table-auto app_acct_mgt_table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Digital Adoption</th>
                <th>Phone Number</th>
                <th>Loan</th>
                <th>Account Type</th>
              </tr>
            </thead>
            <tbody>
              {data?.responseData?.map((item, index) => {
                const href = `${routes.dashboard.accountManagement.path}/${item.accountNumber}`

                return (
                  <tr key={index}>
                    <td className="image">
                      <Link
                        href={href}
                      >
                        <div className="app_customer_table__avi">
                          <Image
                            src={getAvatar({ name: `${item.firstName} ${item.lastName}`, length: 2 })}
                            alt="avi"
                            className="w-full"
                            height={50}
                            width={50}
                          />
                        </div>
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={href}
                      >
                        {item.firstName} {item.middleName} {item.lastName}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={href}
                      >
                        --
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={href}
                      >
                        {item.phoneNumber ?? '--'}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={href}
                      >
                        {accounts[index]?.loanStatus ?? '--'}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={href}
                      >
                        <div className="flex items-center gap-2">
                          <span className="capitalize">
                            {accounts[index]?.accountType.length
                              ? accounts[index].accountType[0].type
                              : '--'}
                          </span>

                          {accounts[index]?.accountType.length > 1 && (
                            <div className="app_dashboard_upcoming_task__item__date">
                              <p className="app_dashboard_upcoming_task__item__date__text">
                                +2 more
                              </p>
                            </div>
                          )}
                        </div>
                      </Link>
                    </td>
                  </tr>
                )
              })}

              {isLoading && !data?.responseData?.length && (
                Array(Number(config.pagination.PageSize)).fill(0).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6}>
                      <Skeleton height={64} />
                    </td>
                  </tr>
                ))
              )}
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
