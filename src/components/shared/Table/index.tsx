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
import { Skeleton } from '@/components/ui/skeleton';

interface TableProps<T> {
  columns: Array<ColumnDef<T>>;
  data: T[];
  emptyIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  emptyMessage?: string;
  emptyTitle?: string;
  manualPagination?: boolean;
  pageCount?: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  rowCount?: number;
  rowDivider?: boolean;
  searchFilter?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  title?: string;
  loading?: boolean;
  setPagination: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void;
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
  loading = false,
  setPagination,
  onRowClick,
}: TableProps<T>) => {
  const [rowSelection, setRowSelection] = React.useState({});

  const [, setTempPageIndex] = React.useState(pagination);
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

  useEffect(() => {
    table.setGlobalFilter(searchFilter);
  }, [searchFilter, table]);

  return (
    <div
      className={`${styles.container} flex flex-col font-spaceGrotesk relative rounded !bg-white !mb-20`}
      style={{ maxHeight: showViewAll ? '528px' : '100% ' }}
    >
      {!loading && (!data || data?.length === 0) ? (
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
                  className={
                    '!h-[40px] sm:!h-[48px] !px-0 !sm:px-4 sm:max-w-fit !justify-start flex'
                  }
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
                {loading ? (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={index} columns={4} />
                    ))}
                  </>
                ) : (
                  table.getRowModel().rows.map((row, index) => {
                    return (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: rowDivider
                            ? '1px solid #EBEFF2'
                            : 'none',
                          cursor: onRowClick ? 'pointer' : 'default',
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
                        onClick={() => onRowClick && onRowClick(row)}
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
                  })
                )}
              </tbody>
            </table>
          </div>
          {!showViewAll && (
            <div className="sticky -bottom-[1px] px-6 justify-center sm:justify-center flex items-center bg-white/50 min-h-16 border border-[#EBEFF2] text-xs font w-full">
              <div className="flex gap-2 text-[#606060] items-center">
                <button
                  className="disabled:opacity-50"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => {
                    table.previousPage();
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
                    table.nextPage();
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
