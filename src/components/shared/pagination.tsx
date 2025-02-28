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
    pageCount={paginate.pageCount}
    pageRangeDisplayed={paginate.pageRangeDisplayed}
    marginPagesDisplayed={paginate.marginPagesDisplayed}
    forcePage={paginate.currentPage}
    containerClassName="flex items-center gap-2"
    pageClassName="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-700"
    activeClassName="bg-black text-white border-black"
    previousClassName="w-10 h-10 flex items-center justify-center"
    nextClassName="w-10 h-10 flex items-center justify-center"
    disabledClassName="opacity-50 cursor-not-allowed"
    />
  )
}
