import { REQUEST_METHODS, endpoints } from '@/constants';
import { projectServiceApiSlice } from '@/store/slices';
import { ITrevaProjectService } from '@/types';

export const paymentScheduleService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPaymentSchedule: builder.query({
      query: (projectId: string) => ({
        url: endpoints.paymentSchedules.getPaymentSchedules(projectId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['PaymentScheduleModelBaseResponse'],
      ) => response,
    }),

    createPaymentSchedule: builder.mutation({
      query: ({ projectId, ...values }) => ({
        url: endpoints.paymentSchedules.createPaymentSchedules(projectId),
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['PaymentScheduleModelBaseResponse'],
      ) => response,
    }),

    updatePaymentSchedule: builder.mutation({
      query: ({ projectId, paymentScheduleId, ...values }) => ({
        url: endpoints.paymentSchedules.updatePaymentSchedules(
          projectId,
          paymentScheduleId,
        ),
        method: REQUEST_METHODS.PUT,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['PaymentScheduleModelBaseResponse'],
      ) => response,
    }), 

    getPaymentScheduleById: builder.query({
      query: ({ projectId, paymentScheduleId }) => ({
        url: endpoints.paymentSchedules.getPaymentScheduleById(
          projectId,
          paymentScheduleId,
        ),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['PaymentScheduleModelBaseResponse'],
      ) => response,
    }),
    updatePaymentScheduleById: builder.mutation({
      query: ({ projectId, paymentScheduleId, ...values }) => ({
        url: endpoints.paymentSchedules.updatePaymentSchedules(
          projectId,
          paymentScheduleId,
        ),
        method: REQUEST_METHODS.PUT,
        body: values,
      }),
        transformResponse: (
            response: ITrevaProjectService['schemas']['PaymentScheduleModelBaseResponse'],
        ) => response,
    }),
    deletePaymentScheduleById: builder.mutation({
      query: ({ projectId, paymentScheduleId }) => ({
        url: endpoints.paymentSchedules.deletePaymentSchedules(
          projectId,
          paymentScheduleId,
        ),
        method: REQUEST_METHODS.DELETE,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['PaymentScheduleModelBaseResponse'],
      ) => response,
    }),
    }),
})
 export const {
    useGetAllPaymentScheduleQuery,
    useCreatePaymentScheduleMutation,
    useUpdatePaymentScheduleMutation,
    useGetPaymentScheduleByIdQuery,
    useUpdatePaymentScheduleByIdMutation,
    useDeletePaymentScheduleByIdMutation,
  } = paymentScheduleService;   
