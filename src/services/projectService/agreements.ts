import { REQUEST_METHODS, endpoints } from "@/constants";
import { projectServiceApiSlice } from "@/store/slices";
import { ITrevaProjectService } from "@/types";

export const agreementService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAgreements: builder.query({
      query: ({ projectId }: { projectId: string }) => ({
        url: endpoints.agreements.getAgreements(projectId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["AgreementModelIEnumerableBaseResponse"]
      ) => response,
    }),
    // createAgreement: builder.mutation({
    //   query: ({ projectId, ...values }) => ({
    //     url: endpoints.agreements.createAgreement(projectId),
    //     method: REQUEST_METHODS.POST,
    //     body: values,
    //   }),
    //   transformResponse: (
    //     response: ITrevaProjectService['schemas']['AgreementModelBaseResponse'],
    //   ) => response,
    // }),
    createAgreement: builder.mutation({
      query: ({ projectId, document }) => {
        const formData = new FormData();
        formData.append("document", document); // 'document' must match backend's expected field name

        return {
          url: endpoints.agreements.createAgreement(projectId),
          method: REQUEST_METHODS.POST,
          body: formData,
        };
      },
      transformResponse: (
        response: ITrevaProjectService["schemas"]["AgreementModelBaseResponse"]
      ) => response,
    }),

    getAgreementById: builder.query({
      query: ({
        projectId,
        agreementId,
      }: {
        projectId: string;
        agreementId: string;
      }) => ({
        url: endpoints.agreements.getAgreementById(projectId, agreementId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["AgreementModelBaseResponse"]
      ) => response,
    }),
    updateAgreement: builder.mutation({
      query: ({ projectId, agreementId, ...values }) => ({
        url: endpoints.agreements.updateAgreement(projectId, agreementId),
        method: REQUEST_METHODS.PUT,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["AgreementModelBaseResponse"]
      ) => response,
    }),
    deleteAgreement: builder.mutation({
      query: ({
        projectId,
        agreementId,
      }: {
        projectId: string;
        agreementId: string;
      }) => ({
        url: endpoints.agreements.deleteAgreement(projectId, agreementId),
        method: REQUEST_METHODS.DELETE,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["AgreementModelBaseResponse"]
      ) => response,
    }),
  }),
});

export const {
  useGetAgreementsQuery,
  useCreateAgreementMutation,
  useGetAgreementByIdQuery,
  useUpdateAgreementMutation,
  useDeleteAgreementMutation,
} = agreementService;
