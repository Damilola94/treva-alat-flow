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
        response: ITrevaProjectService['schemas']['ProjectModelPagedListBaseResponse'],
      ) => response,
    }),
  }),
});

export const { useGetAllProjectsQuery } = projectService;
