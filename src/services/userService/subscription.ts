import { REQUEST_METHODS, endpoints } from '@/constants';
import { userServiceApiSlice } from '@/store/slices';
import { ITrevaUserService } from '@/types';

export const subscriptionService = userServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubs: builder.query({
      query: () => ({
        url: endpoints.subscription.getAllSubs,
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['SubscriptionModelPagedListBaseResponse'],
      ) => response,
    }),

    getSubById: builder.query({
      query: ({ subscriptionId }: { subscriptionId: string }) => ({
        url: endpoints.subscription.getSubById(subscriptionId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['SubscriptionModelBaseResponse'],
      ) => response,
    }),
  }),
});

export const { useGetAllSubsQuery, useLazyGetSubByIdQuery } =
  subscriptionService;
