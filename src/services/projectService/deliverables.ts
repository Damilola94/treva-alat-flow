import { REQUEST_METHODS, endpoints } from "@/constants";
import { projectServiceApiSlice } from "@/store/slices";
import { ITrevaProjectService } from "@/types";

export const deliverableService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDeliverables: builder.query({
      query: ({ projectId }: { projectId: string }) => ({
        url: endpoints.deliverables.getDeliverables(projectId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["DeliverableModelIEnumerableBaseResponse"]
      ) => response,
    }),
    createDeliverable: builder.mutation({
        query: ({projectId, ...values}) => ({
            url: endpoints.deliverables.createDeliverable(projectId),
            method: REQUEST_METHODS.POST,
            body: {
                ...values,
                projectId,
            },
        }),
        transformResponse: (
            response: ITrevaProjectService["schemas"]["DeliverableModelBaseResponse"]
        ) => response,
    }),

 getDeliverableById: builder.query({
    query: ({ projectId, deliverableId }: { projectId: string; deliverableId: string }) => ({
      url: endpoints.deliverables.getDeliverableById(projectId, deliverableId),
        method: REQUEST_METHODS.GET,
    }),
    transformResponse: (
        response: ITrevaProjectService["schemas"]["DeliverableModelBaseResponse"]
        ) => response,
    }),

    updateDeliverable: builder.mutation({
        query: ({ projectId, deliverableId, ...values }) => ({
            url: endpoints.deliverables.updateDeliverable(projectId, deliverableId),
            method: REQUEST_METHODS.PUT,
            body: values,
        }),
        transformResponse: (
            response: ITrevaProjectService["schemas"]["DeliverableModelBaseResponse"]
        ) => response,
    }),

    deleteDeliverable: builder.mutation({
        query: ({ projectId, deliverableId }: { projectId: string; deliverableId: string }) => ({
            url: endpoints.deliverables.deleteDeliverable(projectId, deliverableId),
            method: REQUEST_METHODS.DELETE,
        }),
        transformResponse: (
            response: ITrevaProjectService["schemas"]["DeliverableModelBaseResponse"]
        ) => response,
    }),

    getDeliverableTasks: builder.query({
        query: ({ projectId, deliverableId }: { projectId: string; deliverableId: string }) => ({
            url: endpoints.deliverables.getDeliverableTasks(projectId, deliverableId),
            method: REQUEST_METHODS.GET,
        }),
        transformResponse: (
            response: ITrevaProjectService["schemas"]["DeliverableModelBaseResponse"]
        ) => response,
    }),

    createDeliverableTask: builder.mutation({
        query: ({ projectId, deliverableId, ...values }) => ({
            url: endpoints.deliverables.createDeliverableTask(projectId, deliverableId),
            method: REQUEST_METHODS.POST,
            body: values,
        }),
        transformResponse: (
            response: ITrevaProjectService["schemas"]["DeliverableModelBaseResponse"]
        ) => response,
    }),
    
    getDeliverableTaskById: builder.query({
        query: ({ projectId, deliverableId, taskId }: { projectId: string; deliverableId: string; taskId: string }) => ({
            url: endpoints.deliverables.getDeliverableTaskById(projectId, deliverableId, taskId),
            method: REQUEST_METHODS.GET,
        }),
        transformResponse: (
            response: ITrevaProjectService["schemas"]["DeliverableModelBaseResponse"]
        ) => response,
    }),

    updateDeliverableTask: builder.mutation({
        query: ({ projectId, deliverableId, taskId, ...values }) => ({
            url: endpoints.deliverables.updateDeliverableTask(projectId, deliverableId, taskId),
            method: REQUEST_METHODS.PUT,
            body: values,
        }),
        transformResponse: (
            response: ITrevaProjectService["schemas"]["DeliverableModelBaseResponse"]
        ) => response,
    }),
    deleteDeliverableTask: builder.mutation({
        query: ({ projectId, deliverableId, taskId }: { projectId: string; deliverableId: string; taskId: string }) => ({
            url: endpoints.deliverables.deleteDeliverableTask(projectId, deliverableId, taskId),
            method: REQUEST_METHODS.DELETE,
        }),
        transformResponse: (
            response: ITrevaProjectService["schemas"]["DeliverableModelBaseResponse"]
        ) => response,
    }),
    }),
});
export const {
  useGetDeliverablesQuery,
  useCreateDeliverableMutation,
  useGetDeliverableByIdQuery,
  useUpdateDeliverableMutation,
  useDeleteDeliverableMutation,
  useGetDeliverableTasksQuery,
  useCreateDeliverableTaskMutation,
  useGetDeliverableTaskByIdQuery,
  useUpdateDeliverableTaskMutation,
  useDeleteDeliverableTaskMutation
} = deliverableService;