'use client';

import { AnimatedModal, Pill, PlusIcon, RenderIf } from '@/components/shared';
import { ClientTable } from '@/components/shared/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { Fragment, useState } from 'react';
import {
  TakeATour,
  AddClient,
  DeleteClient,
  EditClient
} from '@/components/shared/client-management';
import projectManagement from '@/lib/assets/project-management';
import queries from '@/services/queries/client-management';

const viewTakeATour = {
  img: projectManagement.topImage,
  title: 'Add new client',
  details:
    "You're almost there! Complete your onboarding to unlock the full potential of Creathrivity and start achieving your goals today.",
  btnText1: 'Start tour',
  btnText2: 'Skip',
  bottomInfo: ''
};

const deleteClient = {
  img: projectManagement.topImage,
  title: 'Are you sure you want to delete this client',
  details: 'Client’s record will be deleted Permanently',
  btnText1: 'Cancel',
  btnText2: 'Delete'
};

export default function Page () {
  const [takeATour, setTakeATour] = useState(true);
  const [addClientForm, setAddClientForm] = useState(true);
  const [editForm, setEditForm] = useState(true);
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [deleteForm, setDeleteForm] = useState(false);
  const [search, setSearch] = useState('');

  const { refetch } = queries.read({ search });

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
    setDeleteForm(!deleteForm)
  }

  const handleTakeTourClick = () => {
    setTakeATour(!takeATour);
  };

  const onEdit = (id: string) => {
    setEditClientId(id)
    setEditForm(!editForm);
  };

  const handleEditClient = () => {
    setEditForm(!deleteForm);
  };

  return (
    <div className="app_dashboard_page app_dashboard_home">
      <RenderIf condition={!addClientForm}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'right',
              onClose: handleAddProjectClick,
              className:
                'lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7  '
            }}
          >
            <AddClient onClose={handleAddProjectClick} />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <RenderIf condition={!editForm}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'right',
              onClose: onEdit,
              className:
                'lg:absolute lg:bottom-0 lg:right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col lg:mb-2 lg:mr-2 mx-7'
            }}
          >
            {editClientId && <EditClient id={editClientId} item={editClientId} handleClick={() => { setEditForm(false); }} onClose={handleEditClient} />}
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <RenderIf condition={takeATour}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'middle',
              onClose: handleTakeTourClick,
              className: 'sm:max-w-[300px] h-[420px] p-0 mx-7 lg:mx-0 '
            }}
          >
            <TakeATour item={viewTakeATour} handleClick={handleTakeTourClick} />
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <RenderIf condition={deleteForm}>
        <Fragment>
          <AnimatedModal
            {...{
              isOpen: true,
              from: 'middle',
              onClose: onDelete,
              className: 'sm:max-w-[450px] h-[300px] p-0 mx-7 lg:mx-0'
            }}
          >
              {deleteClientId && <DeleteClient clientId={deleteClientId} item={deleteClient} handleClick={() => { setDeleteForm(false); }} onClose={handleDeleteClient} />}
          </AnimatedModal>
        </Fragment>
      </RenderIf>

      <div className="app_dashboard_home__task app_dashboard_page__px">
        <div className="app_dashboard_home__task__hdr md:flex-wrap gap-4 mt-4">
          <div className="flex flex-wrap gap-2">
            {/* {Object.entries(Clients).map(([label]) => (
              <Pill
                key={label}
                size="md"
                active={Clients['All Client'] === label}
              >
                {label}
              </Pill>
            ))} */}
            <Pill size="md" active={search === ''} onClick={clearSearch} className="whitespace-nowrap">
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

        <ClientTable onEdit={onEdit} onDelete={onDelete} search={search} />
      </div>
    </div>
  );
}
