import { REQUEST_METHODS, endpoints } from '@/constants';
import { projectServiceApiSlice } from '@/store/slices';
import { ITrevaProjectService } from '@/types';

export const agreementService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAgreements: builder.query({
      query: ({ projectId }: { projectId: string }) => ({
        url: endpoints.agreements.getAgreements(projectId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['AgreementModelIEnumerableBaseResponse'],
      ) => response,
    }),
  }),
});

export const { useGetAgreementsQuery } = agreementService;
