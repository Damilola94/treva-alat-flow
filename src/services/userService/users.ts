import { REQUEST_METHODS, endpoints } from '@/constants';
import { userServiceApiSlice } from '@/store/slices';
import { ITrevaUserService } from '@/types';

export const usersService = userServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClientOnboarding: builder.query({
      query: () => ({
        url: endpoints.users.getClientOnboarding,
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['TempClientOnboardingModelBaseResponse'],
      ) => response,
    }),

    saveClientOnboarding: builder.mutation({
      query: (values) => ({
        url: endpoints.users.saveClientOnboarding,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['UnitBaseResponse'],
      ) => response,
    }),
  }),
});

export const { useGetClientOnboardingQuery, useSaveClientOnboardingMutation } =
  usersService;
