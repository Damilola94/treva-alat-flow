'use client'
import React from 'react'
import ReactPaginate from 'react-paginate'
import { Ellipsis } from '../svgs'

interface IProps {
  paginate: {
    pageCount: number
    currentPage?: number
    marginPagesDisplayed?: number
    pageRangeDisplayed?: number
  }
  handlePageClick?: (selectedItem: { selected: number }) => void
}

function NextButton () {
  return (
    <button
      type="button"
      className="app_customer_information_table__cct__nav__pagination__btn page"
    >
      Next
    </button>
  )
}

function PrevButton () {
  return (
    <button
      type="button"
      className="app_customer_information_table__cct__nav__pagination__btn page"
    >
      Prev
    </button>
  )
}

export function Pagination (props: IProps) {
  const { handlePageClick, paginate } = props

  return (
    <ReactPaginate
      breakLabel={<Ellipsis />}
      nextLabel={<NextButton />}
      previousLabel={<PrevButton />}
      onPageChange={handlePageClick}
      pageCount={paginate?.pageCount}
      pageRangeDisplayed={paginate?.pageRangeDisplayed}
      marginPagesDisplayed={paginate?.marginPagesDisplayed}
      renderOnZeroPageCount={null}
      forcePage={paginate?.currentPage}
      initialPage={paginate?.currentPage}
      containerClassName="app_customer_information_table__cct__nav__pagination flex items-center gap-2"
      pageClassName="app_customer_information_table__cct__nav__pagination__button"
      activeClassName="app_dashboard_users__pagination__numbers__button active"
      disableInitialCallback
    />
  )
}
