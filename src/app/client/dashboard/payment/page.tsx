/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  ArrowRightUp,
  PlusBlack,
  Label,
  Table,
  Pill,
  CenterModal,
  SideModal,
  Copy,
  MiniLoader,
} from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import SearchInput from '@/components/ui/SearchInput';
import TabSelector from '@/components/shared/TabSelector';
import { clientDashboardTasks, invoiceTabs } from '@/constants';
import usePaymentService from '@/hooks/Projects/usePayment';
import { useInvoices } from '@/hooks/Projects/useProjects';
import projectManagement from '@/lib/assets/project-management';
import { numberFormat } from '@/lib/numbers';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useBeneficiaryManagement, useCommon } from '@/hooks/Projects';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import {
  useBankNameEnquiryMutation,
  useGetTransactionsQuery,
} from '@/services/paymentService';
import { errorToast } from '@/services';
import { getErrorMessage } from '@/utils';
import Select from 'react-select';
import { WithdrawalFlowManager } from '@/components/shared/project-management/wallet-flow-manager';

type TransactionTab = 'All' | 'Credit' | 'Debit';
type ViewTab = 'Transaction History' | 'Invoice';
const transactionTypeMap = {
  Credit: 2,
  Debit: 1,
};
interface InvoiceParams {
  status?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

const transactionTabOptions = [
  { label: 'All', value: 'All' },
  { label: 'Credit', value: 'Credit' },
  { label: 'Debit', value: 'Debit' },
];

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  accountNumber: Yup.string()
    .matches(/^\d+$/, 'Must be a number')
    .length(10, 'Account number must be exactly 10 digits')
    .required('Account number is required'),
  bankCode: Yup.string().required('Bank code is required'),
  // bankName: Yup.string().required('Bank name is required'),
});

