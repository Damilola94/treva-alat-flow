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
    }),

    getProjectById: builder.query({
      query: (projectId: string) => ({
        url: endpoints.projects.getProjectById(projectId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["ProjectModelBaseResponse"]
      ) => response,
    }),

    updateProject: builder.mutation({
      query: ({ projectId, ...values }) => ({
        url: endpoints.projects.updateProject(projectId),
        method: REQUEST_METHODS.PUT,
        body: values,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
        { type: "Projects", id: "LIST" },
      ],
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
