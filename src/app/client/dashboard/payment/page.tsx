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
  Delete,
} from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import SearchInput from '@/components/ui/SearchInput';
import TabSelector from '@/components/shared/TabSelector';
import { invoiceTabs } from '@/constants';
import usePaymentService from '@/hooks/Projects/usePayment';
import { useInvoices } from '@/hooks/Projects/useProjects';
import projectManagement from '@/lib/assets/project-management';
import { numberFormat } from '@/lib/numbers';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { SmallAvatar, SmallHome } from '@/app/assets/svgs';
import { Copy, Plus } from 'lucide-react';
import { useBeneficiaryManagement, useCommon } from '@/hooks/Projects';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import {
  useDeleteBeneficiaryMutation,
  useGetTransactionsQuery,
} from '@/services/paymentService';
import { errorToast, successToast } from '@/services';
import { getErrorMessage } from '@/utils';
import Select from 'react-select';

type TransactionTab = 'All' | 'Credit' | 'Debit';
type ViewTab = 'Transaction History' | 'Invoice';
interface InvoiceParams {
  status?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

// Tabs config
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
  const [withdraw, toggleWithdraw] = useState(false);
  const [addFunds, toggleAddFunds] = useState(false);
  const [addAccount, toggleAddAccount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<ViewTab>(
    'Transaction History',
  );
  const [, setSelected] = useState<string | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);

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
  const { myWalletData } = usePaymentService(params);
  const {
    addWithdrawFunds,
    addWithdrawResponse,
    loading: withdrawing,
  } = usePaymentService(params);
  const { myCommonData } = useCommon();
  const { beneficiaryData, refetch } = useBeneficiaryManagement(params);
  const { addBeneficiary, addBeneficiaryResponse, loading } =
    useBeneficiaryManagement();
  const [triggerDelete, { isLoading }] = useDeleteBeneficiaryMutation();
  const walletId = myWalletData?.data?.accountNumber ?? '';
  // const { myTransactions } = usePaymentService(params);
  const { data: myTransactions } = useGetTransactionsQuery(walletId);

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

