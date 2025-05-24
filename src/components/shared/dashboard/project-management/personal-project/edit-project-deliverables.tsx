/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';
import {
  AnimatedModal,
  CalendarWithMark,
  Delete,
  EditIcon,
  PlusIcon,
  RenderIf,
} from '@/components/shared';
import { AddDeliverables } from '@/components/shared/project-management.tsx/add-deliverables';
import { EditDeliverables } from '@/components/shared/project-management.tsx/edit-deliverables';
import {
  useDeleteDeliverableMutation,
  useGetDeliverablesQuery,
} from '@/services';
import { clearValues } from '@/store/slices/project';
import { useAppDispatch } from '@/store';
import { useDeliverable } from '@/hooks/Projects';
import projectManagement from '@/lib/assets/project-management';
import { DeleteDeliverable } from '../project-table/delete-deliverable';

interface Deliverable {
  deliverableId: string;
  name: string;
  description: string;
  startDate: string;
  dueDate: string;
}

const deleteDeliverableItem = {
  img: projectManagement.topImage,
  title: 'Are you sure you want to delete this deliverable?',
  details: 'deliverable record will be deleted Permanently',
  btnText1: 'Cancel',
  btnText2: 'Delete',
};

interface IProps {
  onClose?: () => void;
  projectId: string;
  deliverableId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditDeliverable?: (values: any) => void;
}

export function EditProjectDeliverables(props: IProps) {
  const { projectId } = props;
  const dispatch = useAppDispatch();
  const rt = useRouter();

  const [editForm, setEditForm] = useState(false);
  const [editDeliverableId, setEditDeliverableId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [deleteDeliverableId, setDeleteDeliverableId] = useState<string | null>(
    null,
  );
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [deliverableId, setDeliverableId] = useState<string>('');
  const [selectedDeliverable, setSelectedDeliverable] =
    useState<Deliverable | null>(null);

  const { allDeliverablesData, loading, refetchAllDeliverables } =
    useDeliverable(projectId);

  const { isLoading, refetch } = useGetDeliverablesQuery(
    { projectId },
    { refetchOnMountOrArgChange: true },
  );

  const [deleteDeliverables] = useDeleteDeliverableMutation();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseEditForm = () => {
    setEditForm(false);
    setEditDeliverableId(null);
  };

  const handleAddDeliverables = (newDeliverable: Deliverable) => {
    const deliverableWithId = {
      ...newDeliverable,
      deliverableId: newDeliverable.deliverableId || '',
    };
    setDeliverables((prev) => [...prev, deliverableWithId]);
    void refetch();
  };

  const onDelete = (id: string) => {
    setDeleteDeliverableId(id);
    setDeleteForm(!deleteForm);
  };

  const handleDeleteProject = () => {
    setDeleteForm(!deleteForm);
  };

  const onEdit = (id: string) => {
    const deliverableToEdit = deliverables.find((d) => d.deliverableId === id);
    if (!deliverableToEdit) {
      console.error('Cannot find deliverable with ID:', id);
      return;
    }
    setDeliverableId(id);
    setSelectedDeliverable(deliverableToEdit);
    setEditForm(false);
  };

  const handleFinish = () => {
    dispatch(clearValues());
    rt.push(routes.creatives.dashboard.projectManagement.path);
  };

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <AnimatedModal
        isOpen={isModalOpen}
        from="right"
        onClose={closeModal}
        className="absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2"
      >
        <AddDeliverables
          onClose={closeModal}
          projectId={projectId}
          onAddDeliverable={handleAddDeliverables}
          setDeliverableId={setDeliverableId}
        />
      </AnimatedModal>

      <RenderIf condition={editForm}>
        <AnimatedModal
          isOpen={editForm}
          from="right"
          onClose={handleCloseEditForm}
          className="absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2"
        >
          <EditDeliverables
            projectId={projectId}
            deliverableId={deliverableId}
            item={editDeliverableId ?? undefined}
            onClose={handleCloseEditForm}
            onEditDeliverable={(updatedDeliverable) => {
              setDeliverables((prev) =>
                prev.map((d) =>
                  d.deliverableId === updatedDeliverable.deliverableId
                    ? updatedDeliverable
                    : d,
                ),
              );
              void refetch();
            }}
          />
        </AnimatedModal>
      </RenderIf>

      <RenderIf condition={deleteForm}>
        <AnimatedModal
          isOpen={true}
          from="middle"
          onClose={onDelete}
          className="sm:max-w-[450px] h-[300px] p-0 mx-7 lg:mx-0"
        >
          {deleteDeliverableId && (
            <DeleteDeliverable
              projectId={deleteDeliverableId}
              deliverableId={deleteDeliverableId}
              item={deleteDeliverableItem}
              handleClick={() => {
                setDeleteForm(false);
              }}
              onClose={handleDeleteProject}
              refetchAllDeliverables={refetchAllDeliverables}
            />
          )}
        </AnimatedModal>
      </RenderIf>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        <h3 className="app_get_started_professional_details__form__title">
          Edit Deliverables <br />
          <span className="text-[#6D6D6D]">
            Add or edit deliverables for this project.
          </span>
        </h3>
        <div className="">
          <button
            className="flex gap-3 text-[#7D6CE8]"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <PlusIcon fill="var(--treva-purple-500)" />
            {deliverables.length > 0
              ? 'Add another deliverable'
              : 'Add deliverable'}
          </button>
        </div>

        <div>
          {allDeliverablesData?.data?.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-md shadow mb-4 flex justify-between items-center bg-[#E7E7E7] "
            >
              <div>
                <div className="flex items-center gap-60">
                  <h4 className="font-semibold mb-3">{item.name}</h4>
                  <div className="flex gap-4">
                    <EditIcon
                      className="cursor-pointer"
                      fill="#888888"
                      onClick={() => {
                        if (!item?.id) {
                          console.error('Item ID is undefined. Cannot edit.');
                          return;
                        }
                        onEdit(item.id);
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!item?.id) {
                          console.error('Item ID is undefined. Cannot delete.');
                          return;
                        }
                        onDelete(item?.id);
                        setDeleteDeliverableId(item.id);
                      }}
                    >
                      <Delete className="cursor-pointer" />
                    </button>
                  </div>
                </div>
                <p className="mb-2">{item.description}</p>
                <p className="flex gap-4 mb-3 ">
                  <CalendarWithMark fill="#6E50DB" />
                  {item.startDate}
                </p>
                <p className="flex gap-4 mb-3">
                  <CalendarWithMark fill="#6E50DB" />
                  {item.endDate}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-end">
          <Button
            type="button"
            size="xl"
            backgroundColor="primary-blue-500"
            className="w-1/2 py-3 px-12"
            onClick={handleFinish}
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}
