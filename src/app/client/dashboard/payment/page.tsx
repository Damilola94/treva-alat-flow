'use client';
import { SmallAvatar, SmallHome } from '@/app/assets/svgs';
import {
  ArrowRightUp,
  CenterModal,
  EditIcon,
  Label,
  PlusBlack,
  SideModal,
  Table,
} from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import { Select } from '@/components/shared/select';
import { Input } from '@/components/ui/input';
import { mockInvoices, mockTransactions } from '@/constants';
import projectManagement from '@/lib/assets/project-management';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';

type TransactionTab = 'All' | 'Credit' | 'Debit';
type ViewTab = 'Transaction History' | 'Invoice';
type InvoiceTab = 'All' | 'Pending Invoice' | 'Closed Invoice' | 'Drafts';

export default function Page () {
  const router = useRouter()
  const [withdraw, toggleWithdraw] = useState(false);
  const [addFunds, toggleAddFunds] = useState(false);
  const [editAccount, toggleEditAccount] = useState(false);

  const [activeViewTab, setActiveViewTab] = useState<ViewTab>(
    'Transaction History',
  );
  const [activeTransactionTab, setActiveTransactionTab] =
    useState<TransactionTab>('All');
  const [activeInvoiceTab, setActiveInvoiceTab] = useState<InvoiceTab>('All');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 2,
  });

  const activeClass = 'bg-[#26A17B] text-white';
  const inactiveClass = 'bg-white text-[#262626] hover:bg-[#f2f2f4]';
  const handleRowClick = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    void router.push(`/client/dashboard/payment/${id}`);
  };

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
        const value = row.original.client;
        return (
          <div className="flex items-center gap-2">
            <Avatar src={projectManagement.female} size="sm" />
            <span>{value}</span>
          </div>
        );
      },
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
        const value = row.original.status;
        return (
          <div className="">
            <Label type="status" value={value} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <div className="invoice_payment_bg">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between px-8 py-16 ">
          <div className="text-white">
            <h3>Wallet Balance</h3>
            <span className="font-medium text-4xl">₦ 150,401.50</span>
          </div>
          <div className="flex gap-3">
            <button
              className="text-[#E7E7E7] font-bold border border-[#F1F1F1] rounded-full flex items-center justify-center p-4 gap-4 hover:border-[#FFF]"
              onClick={() => {
                toggleWithdraw(true);
              }}
            >
              <div className="">
                <ArrowRightUp />
              </div>
              <span>Withdraw Funds</span>
            </button>
            <button
              className="bg-white rounded-full p-4 gap-4 flex items-center justify-center hover:bg-[F1F1F1]transition-colors"
              onClick={() => {
                toggleAddFunds(true);
              }}
            >
              <div className="text-black">
                <PlusBlack />
              </div>
              <span>Add Funds</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 py-10">
        <div className="mb-6">
          <div className="flex gap-4">
            <button
              className={`px-6 py-3 text-sm font-medium relative ${
                activeViewTab === 'Transaction History'
                  ? 'border border-[#262626] rounded-full'
                  : 'border border-[#0000001A] rounded-full hover:text-gray-900'
              }`}
              onClick={() => {
                setActiveViewTab('Transaction History');
              }}
            >
              Transaction History
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium relative ${
                activeViewTab === 'Invoice'
                  ? 'border border-[#262626] rounded-full'
                  : 'border border-[#0000001A] rounded-full  hover:text-gray-900'
              }`}
              onClick={() => {
                setActiveViewTab('Invoice');
              }}
            >
              Invoice
            </button>
          </div>
        </div>
        {activeViewTab === 'Transaction History' ? (
          <Fragment>
            <div className="mb-6 flex">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full mr-2 ${
                  activeTransactionTab === 'All' ? activeClass : inactiveClass
                }`}
                onClick={() => {
                  setActiveTransactionTab('All');
                }}
              >
                All <span className="ml-1">10</span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full mr-2 ${
                  activeTransactionTab === 'Credit'
                    ? activeClass
                    : inactiveClass
                }`}
                onClick={() => {
                  setActiveTransactionTab('Credit');
                }}
              >
                Credit <span className="ml-1">10</span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  activeTransactionTab === 'Debit' ? activeClass : inactiveClass
                }`}
                onClick={() => {
                  setActiveTransactionTab('Debit');
                }}
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
              setPagination={setPagination}
            />
          </Fragment>
        ) : (
          <Fragment>
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  activeInvoiceTab === 'All' ? activeClass : inactiveClass
                }`}
                onClick={() => {
                  setActiveInvoiceTab('All');
                }}
              >
                All <span className="ml-1">10</span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  activeInvoiceTab === 'Pending Invoice'
                    ? activeClass
                    : inactiveClass
                }`}
                onClick={() => {
                  setActiveInvoiceTab('Pending Invoice');
                }}
              >
                Pending Invoice <span className="ml-1">10</span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  activeInvoiceTab === 'Closed Invoice'
                    ? activeClass
                    : inactiveClass
                }`}
                onClick={() => {
                  setActiveInvoiceTab('Closed Invoice');
                }}
              >
                Closed Invoice <span className="ml-1">10</span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  activeInvoiceTab === 'Drafts' ? activeClass : inactiveClass
                }`}
                onClick={() => {
                  setActiveInvoiceTab('Drafts');
                }}
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
              onRowClick={handleRowClick}
            />
          </Fragment>
        )}
      </div>
      <CenterModal
        headerImageType={1}
        title="Add Funds"
        isOpen={addFunds}
        onClose={() => {
          toggleAddFunds(false);
        }}
        showFooter
      >
        <div className="space-y-5 text-lg">
          <div className="flex justify-between items-center">
            <span className="text-[#808080]">Account Number</span>
            <span className="font-semibold">0012345678</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#808080]">Bank</span>
            <span className="font-semibold">Wema Bank</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#808080]">Account Name</span>
            <span className="font-semibold">Treva - IDEAx Labs</span>
          </div>
        </div>
      </CenterModal>

      <SideModal
        isOpen={editAccount}
        onClose={() => {
          toggleEditAccount(false);
        }}
        title="Edit Account"
        showFooter
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button className="border p-5 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]">
              Close
            </button>
            <button className="border p-5 bg-[#7B37F0] rounded-full w-full border-[#F1F1F1] text-[#fff]">
              Add
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <Input placeholder="Enter your Account Number" />
          <Select options={[]} />
          <div>
            <p className="font-semibold ">Moyinoluwa Akindele </p>
          </div>
        </div>
      </SideModal>

       {/* withdraw funds side modal */}
        <SideModal
          isOpen={withdraw}
          onClose={() => {
            toggleWithdraw(false)
          }}
          title="Withdraw Funds"
          showFooter
          footerChildren={
            <div className="w-full gap-5">
              <button className="border p-5 bg-[#7B37F0] rounded-full w-full border-[#F1F1F1] text-[#fff]">
                Withdraw
              </button>
            </div>
          }
        >
          <div className="space-y-10">
            <div>
              <Input placeholder="Withdrawal Amount" />
              <div>
                <p className="font-semibold mt-3">#256,00</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <p className="font-semibold ">Select Bank Account</p>
              </div>
              <div className="border p-4 rounded-lg border-[#888888]">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xl text-[#333333]">
                    0012345321
                  </p>
                  <div
                    onClick={() => {
                      toggleWithdraw(false);
                      toggleEditAccount(true);
                    }}
                    className="cursor-pointer"
                  >
                    <EditIcon />
                  </div>
                </div>
                <div className="text-[#262626] space-y-3 mt-5">
                  <p className="flex items-center gap-3">
                    <span>
                      <SmallHome />
                    </span>
                    Wema Bank Plc
                  </p>
                  <p className="flex items-center gap-3">
                    <SmallAvatar />
                    Treva - IDEAx Labs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SideModal>
    </div>
  );
}
