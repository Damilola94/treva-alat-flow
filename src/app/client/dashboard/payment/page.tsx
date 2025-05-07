'use client'
import { Edit, Label, Plus, Send, Table } from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import { mockInvoices, mockTransactions } from '@/constants';
import projectManagement from '@/lib/assets/project-management';
import { Fragment, useState } from 'react';

type TransactionTab = 'All' | 'Credit' | 'Debit'
type ViewTab = 'Transaction History' | 'Invoice'
type InvoiceTab = 'All' | 'Pending Invoice' | 'Closed Invoice' | 'Drafts'

export default function Page () {
    const [activeViewTab, setActiveViewTab] = useState<ViewTab>('Transaction History')
    const [activeTransactionTab, setActiveTransactionTab] = useState<TransactionTab>('All')
    const [activeInvoiceTab, setActiveInvoiceTab] = useState<InvoiceTab>('All')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 2,
    });

    const activeClass = 'bg-[#26A17B] text-white'
    const inactiveClass = 'bg-white text-[#262626] hover:bg-[#f2f2f4]'

    const tractionHeaders = [
        {
            header: 'Description',
            accessorKey: 'description',
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
        },
        {
            header: 'Recipient',
            accessorKey: 'recipient',
        },
        {
            header: 'date',
            accessorKey: 'date',
        },
        {
            header: 'Transaction Type',
            accessorKey: 'type',
            cell: ({ row }: any) => {
                const value = row.original.type;
                return (
                    <div className="">
                        <Label type="type" value={value} />
                    </div>
                );
            },
        },
    ];

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Wallet Balance */}
                <div className="lg:col-span-2 bg-white border border-[#E7E7E7] rounded-lg p-6">
                    <h2 className=" font-bold mb-5">Wallet Balance</h2>
                    <div className="text-3xl font-bold mb-5">₦ 150,401.50</div>
                    <div className="text-sm text-gray-500 mb-6">
                        April 20, 2025 + 02:20PM
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-[#EFF1FE] p-4 rounded-2xl ">
                        <button className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                            <div className=" mb-2">
                                <Send />
                            </div>
                            <span>Send</span>
                        </button>
                        <button className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                            <div className=" mb-2">
                                <Plus />
                            </div>
                            <span >Top Up</span>
                        </button>
                    </div>
                </div>

                {/* Manage Cards */}
                <div className="bg-white border border-[#E7E7E7] rounded-lg p-6">
                    <h2 className="font-bold mb-5">Manage Cards</h2>

                    <button className="w-full bg-[#F6F6F6] p-8 mb-4 flex flex-col items-center gap-3 hover:bg-[#F6F6F2]">
                        <Plus />
                        <span className="font-bold">Add Card</span>
                    </button>

                    <button className="w-full bg-[#F6F6F6] p-8 mb-4 flex flex-col items-center gap-3 hover:bg-[#F6F6F2]">
                        <Edit />
                        <span className="font-bold">Edit Card</span>
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex gap-4">
                    <button
                        className={`px-6 py-3 text-sm font-medium relative ${activeViewTab === 'Transaction History'
                            ? 'border border-[#262626] rounded-full'
                            : 'border border-[#0000001A] rounded-full hover:text-gray-900'
                            }`}
                        onClick={() => { setActiveViewTab('Transaction History'); }}
                    >
                        Transaction History
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium relative ${activeViewTab === 'Invoice'
                            ? 'border border-[#262626] rounded-full'
                            : 'border border-[#0000001A] rounded-full  hover:text-gray-900'
                            }`}
                        onClick={() => { setActiveViewTab('Invoice'); }}
                    >
                        Invoice
                    </button>
                </div>
            </div>
            {activeViewTab === 'Transaction History' ? (
                <Fragment>
                    <div className="mb-6 flex">
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-full mr-2 ${activeTransactionTab === 'All' ? activeClass : inactiveClass}`}
                            onClick={() => { setActiveTransactionTab('All'); }}
                        >
                            All <span className="ml-1">10</span>
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-full mr-2 ${activeTransactionTab === 'Credit'
                                ? activeClass : inactiveClass}`}
                            onClick={() => { setActiveTransactionTab('Credit'); }}
                        >
                            Credit <span className="ml-1">10</span>
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-full ${activeTransactionTab === 'Debit'
                                ? activeClass : inactiveClass}`}
                            onClick={() => { setActiveTransactionTab('Debit'); }}
                        >
                            Debit <span className="ml-1">10</span>
                        </button>
                    </div>
                    <Table
                        columns={tractionHeaders}
                        emptyTitle="No Task Yet"
                        emptyMessage="Click “add new request” button to get started"
                        data={mockTransactions}
                        pagination={pagination}
                        setPagination={setPagination} />

                </Fragment>

            ) : (
                <Fragment>
                    <div className="mb-6 flex flex-wrap gap-2">
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-full ${activeInvoiceTab === 'All' ? activeClass : inactiveClass}`}
                            onClick={() => { setActiveInvoiceTab('All'); }}
                        >
                            All <span className="ml-1">10</span>
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-full ${activeInvoiceTab === 'Pending Invoice' ? activeClass : inactiveClass}`}
                            onClick={() => { setActiveInvoiceTab('Pending Invoice'); }}
                        >
                            Pending Invoice <span className="ml-1">10</span>
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-full ${activeInvoiceTab === 'Closed Invoice' ? activeClass : inactiveClass}`}
                            onClick={() => { setActiveInvoiceTab('Closed Invoice'); }}
                        >
                            Closed Invoice <span className="ml-1">10</span>
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-full ${activeInvoiceTab === 'Drafts' ? activeClass : inactiveClass}`}
                            onClick={() => { setActiveInvoiceTab('Drafts'); }}
                        >
                            Drafts <span className="ml-1">10</span>
                        </button>
                    </div>

                    <Table
                        columns={invoiceHeaders}
                        emptyTitle="No Invoices Yet"
                        emptyMessage=""
                        data={mockInvoices}
                        pagination={pagination}
                        setPagination={setPagination}
                    />
                </Fragment>
            )
            }

        </div>
    )
}
