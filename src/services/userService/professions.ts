import { REQUEST_METHODS, endpoints } from '@/constants';
import { userServiceApiSlice } from '@/store/slices';
import { ITrevaUserService } from '@/types';

export const professionsService = userServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfessions: builder.query({
      query: () => ({
        url: endpoints.professions.getProfessions,
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['ProfessionModelIEnumerableBaseResponse'],
      ) => response,
    }),
  }),
});

export const { useGetProfessionsQuery } = professionsService;
