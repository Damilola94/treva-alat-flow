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

    getCreativeOnboarding: builder.query({
      query: () => ({
        url: endpoints.users.getCreativeOnboarding,
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['TempCreativeOnboardingModelBaseResponse'],
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

    saveCreativeOnboarding: builder.mutation({
      query: (values) => ({
        url: endpoints.users.saveCreativeOnboarding,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['UnitBaseResponse'],
      ) => response,
    }),

    getUserProfile: builder.query({
      query: () => ({
        url: endpoints.users.getUserProfile,
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['UserModelBaseResponse'],
      ) => response,
    }),

    getHiringStats: builder.query({
      query: () => ({
        url: endpoints.users.getHiriingStatistics,
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['HiringStatisticsModelBaseResponse'],
      ) => response,
    }),

    getCreatives: builder.query({
      query: (values) => ({
        url: endpoints.users.getCreatives,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['UserCreativeModelPagedListBaseResponse'],
      ) => response,
    }),

    getCreativesById: builder.query({
      query: ({ userId }: { userId: string }) => ({
        url: endpoints.users.getCreativesById(userId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['UserCreativeDetailModelBaseResponse'],
      ) => response,
    }),

    getUserRatings: builder.query({
      query: ({ userId }: { userId: string }) => ({
        url: endpoints.users.getUserRatings(userId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['UserRatingModelBaseResponse'],
      ) => response,
    }),
  }),
});

export const {
  useGetClientOnboardingQuery,
  useSaveClientOnboardingMutation,
  useGetUserProfileQuery,
  useGetHiringStatsQuery,
  useGetCreativesQuery,
  useGetCreativesByIdQuery,
  useGetUserRatingsQuery,
  useSaveCreativeOnboardingMutation,
  useGetCreativeOnboardingQuery,
} = usersService;
