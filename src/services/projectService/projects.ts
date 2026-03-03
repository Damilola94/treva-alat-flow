import { REQUEST_METHODS, endpoints } from "@/constants";
import { projectServiceApiSlice } from "@/store/slices";
import { ITrevaProjectService } from "@/types";

export const projectService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: (values) => ({
        url: endpoints.projects.getAllProjects,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      providesTags: (result) => [
        ...(result?.data?.map((project) => ({
          type: "Project" as const,
          id: project.id,
        })) || []),
        { type: "Projects", id: "LIST" },
      ],

      transformResponse: (
        response: ITrevaProjectService["schemas"]["ProjectMiniModelPagedListBaseResponse"]
      ) => response,
      // providesTags: (result) => {
      //   // Lets updates invalidate the list too
      //   const listTag = { type: 'Project' as const, id: 'LIST' as const };
      //   const items =
      //     result?.data?.data?.map((p: any) => ({ type: 'Project' as const, id: p.id })) ?? [];
      //   return [listTag, ...items];
      // },
    }),

    createProject: builder.mutation({
      query: (values) => ({
        url: endpoints.projects.createProject,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ProjectModelBaseResponse"]
      ) => response,
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),

    getProjectById: builder.query({
      query: (projectId: string) => ({
        url: endpoints.projects.getProjectById(projectId),
        method: REQUEST_METHODS.GET,
      }),
      providesTags: (_res, _err, projectId) => [{ type: 'Project', id: projectId }],
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ProjectModelBaseResponse"]
      ) => response,
    }),

    updateProject: builder.mutation({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query: ({ projectId, body }: { projectId: string; body: any }) => ({
        url: endpoints.projects.updateProject(projectId),
        method: REQUEST_METHODS.PUT,
        body
      }),
      invalidatesTags: (_res, _err, { projectId }) => [{ type: 'Project', id: projectId }],
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ProjectModelBaseResponse"]
      ) => response,
    }),

    deleteProject: builder.mutation({
      query: (projectId: string) => ({
        url: endpoints.projects.deleteProject(projectId),
        method: REQUEST_METHODS.DELETE,
      }),
      invalidatesTags: (result, error,  projectId ) => [
        { type: "Project", id: projectId },
        { type: "Projects", id: "LIST" },
      ],
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ProjectModelBaseResponse"]
      ) => response,
    }),

    createRateProject: builder.mutation({
      query: ({ projectId, ...values }) => ({
        url: endpoints.projects.rateProject(projectId),
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ProjectModelBaseResponse"]
      ) => response,
    }),

    getDashboardSummaryCount: builder.query({
      query: (values) => ({
        url: endpoints.projects.dashboardSummaryCount,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["DashboardSummaryCountModelBaseResponse"]
      ) => response,
    }),

    getCreativeHires: builder.query({
      query: (params) => ({
        url: endpoints.projects.getCreativeHires,
        method: REQUEST_METHODS.GET,
        params: params,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["UserDtoPagedListBaseResponse"]
      ) => response,
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useCreateRateProjectMutation,
  useGetDashboardSummaryCountQuery,
  useGetCreativeHiresQuery,
} = projectService;