  const handleWithdrawFunds = async () => {
    const walletId = myWalletData?.data?.accountNumber;
    const payload = {
      beneficiaryAccountNumber: selectedBeneficiary.accountNumber,
      amount: Number(withdrawAmount),
      walletId: walletId,
    };
    addWithdrawFunds(payload);
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

  const handleDelete = async (accountNumber?: string | null) => {
    if (!accountNumber) {
      errorToast('Invalid account number');
      return;
    }
    try {
      const response = await triggerDelete(accountNumber).unwrap();
      if (response?.isSuccess) {
        successToast(response?.message || 'Account deleted successfully');
        await refetch();
        setIsDecisionModalOpen(false);
      } else {
        errorToast(response?.message || 'Something went wrong');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      errorToast(message || 'Something went wrong');
    }
  };

  const filteredCounts = {
    All: transactionData.length,
    Credit: transactionData.filter((d) => d.transactionType === 'Credit')
      .length,
    Debit: transactionData.filter((d) => d.transactionType === 'Debit').length,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const payload = {
        name: values?.name,
        bankCode: values?.bankCode,
        accountNumber: values?.accountNumber,
      };
      addBeneficiary(payload);
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
      header: 'Description',
      accessorKey: 'narration',
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
              onClick={() => toggleWithdraw(true)}
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
            <Table
              columns={tractionHeaders}
              emptyTitle="No transaction Yet"
              emptyMessage="Transactions will be added here"
              data={transactionData.filter(
                (d) =>
                  activeTransactionTab === 'All'
                    ? true
                    : d.transactionType === activeTransactionTab,
                // : d.transactionType?.toLowerCase() === activeTransactionTab.toLowerCase()
              )}
              // data={transactionData}
              pagination={pagination}
              setPagination={setPagination}
            />
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
                {myWalletData?.data?.accountNumber}
              </span>
              <Copy
                className="w-4 h-4 cursor-pointer hover:text-primary"
                onClick={handleCopy}
              />
              {copied && (
                <span className="text-sm text-green-500">Copied!</span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#808080]">Bank</span>
            <span className="font-semibold">
              {myWalletData?.data?.bankName}{' '}
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

            <div>
              <Input
                name="name"
                type="text"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                placeholder="Enter account name"
                className="mt-10"
              />
            </div>

            <div className="flex gap-4 w-full mt-32">
              <Button
                size="md"
                type="button"
                backgroundColor="transparent"
                color="primary-blue-500"
                className="w-full hover:bg-transparent app_auth_login__btn border border-[#F1F1F1]"
                onClick={() => toggleWithdraw(true)}
              >
                Close
              </Button>
              <Button
                size="md"
                isLoading={loading}
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

      {/* withdraw funds side modal */}
      <SideModal
        isOpen={withdraw}
        onClose={() => {
          toggleWithdraw(false);
        }}
        title="Withdraw Funds"
        showFooter
        usebg
        footerChildren={
          <div className="w-full gap-5">
            <button
              disabled={
                !selectedBeneficiary ||
                !withdrawAmount ||
                !Number(withdrawAmount)
              }
              className={`border p-5 rounded-full w-full ${
                selectedBeneficiary && withdrawAmount
                  ? 'bg-[#7B37F0] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleWithdrawFunds}
            >
              {withdrawing ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        }
      >
        <div className="space-y-10">
          <div>
            {/* <Input placeholder="Withdrawal Amount" /> */}
            <Input
              placeholder="Withdrawal Amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
              }}
            />
            <div>
              <p className="font-semibold mt-3">
                {numberFormat(myWalletData?.data?.availableBalance)}
              </p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold ">Select Bank Account</p>
              <button
                className="flex items-center rounded-2xl p-2 gap-1 border border-black"
                onClick={() => {
                  toggleWithdraw(false);
                  toggleAddAccount(true);
                }}
              >
                <Plus className="w-5 h-5" />
                <p>Add Account</p>
              </button>
            </div>
            {Array.isArray(beneficiaryData?.data) &&
              beneficiaryData.data.map((item: any) => (
                <div
                  // className="border p-4 rounded-lg border-[#888888]"
                  key={item?.id || item?.accountNumber}
                  onClick={() => {
                    setSelectedBeneficiary(item);
                  }}
                  className={`p-4 border rounded cursor-pointer ${
                    selectedBeneficiary?.accountNumber === item.accountNumber
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xl text-[#333333]">
                      {item?.accountNumber}
                    </p>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDecisionModalOpen(true);
                        setAccountToDelete(item?.accountNumber)
                      }}
                      className="cursor-pointer"
                    >
                      <Delete />
                    </div>
                  </div>
                  <div className="text-[#262626] space-y-3 mt-5">
                    <p className="flex items-center gap-3">
                      <span>
                        <SmallHome />
                      </span>
                      {item?.bankName}
                    </p>
                    <p className="flex items-center gap-3">
                      <SmallAvatar />
                      {item?.name}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </SideModal>

      {/* delete modal */}
      <CenterModal
        headerImageType={3}
        isOpen={isDecisionModalOpen}
        onClose={() => {
          setIsDecisionModalOpen(false);
          setAccountToDelete(null);
        }}
        showFooter
        footerChildren={
          <div className="w-full flex items-center gap-5">
            <button
              className="border p-3 rounded-full w-full border-[#F1F1F1] text-[#7B37F0]"
              onClick={() => {
                setIsDecisionModalOpen(false);
                setAccountToDelete(null);
              }}
            >
              Cancel
            </button>
            <button
              className="border p-3 bg-[#F9403A] rounded-full w-full border-[#F1F1F1] text-[#fff] disabled:opacity-50"
              onClick={() =>
                handleDelete(accountToDelete)
              }
              disabled={!accountToDelete || isLoading}
              type="button"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>

          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="font-semibold">
            Are you sure you want to delete account?
          </p>
          <p>Account will be deleted permanently</p>
        </div>
      </CenterModal>
    </div>
  );
}
