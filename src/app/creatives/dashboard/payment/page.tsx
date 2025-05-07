'use client'

import { Label, Pill, Table } from '@/components/shared'
import { Avatar } from '@/components/shared/avatar'
import SearchInput from '@/components/ui/SearchInput'
import { invoiceTabs, mockInvoices } from '@/constants'
import projectManagement from '@/lib/assets/project-management'
import { useState } from 'react'

// type InvoiceTab = 'All' | 'Pending Invoice' | 'Closed Invoice' | 'Drafts'

export default function Page () {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 2,
    });

    const invoiceHeaders = [
        {
            header: 'Project name',
            accessorKey: 'projectName',
        },
        {
            header: 'Client',
            accessorKey: 'client',
            cell: ({ row }: any) => {
                const value = row.original.client
                return (
                    <div className="flex items-center gap-2">
                        <Avatar src={projectManagement.female} size='sm' />
                        <span>{value}</span>
                    </div>
                )
            }
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
        },
        {
            header: 'Due Date',
            accessorKey: 'dueDate',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }: any) => {
                const value = row.original.status
                return (
                    <div className="">
                        <Label type="status" value={value} />
                    </div>
                )
            },
        },
    ]

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
                                setSelectedCategory(item.value)
                            }}
                        >
                            {item.label}
                        </Pill>
                    ))}
                </div>

                <SearchInput placeholder="Search for Invoice" />
            </div>
            <Table
                columns={invoiceHeaders}
                emptyTitle="No Invoices Yet"
                emptyMessage=""
                data={mockInvoices}
                pagination={pagination}
                setPagination={setPagination} />
        </div>
    )
}
