'use client'
import React from 'react'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight, Ellipsis } from './svgs'

interface IProps {
  paginate: {
    pageCount: number
    currentPage?: number
    marginPagesDisplayed?: number
    pageRangeDisplayed?: number
  }
  handlePageClick?: (selectedItem: { selected: number }) => void
}

export function Pagination (props: IProps) {
  const { handlePageClick, paginate } = props

  return (
    <ReactPaginate
      breakLabel={<Ellipsis />}
      previousLabel={<ChevronLeft />}
      nextLabel={<ChevronRight />}
      onPageChange={handlePageClick}
      pageCount={paginate?.pageCount}
      pageRangeDisplayed={paginate?.pageRangeDisplayed}
      marginPagesDisplayed={paginate?.marginPagesDisplayed}
      renderOnZeroPageCount={null}
      forcePage={paginate?.currentPage}
      initialPage={paginate?.currentPage}
      containerClassName="app_pagination flex items-center gap-2"
      pageClassName="app_pagination__button"
      activeClassName="app_pagination__numbers__button active"
      disableInitialCallback
    />
  )
}
