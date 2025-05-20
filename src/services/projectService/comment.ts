import { REQUEST_METHODS, endpoints } from '@/constants';
import { projectServiceApiSlice } from '@/store/slices';
import { ITrevaProjectService } from '@/types';

export const commentService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: ({ projectId }: { projectId: string }) => ({
        url: endpoints.comments.getComments(projectId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['CommentModelPagedListBaseResponse'],
      ) => response,
    }),
    createComment: builder.mutation({
      query: ({ projectId, ...values }) => ({
        url: endpoints.comments.createComment(projectId),
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaProjectService['schemas']['CommentModelBaseResponse'],
      ) => response,
    }),
  }),
});
export const { useGetCommentsQuery, useCreateCommentMutation } = commentService;
