import { REQUEST_METHODS, endpoints } from '@/constants';
import { userServiceApiSlice } from '@/store/slices';
import { ITrevaUserService } from '@/types';

export const selfieVerification = userServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyBvn: builder.mutation({
      query: (values) => ({
        url: endpoints.selfieVerification.bvn,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['UserDocumentModelBaseResponse'],
      ) => response,
    }),

    verifyNin: builder.mutation({
      query: (values) => ({
        url: endpoints.selfieVerification.nin,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['UserDocumentModelBaseResponse'],
      ) => response,
    }),

    callback: builder.mutation({
      query: (values) => ({
        url: endpoints.selfieVerification.callback,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['SelfieCallbackModelBaseResponse'],
      ) => response,
    }),
  }),
});

export const {
  useCallbackMutation,
  useVerifyBvnMutation,
  useVerifyNinMutation,
} = selfieVerification;
