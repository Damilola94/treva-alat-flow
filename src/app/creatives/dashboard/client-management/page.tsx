'use client';

import React, { useState } from 'react';

import {
  AnimatedModal,
  Pill,
  PlusIcon,
  RenderIf,
  Table,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  TakeATour,
  AddClient,
  DeleteClient,
  EditClient,
} from '@/components/shared/client-management';
import projectManagement from '@/lib/assets/project-management';
import queries from '@/services/queries/client-management';
import clientManagement from '@/lib/assets/client-management';
import Image from 'next/image';
import { EditPencilGray, BinGray } from '@/components/shared/svgs';

const viewTakeATour = {
  img: projectManagement.topImage,
  title: 'Add client',
  details:
    "You're almost there! Complete your onboarding to unlock the full potential of Creathrivity and start achieving your goals today.",
  btnText1: 'Start tour',
  btnText2: 'Skip',
  bottomInfo: '',
};

const deleteClient = {
  img: projectManagement.topImage,
  title: 'Are you sure you want to delete this client',
  details: "Client's record will be deleted Permanently",
  btnText1: 'Cancel',
  btnText2: 'Delete',
};

export default function Page() {
  const [takeATour, setTakeATour] = useState(true);
  const [addClientForm, setAddClientForm] = useState(true);
  const [editForm, setEditForm] = useState(true);
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [deleteForm, setDeleteForm] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const { refetch } = queries.read({ search });

  const { data } = queries.read({
    search,
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  });

  const clientData = data?.data ?? [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    void refetch();
  };

  const clearSearch = () => {
    setSearch('');
    void refetch();
  };

  const onDelete = (id: string) => {
    setDeleteClientId(id);
    setDeleteForm(!deleteForm);
  };

  const handleAddProjectClick = () => {
    setAddClientForm(!addClientForm);
  };

  const handleDeleteClient = () => {
    setDeleteForm(!deleteForm);
  };

  const handleTakeTourClick = () => {
    setTakeATour(!takeATour);
  };

  const onEdit = (id: string) => {
    setEditClientId(id);
    setEditForm(!editForm);
  };

  const handleEditClient = () => {
    setEditForm(!deleteForm);
  };

  const columns = [
    {
      header: 'Client',
      accessorKey: 'fullName',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const client = row.original;
        return (
          <div className="app_table__tbody__td__ctt flex items-center">
            <Image
              src={client.imageUrl || clientManagement?.femaleClient}
              alt="client"
              width={100}
              height={100}
              className="w-8 h-8 rounded-full border-2 border-[#E4BACA] object-cover mr-3"
              unoptimized
            />
            {client.fullName}
          </div>
        );
      },
    },
    {
      header: 'Email address',
      accessorKey: 'emailAddress',
    },
    {
      header: 'Phone number',
      accessorKey: 'phoneNumber',
    },
    {
      header: 'Birthday',
      accessorKey: 'birthdayDayMonth',
    },
    {
      header: '',
      accessorKey: 'actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const client = row.original;
        return (
          <div className="app_table__tbody__td__ctt flex justify-center items-center space-x-4">
            <div
              className="cursor-pointer"
              onClick={() => {
                onEdit(client.id);
              }}
            >
              <EditPencilGray />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                onDelete(client.id);
              }}
            >
              <BinGray />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <RenderIf condition={!addClientForm}>
        <AnimatedModal
          isOpen={true}
          from="right"
          onClose={handleAddProjectClick}
          className="lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7"
        >
          <AddClient onClose={handleAddProjectClick} />
        </AnimatedModal>
      </RenderIf>

      <RenderIf condition={!editForm}>
        <AnimatedModal
          isOpen={true}
          from="right"
          onClose={onEdit}
          className="lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7"
        >
          {editClientId && (
            <EditClient
              id={editClientId}
              item={editClientId}
              handleClick={() => {
                setEditForm(false);
              }}
              onClose={handleEditClient}
            />
          )}
        </AnimatedModal>
      </RenderIf>

      {false && (
        <RenderIf condition={takeATour}>
          <AnimatedModal
            isOpen={true}
            from="middle"
            onClose={handleTakeTourClick}
            className="sm:max-w-[300px] h-[420px] p-0 mx-7 lg:mx-0"
          >
            <TakeATour item={viewTakeATour} handleClick={handleTakeTourClick} />
          </AnimatedModal>
        </RenderIf>
      )}

      <RenderIf condition={deleteForm}>
        <AnimatedModal
          isOpen={true}
          from="middle"
          onClose={onDelete}
          className="sm:max-w-[450px] h-[300px] p-0 mx-7 lg:mx-0"
        >
          {deleteClientId && (
            <DeleteClient
              clientId={deleteClientId}
              item={deleteClient}
              handleClick={() => {
                setDeleteForm(false);
              }}
              onClose={handleDeleteClient}
            />
          )}
        </AnimatedModal>
      </RenderIf>

      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr md:flex-wrap gap-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <Pill
              size="md"
              active={search === ''}
              onClick={clearSearch}
              className="whitespace-nowrap"
            >
              All Clients
            </Pill>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search for client"
              className="app_navbar__right__searchbar"
              value={search}
              onChange={handleSearchChange}
            />
            <Button
              size="md"
              onClick={handleAddProjectClick}
              backgroundColor="primary-blue-500"
              className="app_auth_login__btn"
            >
              <PlusIcon />
              Add client
            </Button>
          </div>
        </div>

        <div className="app_dashboard_home__task__ctt">
          <Table
            columns={columns}
            data={clientData}
            emptyTitle="No clients yet"
            emptyMessage="Click add client button to get started"
            pagination={pagination}
            setPagination={setPagination}
            rowDivider={true}
            manualPagination={true}
            pageCount={data?.metaData?.totalPages ?? 1}
            rowCount={data?.metaData?.totalCount ?? 0}
            // loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
