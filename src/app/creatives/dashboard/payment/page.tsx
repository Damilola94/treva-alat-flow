/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Label, MiniLoader, Pill, Table } from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import SearchInput from '@/components/ui/SearchInput';
import { invoiceTabs } from '@/constants';
import { useInvoices } from '@/hooks/Projects/useProjects';
import projectManagement from '@/lib/assets/project-management';
import { numberFormat } from '@/lib/numbers';
import { formatDate } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface InvoiceParams {
  status?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

export default function Page() {
  const [params, setParams] = useState<InvoiceParams>({
    pageNumber: 1,
    pageSize: 50,
    searchKey: '',
  });
  const { allInvoicesData, loading } = useInvoices(params);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    invoiceTabs?.[0]?.value ?? null,
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      pageNumber: pagination?.pageIndex + 1,
      pageSize: pagination?.pageSize,
    }));
  }, [pagination]);

  useEffect(() => {
    if (!selectedCategory && invoiceTabs?.length) {
      const first = invoiceTabs[0].value;
      setSelectedCategory(first);
      handleParamChange({ status: first === 'All' ? undefined : first });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceTabs]);

  const handleParamChange = (param: Partial<InvoiceParams>) => {
    setParams((prev) => ({
      ...prev,
      ...param,
    }));
  };

  const invoiceHeaders = [
    {
      header: 'Project name',
      accessorKey: 'title',
      cell: ({ row }: any) => (
        <span>{row.original.paymentSchedule?.project?.title}</span>
      ),
    },
    {
      header: 'Client',
      accessorKey: 'client',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const image = row.original.clientUser?.profilePicture;
        const firstName = row.original.clientUser?.firstName;
        const lastName = row.original.clientUser?.lastName;
        return (
          <div className="flex items-center gap-2">
            <Avatar src={image || projectManagement.female} size="sm" />
            <span>
              {firstName} {lastName}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }: any) => (
        <span>{numberFormat(row.original.paymentSchedule?.amount)}</span>
      ),
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      cell: ({ row }: any) => (
        <span>{formatDate(row.original.paymentSchedule?.dueDate)}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: any) => (
        <Label
          type="status"
          value={row.original.status}
          mapOverride={{
            1: 'Pending',
          }}
        />
      ),
    },
  ];

  if (loading) {
    return <MiniLoader message="Loading" />;
  }

  return (
    <div className="app_dashboard_page app_dashboard_home !p-8">
      <div className="app_dashboard_home__task__hdr flex-wrap gap-2">
        <div className="flex md:flex-wrap gap-2">
          {invoiceTabs.map((item) => (
            <Pill
              key={item.value}
              size="md"
              active={selectedCategory === item.value}
              onClick={() => {
                setSelectedCategory(item.value);
                handleParamChange({
                  status: item?.value === 'All' ? undefined : item?.value,
                });
              }}
            >
              {item.label}
            </Pill>
          ))}
        </div>

        <SearchInput
          placeholder="Search for Invoice"
          onChange={(e) => {
            handleParamChange({ searchKey: e.target.value });
          }}
        />
      </div>
      <div className='app_dashboard_home__task__ctt'>
      <Table
        columns={invoiceHeaders}
        emptyTitle="No Invoices Yet"
        emptyMessage="Invoices will be added here"
        data={allInvoicesData?.data || []}
        pagination={pagination}
        setPagination={setPagination}
      />

      </div>
    </div>
  );
}
