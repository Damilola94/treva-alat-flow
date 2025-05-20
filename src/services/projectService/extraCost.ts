import { REQUEST_METHODS, endpoints } from "@/constants";
import { projectServiceApiSlice } from "@/store/slices";
import { ITrevaProjectService } from "@/types";

export const extraCostService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllExtraCosts: builder.query({
      query: (projectId: string) => ({
        url: endpoints.extraCosts.getExtraCosts(projectId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ExtraCostModelBaseResponse"]
      ) => response,
    }),
    createExtraCost: builder.mutation({
      query: ({ projectId, ...values }) => ({
        url: endpoints.extraCosts.createExtraCosts(projectId),
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ExtraCostModelBaseResponse"]
      ) => response,
    }),
    getExtraCostById: builder.query({
      query: ({ projectId, extraCostId }) => ({
        url: endpoints.extraCosts.getExtraCostById(projectId, extraCostId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ExtraCostModelBaseResponse"]
      ) => response,
    }),
    updateExtraCostById: builder.mutation({
      query: ({ projectId, extraCostId, ...values }) => ({
        url: endpoints.extraCosts.updateExtraCosts(projectId, extraCostId),
        method: REQUEST_METHODS.PUT,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ExtraCostModelBaseResponse"]
      ) => response,
    }),
    deleteExtraCostById: builder.mutation({
      query: ({ projectId, extraCostId }) => ({
        url: endpoints.extraCosts.deleteExtraCosts(projectId, extraCostId),
        method: REQUEST_METHODS.DELETE,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ExtraCostModelBaseResponse"]
      ) => response,
    }),
  }),
});
export const {
  useGetAllExtraCostsQuery,
  useCreateExtraCostMutation,
  useGetExtraCostByIdQuery,
  useUpdateExtraCostByIdMutation,
  useDeleteExtraCostByIdMutation,
} = extraCostService;
