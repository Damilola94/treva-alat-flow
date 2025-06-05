/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  ArrowDownLeft,
  Ellicon,
  Plus,
  SmallAvatar,
  SmallHome,
} from '@/app/assets/svgs';
import {
  CenterModal,
  Delete,
  Label,
  MiniLoader,
  Pill,
  SideModal,
  Table,
} from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import SearchInput from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { clientDashboardTasks } from '@/constants';
import {
  useBeneficiaryManagement,
  useCommon,
  usePaymentService,
  useProjects,
} from '@/hooks/Projects';
import { useProfile, useUsers } from '@/hooks/Users';
import dashboard from '@/lib/assets/dashboard';
import projectManagement from '@/lib/assets/project-management';
import { numberFormat } from '@/lib/numbers';
import routes from '@/lib/routes';
import { formatDate, getAvatar, getFullName } from '@/lib/utils';
import { errorToast, successToast } from '@/services';
import { useDeleteBeneficiaryMutation } from '@/services/paymentService';
import { getErrorMessage } from '@/utils';
import { useFormik } from 'formik';
// import queries from '@/services/queries/profile';
import { Copy, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import Select from 'react-select';

interface ProjectQueryParams {
  type?: string;
  status?: string;
  priority?: string;
  currency: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
  accountNumber: number;
  availableBalance: number;
  bankName: string;
  walletId: string;
  bankCode: number;
  name: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  accountNumber: Yup.string()
    .matches(/^\d+$/, 'Must be a number')
    .length(10, 'Account number must be exactly 10 digits')
    .required('Account number is required'),
  bankCode: Yup.string().required('Bank code is required'),
  // bankName: Yup.string().required('Bank name is required'),
});