export default function Page() {
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [activeTransactionTab, setActiveTransactionTab] =
    useState<TransactionTab>('All');
  const [addFunds, toggleAddFunds] = useState(false);
  const [addAccount, toggleAddAccount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(clientDashboardTasks?.[0]?.value ?? null);
  const [activeViewTab, setActiveViewTab] = useState<ViewTab>(
    'Transaction History',
  );
  const [, setSelected] = useState<string | null>(null);
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false);
  const [isWithdrawFlowOpen, setIsWithdrawFlowOpen] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const initialValues = {
    name: '',
    accountNumber: '',
    bankCode: '',
    // bankName: '',
  };

  const [params, setParams] = useState({
    walletId: '',
    accountNumber: 0,
    availableBalance: 0,
    bankName: '',
    currency: '',
    pageNumber: 1,
    pageSize: 50,
    searchKey: '',
    bankCode: 0,
    name: '',
    beneficiaryAccountNumber: '',
    amount: 0,
  });

  const { allInvoicesData } = useInvoices(params);
  const { myWalletData, refetch:refetchWallet } = usePaymentService(params);
  const { addWithdrawResponse } = usePaymentService(params);
  const { myCommonData } = useCommon();
  const { beneficiaryData, refetch } = useBeneficiaryManagement(params);
  const { addBeneficiary, addBeneficiaryResponse } = useBeneficiaryManagement();
  const walletId = myWalletData?.data?.accountNumber ?? '';
  // const { myTransactions } = usePaymentService(params);
  const { data: myTransactions, isLoading: loading } =
    useGetTransactionsQuery(walletId);
  const [bankNameEnquiryTrigger, { isLoading: bankNameLoading }] =
    useBankNameEnquiryMutation();

  const transactionData = useMemo(
    () => (Array.isArray(myTransactions?.data) ? myTransactions.data : []),
    [myTransactions?.data],
  );
  const data = myWalletData?.data;

  const bankOptions = [
    { label: 'Bank', value: '', isDisabled: true },
    ...(myCommonData?.data || []).map((item) => ({
      label: item.name,
      value: item.code,
    })),
  ];

  const customFilter = (option: any, inputValue: any) => {
    const label = option.label.toLowerCase();
    const value = option.value.toLowerCase();
    const input = inputValue.toLowerCase();

    return label.includes(input) || value.includes(input);
  };

  const handleCopy = () => {
    if (!myWalletData?.data?.accountNumber) return;
    navigator.clipboard
      .writeText(myWalletData?.data?.accountNumber)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const filteredCounts = {
    All: transactionData.length,
    Credit: transactionData.filter((d) => d.transactionType === 2).length,
    Debit: transactionData.filter((d) => d.transactionType === 1).length,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setIsAddingBeneficiary(true);
      const payload = {
        name: values?.name,
        bankCode: values?.bankCode,
        accountNumber: values?.accountNumber,
      };
      try {
        await addBeneficiary(payload);
      } finally {
        setIsAddingBeneficiary(false);
      }
    },
    validationSchema,
  });

  const {
    setFieldValue,
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    dirty,
    isValid,
  } = formik;

  React.useEffect(() => {
    const ac = values.accountNumber?.toString() || '';
    const bc = values.bankCode;
    if (ac.length !== 10 || !bc || values.name) return;

    const timer = setTimeout(async () => {
      try {
        const resp = await bankNameEnquiryTrigger({
          accountNumber: ac,
          bankCode: String(bc),
        }).unwrap();
        if (resp?.isSuccess && resp?.data) {
          setFieldValue('name', resp.data);
        } else if (resp && !resp.isSuccess) {
          errorToast(resp?.message || 'Could not get beneficiary account name');
        }
      } catch (e) {
        const msg = getErrorMessage(e) || 'Failed to resolve account name';
        errorToast(msg);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.accountNumber, values.bankCode]);

  useEffect(() => {
    if (addBeneficiaryResponse?.isSuccess) {
      toggleAddAccount(false);
      refetch && refetch();
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addBeneficiaryResponse]);

  useEffect(() => {
    if (addWithdrawResponse?.isSuccess) {
      refetch && refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addWithdrawResponse]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }));
  }, [pagination]);

  const handleParamChange = (param: Partial<InvoiceParams>) => {
    setParams((prev) => ({ ...prev, ...param }));
  };

  const tractionHeaders = [
    {
      header: 'Sender',
      accessorKey: 'sourceAccountName',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
    },
    {
      header: 'Recipient',
      accessorKey: 'destinationAccountName',
    },
    {
      header: 'Date',
      accessorKey: 'transactionDate',
      cell: ({ row }: any) => (
        <span>{formatDate(row.original.transactionDate)}</span>
      ),
    },
    {
      header: 'Transaction Type',
      accessorKey: 'transactionType',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <Label type="type" value={row.original.transactionType} />
      ),
    },
  ];

  const invoiceHeaders = [
    {
      header: 'Project name',
      accessorKey: 'title',
      cell: ({ row }: any) => (
        <span>{row.original.paymentSchedule?.project?.title}</span>
      ),
    },
    {
      header: 'Creative',
      accessorKey: 'creative',
      cell: ({ row }: any) => {
        const image = row.original.creativeUser?.profilePicture;
        const firstName = row.original.creativeUser?.firstName;
        const lastName = row.original.creativeUser?.lastName;
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
            2: 'Due',
            3: 'Closed',
          }}
        />
      ),
    },
  ];

  if (loading) {
    return <MiniLoader message="Loading" />;
  }

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <div className="invoice_payment_bg">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between px-8 py-16">
          <div className="text-white">
            <h3>Wallet Balance</h3>
            <span className="font-medium text-4xl">
              {numberFormat(data?.availableBalance || 0)}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              className="text-[#E7E7E7] font-bold border border-[#F1F1F1] rounded-full flex items-center justify-center p-4 gap-4 hover:border-[#FFF]"
              onClick={() => {
                setIsWithdrawFlowOpen(true);
              }}
            >
              <ArrowRightUp />
              <span>Withdraw Funds</span>
            </button>
            <button
              className="bg-white rounded-full p-4 gap-4 flex items-center justify-center hover:bg-[F1F1F1] transition-colors"
              onClick={() => toggleAddFunds(true)}
            >
              <PlusBlack />
              <span>Add Funds</span>
            </button>
            <WithdrawalFlowManager
              isOpen={isWithdrawFlowOpen}
              onClose={() => setIsWithdrawFlowOpen(false)}
              wallet={myWalletData?.data}
              beneficiaries={beneficiaryData?.data || []}
              refetchBeneficiaries={refetch}
              refetchWallet={refetchWallet}
              onAddAccount={() => {
                setIsWithdrawFlowOpen(false);
                toggleAddAccount(true);
              }}
            />
          </div>
        </div>
      </div>

      <div className="px-8 py-10">
        <div className="mb-6">
          <div className="flex gap-4">
            {(['Transaction History', 'Invoice'] as ViewTab[]).map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 text-sm font-medium border rounded-full ${
                  activeViewTab === tab
                    ? 'border-[#262626]'
                    : 'border-[#0000001A] hover:text-gray-900'
                }`}
                onClick={() => setActiveViewTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeViewTab === 'Transaction History' ? (
          <Fragment>
            <TabSelector
              tabs={transactionTabOptions.map(({ label, value }) => ({
                label: `${label} (${filteredCounts[value as TransactionTab]})`,
                value,
              }))}
              activeTab={activeTransactionTab}
              onTabChange={(val) =>
                setActiveTransactionTab(val as TransactionTab)
              }
              activeClass="bg-[#26A17B] text-white"
              inactiveClass="bg-white text-[#262626]"
            />
            {loading ? (
              <div className="text-center mt-10 flex justify-center items-center">
                <MiniLoader message="loading" />
              </div>
            ) : (
              <Table
                columns={tractionHeaders}
                emptyTitle="No transaction Yet"
                emptyMessage="Transactions will be added here"
                data={transactionData.filter((d) =>
                  activeTransactionTab === 'All'
                    ? true
                    : d.transactionType ===
                      transactionTypeMap[activeTransactionTab],
                )}
                pagination={pagination}
                setPagination={setPagination}
              />
            )}
          </Fragment>
        ) : (
          <Fragment>
            <div className="app_dashboard_home__task__hdr flex-wrap gap-2">
              <div className="mb-6 flex flex-wrap gap-2">
                {invoiceTabs.map((item) => (
                  <Pill
                    key={item.value}
                    size="md"
                    active={selectedCategory === item.value}
                    onClick={() => {
                      setSelectedCategory(item.value);
                      handleParamChange({
                        status: item.value === 'All' ? undefined : item.value,
                      });
                    }}
                  >
                    {item.label}
                  </Pill>
                ))}
              </div>
              <SearchInput
                placeholder="Search Invoices..."
                onChange={(e) => {
                  handleParamChange({ searchKey: e.target.value });
                }}
              />
            </div>

            <Table
              columns={invoiceHeaders}
              data={allInvoicesData?.data || []}
              pagination={pagination}
              setPagination={setPagination}
              emptyTitle="No Invoice"
              emptyMessage="Invoices will be added here"
              onRowClick={(row) =>
                router.push(`/client/dashboard/payment/${row.id}`)
              }
            />
          </Fragment>
        )}
      </div>
      {/* add funds */}
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
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {myWalletData?.data?.accountNumber || 'N/A'}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-0 m-0"
                aria-label="Copy account number"
              >
                <Copy />
              </button>
              {copied && (
                <span className="text-sm text-green-500">Copied!</span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#808080]">Bank</span>
            <span className="font-semibold">
              {myWalletData?.data?.bankName || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#808080]">Account Name</span>
            <span className="font-semibold">
              {myWalletData?.data?.walletName || 'N/A'}
            </span>
          </div>
        </div>
      </CenterModal>

      {/* add account number */}
      <SideModal
        isOpen={addAccount}
        onClose={() => {
          toggleAddAccount(false);
        }}
        title="Add Account"
        showFooter
        usebg
      >
        <div className="">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <Input
                name="accountNumber"
                type="text"
                id="accountNumber"
                placeholder="Enter your Account Number"
                value={values.accountNumber}
                maxLength={10}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,10}$/.test(val)) {
                    handleChange(e);
                  }
                }}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <Select
                name="bankCode"
                options={bankOptions}
                isSearchable={true}
                placeholder="Bank"
                value={
                  bankOptions.find((opt) => opt.value === values.bankCode) ||
                  null
                }
                onChange={(selected) => {
                  setFieldValue('bankCode', selected?.value || '');
                  setSelected(selected?.value || '');
                }}
                className="mt-10"
                classNamePrefix="react-select"
                filterOption={customFilter}
                noOptionsMessage={() => 'No match found'}
              />
            </div>

            <div className="relative">
              <Input
                name="name"
                type="text"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                placeholder="Account Name"
                className="mt-10"
                disabled
              />
              {bankNameLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={18} className="animate-spin text-[#7B37F0]" />
                </div>
              )}
            </div>

            <div className="flex gap-4 w-full mt-32">
              <Button
                size="md"
                type="button"
                backgroundColor="transparent"
                color="primary-blue-500"
                className="w-full hover:bg-transparent app_auth_login__btn border border-[#F1F1F1]"
                onClick={() => toggleAddAccount(false)}
              >
                Close
              </Button>
              <Button
                size="md"
                isLoading={isAddingBeneficiary}
                type="submit"
                backgroundColor="primary-blue-500"
                className="w-full app_auth_login__btn"
                disabled={!(isValid && dirty)}
              >
                Add
              </Button>
            </div>
          </form>
        </div>
      </SideModal>
    </div>
  );
}
