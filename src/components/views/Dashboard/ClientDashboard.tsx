/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ArrowDownLeft, Ellicon, Plus} from '@/app/assets/svgs';
import {CenterModal,Copy,Label,MiniLoader,Pill,SideModal,Table,} from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import SearchInput from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Popover,PopoverContent,PopoverTrigger,} from '@/components/ui/popover';
import { clientDashboardTasks } from '@/constants';
import {useBeneficiaryManagement,useCommon,useDashboardSummaryCount,usePaymentService,useProjects,} from '@/hooks/Projects';
import { useProfile, useUsers } from '@/hooks/Users';
import dashboard from '@/lib/assets/dashboard';
import projectManagement from '@/lib/assets/project-management';
import { numberFormat } from '@/lib/numbers';
import routes from '@/lib/routes';
import { formatDate, getAvatar, getFullName } from '@/lib/utils';
import { errorToast } from '@/services';
import {useBankNameEnquiryMutation,} from '@/services/paymentService';
import { getErrorMessage } from '@/utils';
import { useFormik } from 'formik';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import Select from 'react-select';
import { WithdrawalFlowManager } from '@/components/shared/project-management/wallet-flow-manager';

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

  const initialValues = {
    name: '',
    accountNumber: '',
    bankCode: '',
    // bankName: '',
  };

  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [popOver, togglePopOver] = useState(false);
  const [addFunds, toggleAddFunds] = useState(false);
  const [addAccount, toggleAddAccount] = useState(false);
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    clientDashboardTasks?.[0]?.value ?? null,
  ); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [, setSelected] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [withdrawAmount, setWithdrawAmount] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
  const [isWithdrawFlowOpen, setIsWithdrawFlowOpen] = useState(false);

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
  const { data } = useProfile();
  const userData = useMemo(() => data?.data || null, [data]);
  const { userOnboardingData } = useUsers();
  const { allProjectsData, loading } = useProjects(params);
  const { myWalletData } = usePaymentService(params);
  const { myCommonData } = useCommon();
  const { dashboardSummaryCountData } = useDashboardSummaryCount();
  const { beneficiaryData, refetch } = useBeneficiaryManagement(params);
  const { addBeneficiary, addBeneficiaryResponse } = useBeneficiaryManagement();
  const [bankNameEnquiryTrigger, { isLoading: bankNameLoading }] =useBankNameEnquiryMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {addWithdrawFunds,addWithdrawResponse} = usePaymentService(params);
   const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const wallet = myWalletData?.data;
  const summaryCount = dashboardSummaryCountData?.data;

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

  useEffect(() => {
    if (addWithdrawResponse?.isSuccess) {
      refetch && refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addWithdrawResponse]);

  useEffect(() => {
    if (!selectedCategory && clientDashboardTasks?.length) {
      const first = clientDashboardTasks[0].value;
      setSelectedCategory(first);
      handleParamChange({ status: first === 'All' ? undefined : first });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientDashboardTasks]);

    useEffect(() => {
    setParams((prev) => ({
      ...prev,
      pageNumber: pagination?.pageIndex + 1,
      pageSize: pagination?.pageSize,
    }));
  }, [pagination]);

  useEffect(() => {
    if (!userOnboardingData?.data?.isCompleted && userOnboardingData?.data) {
      router.push(routes.client.dashboard.getStarted.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOnboardingData]);

   useEffect(() => {
    if (addBeneficiaryResponse?.isSuccess) {
      toggleAddAccount(false);
      refetch && refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addBeneficiaryResponse]);

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

    const handleCopy = () => {
    if (!myWalletData?.data?.accountNumber) return;
    navigator.clipboard
      .writeText(myWalletData?.data?.accountNumber)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

 const handleParamChange = (param: Partial<ProjectQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...param,
    }));
  };

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
              unoptimized
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

   const kpis = [
    { label: 'Active Project', value: summaryCount?.totalActiveProjects || 0 },
    {
      label: 'Completed Project',
      value: summaryCount?.totalCompletedProjects || 0,
    },
    {
      label: 'Awaiting Confirmation',
      value: summaryCount?.totalProjectsAwaitingClientConfirmation || 0,
    },
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
                      // toggleWithdraw(true);
                      setIsWithdrawFlowOpen(true)
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
                <WithdrawalFlowManager
                  isOpen={isWithdrawFlowOpen}
                  onClose={() => setIsWithdrawFlowOpen(false)}
                  wallet={myWalletData?.data}
                  beneficiaries={beneficiaryData?.data || []}
                  refetchBeneficiaries={refetch}
                  onAddAccount={() => {
                    setIsWithdrawFlowOpen(false);
                    toggleAddAccount(true);
                  }}
                />
              </Popover>
            </span>
          </div>
        </div>
      ),
      // value: numberFormat(wallet?.availableBalance ?? 0),
      value: (
        <div className="flex items-center justify-between w-full">
          <span>
            {showBalance
              ? numberFormat(wallet?.availableBalance ?? 0)
              : `NGN ••••••`}
          </span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            {showBalance ? (
              <Eye size={20} className="text-black" />
            ) : (
              <EyeOff size={20} className="text-black" />
            )}
          </button>
        </div>
      ),
    },
  ];

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
                  unoptimized
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

      <div className="app_dashboard_home__task app_dashboard_page__px pt-4">
        <div className="app_dashboard_home__task__hdr flex gap-4 mt-4 flex-wrap overflow-x-auto">
          <div className="flex">
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
              <span className="font-semibold">Geegs - IDEAx Labs</span>
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
                    <Loader2
                      size={18}
                      className="animate-spin text-[#7B37F0]"
                    />
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
    </div>
  );
}