export default function Dashboard() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [popOver, togglePopOver] = useState(false);
  const [withdraw, toggleWithdraw] = useState(false);
  const [addFunds, toggleAddFunds] = useState(false);
  const [addAccount, toggleAddAccount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [, setSelected] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);

  const { data } = useProfile();
  const userData = useMemo(() => data?.data || null, [data]);

  const [params, setParams] = useState<ProjectQueryParams>({
    currency: 'NGN',
    pageNumber: 1,
    pageSize: 4,
    searchKey: '',
    walletId: '',
    accountNumber: 0,
    availableBalance: 0,
    bankName: '',
    bankCode: 0,
    name: '',
  });

  const initialValues = {
    name: '',
    accountNumber: '',
    bankCode: '',
    // bankName: '',
  };

  const { userOnboardingData } = useUsers();
  const { allProjectsData, loading } = useProjects(params);
  const { myWalletData } = usePaymentService(params);
  const { myCommonData } = useCommon();
  const { beneficiaryData, refetch } = useBeneficiaryManagement(params);
  const { addBeneficiary, addBeneficiaryResponse } = useBeneficiaryManagement();
  const [triggerDelete, { isLoading }] = useDeleteBeneficiaryMutation();
  const {
    addWithdrawFunds,
    addWithdrawResponse,
    loading: withdrawing,
  } = usePaymentService(params);
  const wallet = myWalletData?.data;

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

  const openDeleteModal = (accountNumber: string) => {
    setAccountToDelete(accountNumber);
    setIsDecisionModalOpen(true);
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

  useEffect(() => {
    if (addWithdrawResponse?.isSuccess) {
      refetch && refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addWithdrawResponse]);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addBeneficiaryResponse]);

  const kpis = [
    { label: 'Active Project', value: '0' },
    { label: 'Completed Project', value: '0' },
    { label: 'To-do Task', value: '0' },
    {
      label: (
        <div className="relative w-full font-spaceGrotesk">
          <div className="flex justify-between">
            <span>Wallet balance</span>
            <span className="relative">
              <Popover open={popOver} onOpenChange={togglePopOver}>
                <PopoverTrigger>
                  <Ellicon />
                </PopoverTrigger>
                <PopoverContent>
                  <button
                    onClick={() => {
                      toggleAddFunds(true);
                      togglePopOver(false);
                    }}
                    className="app_popover__content__item"
                  >
                    <div className="flex gap-3 text-[#7B37F0] items-center">
                      <span>
                        <Plus />
                      </span>
                      Add funds
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      toggleWithdraw(true);
                      togglePopOver(false);
                    }}
                    className="app_popover__content__item"
                  >
                    <div className="flex gap-3 text-[#7B37F0] items-center">
                      <span>
                        <ArrowDownLeft />
                      </span>
                      Withdraw funds
                    </div>
                  </button>
                </PopoverContent>
              </Popover>
            </span>
          </div>
        </div>
      ),
      value: numberFormat(wallet?.availableBalance ?? 0),
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const headers = [
    {
      header: 'Project Name',
      accessorKey: 'title',
    },
    {
      header: 'Creative',
      accessorKey: 'creativeUser',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const creative = row.original.creativeUser?.profilePicture;
        const firstName = row.original.creativeUser?.firstName;
        const lastName = row.original.creativeUser?.lastName;

        return (
          <div className="flex items-center gap-2">
            <Image
              src={creative || projectManagement.female}
              alt={firstName}
              className="w-6 h-6 rounded-full"
              width={100}
              height={100}
            />
            <span>
              {firstName} {lastName}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Due Date',
      accessorKey: 'expectedDeliveryDate',
      cell: ({ row }: any) => (
        <span>{formatDate(row.original.expectedDeliveryDate)}</span>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const value = row.original.priority;
        return (
          <div className="">
            <Label type="priority" value={value} showIcon />
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const tableBody = useMemo(() => {
    return allProjectsData?.isSuccess && allProjectsData.data
      ? allProjectsData.data
      : [];
  }, [allProjectsData?.isSuccess, allProjectsData?.data]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      pageNumber: pagination?.pageIndex + 1,
      pageSize: pagination?.pageSize,
    }));
  }, [pagination]);

  const handleParamChange = (param: Partial<ProjectQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...param,
    }));
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

  useEffect(() => {
    if (!userOnboardingData?.data?.isCompleted && userOnboardingData?.data) {
      router.push(routes.client.dashboard.getStarted.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOnboardingData]);

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <div className="app_dashboard_home__header">
        <div className="app_dashboard_home__header__profile_con app_dashboard_page__px">
          <div className="app_dashboard_home__header__profile">
            {false && (
              <div className="app_dash_main__aside__btm__avi">
                <Image
                  src={dashboard.avi}
                  alt="avi"
                  className="w-full"
                  width={100}
                  height={100}
                />
              </div>
            )}
            <Avatar
              src={getAvatar({
                name: userData && getFullName(userData),
                length: 2,
              })}
            />
            <h4 className="app_dashboard_home__header__profile__h4">
              Welcome, {userData?.firstName}
            </h4>
          </div>
        </div>

        <div className="app_dashboard_home__kpis grid grid-cols-4 app_dashboard_page__px">
          {kpis.map((item, index) => {
            const IS_WALLET = kpis.length === index + 1;

            return (
              <div
                className={`app_dashboard_home__kpis__item ${
                  IS_WALLET
                    ? 'app_dashboard_home__kpis__item--wallet overflow-visible'
                    : ''
                }`}
                key={index}
              >
                <h6 className="app_dashboard_home__kpis__item__h6">
                  {item.label}
                </h6>

                <p className="app_dashboard_home__kpis__item__value">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2 mt-4">
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap mt-7">
            {clientDashboardTasks.map((item) => (
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
            placeholder="Search for a Project"
            onChange={(e) => {
              handleParamChange({ searchKey: e.target.value });
            }}
          />
        </div>

        {loading ? (
          <div className="text-center mt-10 flex justify-center items-center">
            <MiniLoader message="loading" />
          </div>
        ) : (
          <Table
            columns={headers}
            emptyTitle="No Project Yet"
            emptyMessage="You'll see all your projects here"
            data={tableBody}
            pagination={pagination}
            setPagination={setPagination}
          />
        )}
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
            {/* <div className="flex justify-between items-center">
            <span className="text-[#808080]">Account Name</span>
            <span className="font-semibold"></span>
          </div> */}
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
                  onClick={() => toggleAddAccount(false)}
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
                  console.log(setWithdrawAmount, 'withdraw amount');
                  console.log(e.target.value, 'value');
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
                      console.log('Selected:', item);
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
                className="border p-3 bg-[#F9403A] rounded-full w-full border-[#F1F1F1] text-[#fff]"
                onClick={() => handleDelete(accountToDelete)}
                disabled={isLoading || !accountToDelete}
                type="button"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin mx-auto" />
                ) : (
                  'Delete'
                )}
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
    </div>
  );
}
