import { REQUEST_METHODS, endpoints } from '@/constants';
import { userServiceApiSlice } from '@/store/slices';
import { ITrevaUserService } from '@/types';

export const locationService = userServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStates: builder.query({
      query: (values: { country: string }) => ({
        url: endpoints.location.getStates,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['StateModelPagedListBaseResponse'],
      ) => response,
    }),

    getCities: builder.query({
      query: (values: { state: string }) => ({
        url: endpoints.location.getLGA,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['CityModelPagedListBaseResponse'],
      ) => response,
    }),
  }),
});

export const { useGetCitiesQuery, useGetStatesQuery } = locationService;
