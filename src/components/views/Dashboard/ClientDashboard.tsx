'use client';

import {
  ArrowDownLeft,
  EditIcon,
  Ellicon,
  Plus,
  SmallAvatar,
  SmallHome,
} from '@/app/assets/svgs';
import {
  // AnimatedModal,
  CenterModal,
  Label,
  // ClientIcon,
  /* EmptyStatus */
  // PersonalIcon,
  Pill,
  /* PlusIcon, */
  // RenderIf,
  SideModal,
  Table,
} from '@/components/shared';
import { Avatar } from '@/components/shared/avatar';
import { Select } from '@/components/shared/select';
import SearchInput from '@/components/ui/SearchInput';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { clientDashboardTasks, mockProjects } from '@/constants';
import dashboard from '@/lib/assets/dashboard';
import { numberFormat } from '@/lib/numbers';
import { getAvatar, getFullName } from '@/lib/utils';
import queries from '@/services/queries/profile';
import Image from 'next/image';
import React, { useState } from 'react';

export default function Dashboard () {
  const [popOver, togglePopOver] = useState(false);
  const [withdraw, toggleWithdraw] = useState(false);
  const [addFunds, toggleAddFunds] = useState(false);
  const [editAccount, toggleEditAccount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data } = queries.read();

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
      value: numberFormat(0),
    },
  ];

  // to handle pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const headers = [
    {
      header: 'Project Name',
      accessorKey: 'name',
    },
    {
      header: 'Creative',
      accessorKey: 'creative',
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
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
      <div className="app_dashboard_home__header">
        <div className="app_dashboard_home__header__profile_con app_dashboard_page__px">
          <div className="app_dashboard_home__header__profile">
            {false && (
              <div className="app_dash_main__aside__btm__avi">
                <Image src={dashboard.avi} alt="avi" className="w-full" />
              </div>
            )}
            <Avatar src={getAvatar({ name: getFullName(data), length: 2 })} />
            <h4 className="app_dashboard_home__header__profile__h4">
              Welcome, {data?.firstName}
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
        <div className="app_dashboard_home__task__hdr flex-wrap gap-2">
          <div className="flex md:flex-wrap gap-2">
            {clientDashboardTasks.map((item) => (
              <Pill
                key={item.value}
                size="md"
                active={selectedCategory === item.value}
                onClick={() => {
                  setSelectedCategory(item.value);
                }}
              >
                {item.label}
              </Pill>
            ))}
          </div>

          <SearchInput placeholder="Search for a Project" />
        </div>

        <Table
          columns={headers}
          emptyTitle="No Task Yet"
          emptyMessage="Click “add new request” button to get started"
          data={mockProjects}
          pagination={pagination}
          setPagination={setPagination}
        />

        <CenterModal
          title="Add Funds"
          isOpen={addFunds}
          onClose={() => {
            toggleAddFunds(false)
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
            toggleEditAccount(false)
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
    </div>
  );
}
