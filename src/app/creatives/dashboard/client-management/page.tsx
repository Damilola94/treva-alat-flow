'use client';

import React, { useEffect, useMemo, useState } from 'react';

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
import clientManagement from '@/lib/assets/client-management';
import Image from 'next/image';
import { EditPencilGray, BinGray } from '@/components/shared/svgs';
import { useClientManagement } from '@/hooks/Projects';
import { dayJs } from '@/utils';
import { extractName, getAvatar, getFullName } from '@/lib/utils';
import { Avatar } from '@/components/shared/avatar';

export interface IClient {
  avatarUrl: string;
  birthMonth: number;
  birthday: number;
  clientUserId: string;
  email: string;
  name: string;
  phoneNumber: string;
}

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
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const [params, setParams] = useState({
    birthday: '',
    birthmonth: '',
    pageNumber: 0,
    pageSize: 10,
    searchKey: '',
  });

  const { myClientData, loading, refetch } = useClientManagement(params);

  const clientData = useMemo(
    () => myClientData?.data || [],
    [myClientData?.data],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({
      ...prev,
      searchKey: e.target.value,
    }));
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch('');
    setParams((prev) => ({
      ...prev,
      searchKey: '',
    }));
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const client = row.original;
        return (
          <div className="app_table__tbody__td__ctt flex items-center">
            {client?.avatarUrl ? (
              <Image
                src={client.avatarUrl || clientManagement?.femaleClient}
                alt="client"
                width={100}
                height={100}
                className="w-8 h-8 rounded-full border-2 border-[#E4BACA] object-cover mr-3"
                unoptimized
              />
            ) : (
              <Avatar
                src={getAvatar({
                  name: client?.name
                    ? getFullName(extractName(client?.name))
                    : '',
                  length: 2,
                })}
                className="w-8 h-8 rounded-full border-[2.42px] border-[#A5A6F6] object-cover mr-3"
                size="sm"
              />
            )}
            {client.name}
          </div>
        );
      },
    },
    {
      header: 'Email address',
      accessorKey: 'email',
    },
    {
      header: 'Phone number',
      accessorKey: 'phoneNumber',
    },
    {
      header: 'Birthday',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const birthDay = row?.original?.birthday;
        const birthMonth = row?.original?.birthMonth;

        if (!birthDay || !birthMonth) return '-';

        const formattedDate = dayJs(`${birthMonth}-${birthDay}`, 'M-D').format(
          'MMMM D',
        );

        return formattedDate; // e.g., "May 23"
      },
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
                onEdit(client.clientUserId);
                setSelectedClient(client);
              }}
            >
              <EditPencilGray />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                onDelete(client.clientUserId);
              }}
            >
              <BinGray />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (addClientForm || editForm || deleteForm) {
      refetch && refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addClientForm, editForm, deleteForm]);

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
              item={selectedClient}
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
        <div className="app_dashboard_home__task__hdr flex flex-col md:flex-row ">
          {/* md:flex-wrap gap-4 mt-4 */}
          <div className="">
            <Pill
              size="md"
              active={search === ''}
              onClick={clearSearch}
              className="whitespace-nowrap"
            >
              All Clients
            </Pill>
          </div>

          <div className="flex gap-4">
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
            pageCount={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((myClientData?.metaData as any)?.totalPages as number) ?? 1
            }
            rowCount={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((myClientData?.metaData as any)?.totalCount as number) ?? 0
            }
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
