import { REQUEST_METHODS, endpoints } from '@/constants';
import { projectServiceApiSlice } from '@/store/slices';
import { ITrevaProjectService } from '@/types';

export const projectService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: (values) => ({
        url: endpoints.projects.getAllProjects,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['ProjectMiniModelPagedListBaseResponse'],
      ) => response,
    }),

    createProject: builder.mutation({
      query: (values) => ({
        url: endpoints.projects.createProject,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['ProjectModelBaseResponse'],
      ) => response,
    }),

    getProjectById: builder.query({
      query: (projectId: string) => ({
        url: endpoints.projects.getProjectById(projectId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['ProjectModelBaseResponse'],
      ) => response,
    }),

    updateProject: builder.mutation({
      query: ({ projectId, ...values }) => ({
        url: endpoints.projects.updateProject(projectId),
        method: REQUEST_METHODS.PUT,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['ProjectModelBaseResponse'],
      ) => response,
    }),

    deleteProject: builder.mutation({
      query: (projectId: string) => ({
        url: endpoints.projects.deleteProject(projectId),
        method: REQUEST_METHODS.DELETE,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['ProjectModelBaseResponse'],
      ) => response,
    }),
    
    createRateProject: builder.mutation({
      query: ({ projectId, ...values }) => ({
        url: endpoints.projects.rateProject(projectId),
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['ProjectModelBaseResponse'],
      ) => response,
    }),
  }),

})

export const { useGetAllProjectsQuery, useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation,useDeleteProjectMutation, useCreateRateProjectMutation } = projectService;
