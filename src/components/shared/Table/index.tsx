'use client';

import React, { useEffect } from 'react';
import Link from 'next/dist/client/link';
import styles from './styles.module.css';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import EmptyState from '../EmptyState';
import { ArrowRight, EmptyTable } from '@/app/assets/svgs';

interface TableProps<T> {
  columns: Array<ColumnDef<T>>
  data: T[]
  emptyIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  emptyMessage?: string
  emptyTitle?: string
  manualPagination?: boolean
  pageCount?: number
  pagination: {
    pageIndex: number
    pageSize: number
  }
  rowCount?: number
  rowDivider?: boolean
  searchFilter?: string
  showViewAll?: boolean
  viewAllLink?: string
  title?: string
  setPagination: React.Dispatch<
  React.SetStateAction<{ pageIndex: number, pageSize: number }>
  >
}

const Table = <T,>({
  columns,
  data,
  emptyIcon = EmptyTable,
  emptyMessage = 'Your data will appear here',
  emptyTitle = 'No Data Yet',
  manualPagination = false,
  pageCount = 0,
  pagination, // default pagination values
  rowCount = 25,
  rowDivider = false, // show row dividers
  searchFilter,
  showViewAll = false, // if false show footer
  viewAllLink = '',
  title,
  setPagination,
}: TableProps<T>) => {
  const [rowSelection, setRowSelection] = React.useState({});

  const [/* tempPageIndex */, setTempPageIndex] = React.useState(pagination);
  useEffect(() => {}, [data]);

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    enableRowSelection: true,
    manualPagination,
    pageCount: manualPagination ? pageCount : undefined,
    rowCount: manualPagination ? rowCount : undefined,
    state: {
      rowSelection,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (pagination) => {
      setPagination(pagination);
      setTempPageIndex(pagination);
    },
  });

  // const formatNumber = (n: number) => n.toString().padStart(2, '0');
  // const formatPaginationText = (
  //   currentPageLength: number,
  //   totalRowCount: number,
  //   pageIndex: number,
  //   pageSize: number,
  // ) => {
  //   const start = formatNumber(pageIndex * pageSize + 1);
  //   const end = formatNumber(
  //     Math.min(pageIndex * pageSize + currentPageLength, totalRowCount),
  //   );
  //   const total = formatNumber(totalRowCount);

  //   return `${start} to ${end} of ${total} entries`;
  // };

  // const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = e.target.value;
  //   const pageIndex = Number(inputValue);
  //   if (!isNaN(pageIndex)) {
  //     setTempPageIndex({
  //       ...tempPageIndex,
  //       pageIndex: pageIndex - 1,
  //     });
  //   } else {
  //     setTempPageIndex({
  //       ...tempPageIndex,
  //       pageIndex: 0,
  //     });
  //   }
  // };
  // const handleGoClick: () => void = () => {
  //   table.setPageIndex(tempPageIndex.pageIndex);
  // };
  // const isValidPageIndex = () => {
  //   const pageIndex = tempPageIndex.pageIndex + 1;
  //   return pageIndex >= 1 && pageIndex <= table.getPageCount();
  // };
  useEffect(() => {
    table.setGlobalFilter(searchFilter);
  }, [searchFilter, table]);

  return (
    <div
      className={`${styles.container} flex flex-col font-spaceGrotesk relative rounded !bg-white`}
      style={{ maxHeight: showViewAll ? '528px' : '100% ' }}
    >
      {!data || data?.length === 0 ? (
        <div className="min-h-[443px] p-5 ">
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            icon={emptyIcon}
          />
        </div>
      ) : (
        <>
          {showViewAll && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start pt-6 pb-3 px-6 !bg-white">
              {title && <h2 className="text-xl font-bold ">{title}</h2>}
              <Link href={viewAllLink} passHref={true}>
                <Button
                  className={'!h-[40px] sm:!h-[48px] !px-0 !sm:px-4 sm:max-w-fit !justify-start flex'}
                  // textClass="flex gap-3 items-center font-bold"
                  // variant="simple"
                >
                  View all
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          )}
          <div
            className={`!overflow-y-scroll ${styles['no-scrollbar']} !bg-white`}
          >
            <table>
              <thead className="sticky text-sm top-0 bg-[#A5A6F6]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    <th>#</th>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <div>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, index) => {
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: rowDivider ? '1px solid #EBEFF2' : 'none',
                      }}
                    >
                      <td>
                        {pagination.pageIndex * pagination.pageSize +
                          (index + 1)}
                      </td>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            {cell.column.id.includes('name')
                              ? (cell.getValue() as string)
                              : cell.column.id.includes('date')
                              ? cell.getValue()
                                ? new Date(
                                    cell.getValue() as string,
                                  ).toDateString()
                                : ''
                              : typeof cell.getValue() === 'boolean'
                              ? cell.getValue()
                                ? 'Yes'
                                : 'No'
                              : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!showViewAll && (
            <div className="sticky -bottom-[1px] px-6 justify-center sm:justify-center flex items-center bg-white/50 min-h-16 border border-[#EBEFF2] text-xs font w-full">
              {/* <div className="hidden sm:block !text-[#4A4A4A] ">
                Showing{' '}
                {formatPaginationText(
                  table.getPaginationRowModel().rows.length,
                  table.getRowCount(),
                  table.getState().pagination.pageIndex,
                  table.getState().pagination.pageSize,
                )}
              </div> */}
              {/* <div className="hidden lg:flex gap-4 justify-center items-center ">
                <span className="!text-[#4A4A4A] ">Page</span>
                <input
                  className={`flex items-center justify-center h-8 w-8  border border-[#BEBEBE] focus-within:border-[#6C6C6C] rounded ${styles['no-spin']} `}
                  max={table.getPageCount()}
                  min={1}
                  onChange={handlePageChange}
                  style={{ textAlign: 'center' }}
                  type="number"
                  value={tempPageIndex.pageIndex + 1}
                />
                <span>of</span>
                <div className="w-8 h-8 border border-[#BEBEBE] rounded flex items-center justify-center">
                  <span>{formatNumber(table.getPageCount())}</span>
                </div>
                <button
                  disabled={!isValidPageIndex()}
                  className={`flex w-8 h-8 items-center justify-center border rounded bg-[#BF0926] text-white disabled:bg-[#a95a67]`}
                  onClick={handleGoClick}
                >
                  Go
                </button>
              </div> */}
              <div className="flex gap-2 text-[#606060] items-center">
                <button
                  className="disabled:opacity-50"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => {
                    table.previousPage()
                  }}
                >
                  Previous
                </button>

                {/* Current page (active) */}
                <div className="flex items-center justify-center w-8 h-8 border rounded-full bg-[#333333]">
                  <span className="text-white">
                    {table.getState().pagination.pageIndex + 1}
                  </span>
                </div>

                {/* Next page indicator (only shows if not on last page) */}
                {table.getState().pagination.pageIndex + 1 <
                  table.getPageCount() && (
                  <div className="flex items-center justify-center w-8 h-8 border rounded-full bg-gray-100">
                    <span className="text-gray-400">
                      {table.getState().pagination.pageIndex + 2}
                    </span>
                  </div>
                )}

                <button
                  className="disabled:opacity-50"
                  disabled={!table.getCanNextPage()}
                  onClick={() => {
                    table.nextPage()
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { Table };
