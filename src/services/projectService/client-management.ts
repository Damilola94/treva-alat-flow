import { REQUEST_METHODS, endpoints } from '@/constants';
import { projectServiceApiSlice } from '@/store/slices';
import { ITrevaProjectService } from '@/types';

export const clientManagementService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyClients: builder.query({
      query: (values) => ({
        url: endpoints.clientManagement.getMyClients,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['MyClientModelPagedListBaseResponse'],
      ) => response,
    }),

    addClient: builder.mutation({
      query: (values) => ({
        url: endpoints.clientManagement.addClient,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['MyClientModelBaseResponse'],
      ) => response,
    }),

    updateClient: builder.mutation({
      query: (values) => ({
        url: endpoints.clientManagement.updateClient,
        method: REQUEST_METHODS.PUT,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['MyClientModelBaseResponse'],
      ) => response,
    }),

    deleteClient: builder.mutation({
      query: (values) => ({
        url: endpoints.clientManagement.deleteClient,
        method: REQUEST_METHODS.DELETE,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['UnitBaseResponse'],
      ) => response,
    }),
  }),
});
export const {
  useGetMyClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientManagementService;
