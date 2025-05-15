import { REQUEST_METHODS, endpoints } from '@/constants';
import { userServiceApiSlice } from '@/store/slices';
import { ITrevaUserService } from '@/types';

export const authService = userServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (values: ITrevaUserService['schemas']['LoginCommand']) => ({
        url: endpoints.auth.login,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['LoginModelBaseResponse'],
      ) => response,
    }),

    register: builder.mutation({
      query: (values) => ({
        url: endpoints.auth.register,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['StringBaseResponse'],
      ) => response,
    }),

    forgotPassword: builder.mutation({
      query: (
        values: ITrevaUserService['schemas']['ForgotPasswordCommand'],
      ) => ({
        url: endpoints.auth.forgotPassword,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['StringBaseResponse'],
      ) => response,
    }),

    resetPassword: builder.mutation({
      query: (
        values: ITrevaUserService['schemas']['ResetPasswordCommand'],
      ) => ({
        url: endpoints.auth.resetPassword,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['StringBaseResponse'],
      ) => response,
    }),

    refreshToken: builder.mutation({
      query: (values: ITrevaUserService['schemas']['RefreshTokenCommand']) => ({
        url: endpoints.auth.refreshToken,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['LoginModelBaseResponse'],
      ) => response,
    }),

    verifyAccount: builder.mutation({
      query: (
        values: ITrevaUserService['schemas']['VerifyAccountCommand'],
      ) => ({
        url: endpoints.auth.verifyAccount,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['StringBaseResponse'],
      ) => response,
    }),

    changePassword: builder.mutation({
      query: (
        values: ITrevaUserService['schemas']['ChangePasswordCommand'],
      ) => ({
        url: endpoints.auth.changePassword,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['StringBaseResponse'],
      ) => response,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useRefreshTokenMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useVerifyAccountMutation,
} = authService;
