'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import routes from '@/lib/routes';
import { AnimatedModal, CalendarWithMark, Delete, EditIcon, PlusIcon, RenderIf} from '@/components/shared';
import { AddDeliverables } from '@/components/shared/project-management.tsx/add-deliverables';
import { EditDeliverables } from '@/components/shared/project-management.tsx/edit-deliverables';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useGetDeliverablesQuery } from '@/services';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { resetProject, storeValues } from '@/store/slices/project';
import { DeleteDeliverable } from '../project-table/delete-deliverable';
import projectManagement from '@/lib/assets/project-management';

interface Deliverable {
  deliverableId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const deleteDeliverableItem = {
  img: projectManagement.topImage,
  title: 'Are you sure you want to delete this deliverable?',
  details: 'deliverable record will be deleted Permanently',
  btnText1: 'Cancel',
  btnText2: 'Delete',
};

export function PersonalProjectDeliverables({projectId,}: {projectId: string;}) {
  const rt = useRouter();
  const dispatch = useAppDispatch();

  const [editForm, setEditForm] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [deliverableId, setDeliverableId] = useState<string>('');
  const [deleteForm, setDeleteForm] = useState(false);
  const [deleteDeliverableId, setDeleteDeliverableId] = useState<string | null>(
    null,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDeliverable, setSelectedDeliverable] =
    useState<Deliverable | null>(null);

  const { data: deliverablesData, isLoading, refetch} = useGetDeliverablesQuery({ projectId },{ refetchOnMountOrArgChange: true },);

  useEffect(() => {
    if (deliverablesData?.data) {
      const mappedDeliverables = deliverablesData.data.map((item) => ({
        deliverableId: item.id ?? "",
        name: item.name ?? "",
        description: item.description ?? "",
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? "",

         }))

      setDeliverables(mappedDeliverables)
      dispatch(
        storeValues({
          deliverables: mappedDeliverables.map((d) => ({
            name: d.name,
            description: d.description,
            startDate: d.startDate,
            endDate: d.endDate,
          })),
        }),
      )
    }
  }, [deliverablesData, dispatch])

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddDeliverables = (newDeliverable: Deliverable) => {
    setDeliverables((prev) => [...prev, newDeliverable]);
    closeModal();
    refetch();
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

  const onDelete = (id: string) => {
    setDeleteDeliverableId(id);
    setDeleteForm(!deleteForm);
  };

  
  const handleDeleteProject = () => {
    setDeleteForm(!deleteForm);
  };

  const handleSkip = () => {
    dispatch(resetProject());
    rt.push(routes.creatives.dashboard.projectManagement.path);
  };

  return (
    <div className="app_get_started_professional_details py-6 px-4 flex flex-col gap-14">
      <AnimatedModal
        {...{
          isOpen: isModalOpen,
          from: 'right',
          onClose: closeModal,
          className:
            'absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2',
        }}
      >
        <AddDeliverables
          onClose={closeModal}
          projectId={projectId}
          onAddDeliverable={handleAddDeliverables}
          setDeliverableId={setDeliverableId}
        />
      </AnimatedModal>

      <RenderIf condition={!editForm}>
        <AnimatedModal
          isOpen={true}
          from="right"
          onClose={() => {
            setEditForm(true);
            setSelectedDeliverable(null);
          }}
          className="absolute bottom-0 right-0 h-[calc(100vh-20px)] w-full sm:w-[350px] bg-white p-0 flex flex-col mb-2 mr-2"
        >
          <EditDeliverables
            onClose={() => {
              setEditForm(true);
              setSelectedDeliverable(null);
            }}
            projectId={projectId}
            deliverableId={deliverableId}
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
              refetchAllDeliverables={refetch}
            />
          )}
        </AnimatedModal>
      </RenderIf>

      <div className="app_get_started_professional_details__form flex flex-col gap-10 !overflow-y-auto">
        <h3 className="app_get_started_professional_details__form__title">
          Deliverables <br />
          <span className="text-[#6D6D6D]">
            Add all deliverables for this project.
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
          {isLoading ? (
            <div className="text-center flex justify-center items-center">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : deliverables.length > 0 ? (
            deliverables.map((deliverable) => (
              <div
                key={deliverable.deliverableId}
                className="border p-4 rounded-md shadow mb-4 flex justify-between items-center bg-[#E7E7E7]"
              >
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold mb-3">{deliverable.name}</h4>
                    <div className="flex gap-4">
                      <EditIcon
                        className="cursor-pointer"
                        fill="#888888"
                        onClick={() => onEdit(deliverable.deliverableId)}
                      />
                      <button
                        onClick={() => {
                         if (!deliverable?.deliverableId) {
                          console.error('Item ID is undefined. Cannot delete.');
                          return;
                        }
                       onDelete(deliverable?.deliverableId);
                        setDeleteDeliverableId(deliverable.deliverableId);
                      }}
                      
                      >
                        <Delete className="cursor-pointer" />
                      </button>
                    </div>
                  </div>
                  <p className="mb-2">{deliverable.description}</p>
                  <p className="flex gap-4 mb-3">
                    <CalendarWithMark fill="#6E50DB" />
                    {formatDate(deliverable.startDate)}
                  </p>
                  <p className="flex gap-4 mb-3">
                    <CalendarWithMark fill="#6E50DB" />
                    {formatDate(deliverable.endDate)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No deliverables added yet.</p>
          )}
        </div>
        <div className="py-5 flex justify-end">
          <Button
            type="button"
            size="xl"
            backgroundColor="primary-blue-500"
            className="w-1/2 py-3 px-12"
            onClick={handleSkip}
            disabled={deliverables.length === 0}
            isLoading={isLoading}
          >
            Create Project
          </Button>
        </div>
      </div>
    </div>
  );
}
