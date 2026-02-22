import { REQUEST_METHODS, endpoints } from '@/constants';
import { paymentServiceApiSlice } from '@/store/slices';
import { ITrevaPaymentService } from '@/types';

export const beneficiaryManagementService = paymentServiceApiSlice.injectEndpoints({
   overrideExisting: true,
  endpoints: (builder) => ({
    getBeneficiary: builder.query({
      query: (values) => ({
        url: endpoints.beneficiaryManagement.getBeneficiarymanagement,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaPaymentService['schemas']['BeneficiaryModelPagedListBaseResponse'],
      ) => response,
    }),

    addBeneficiary: builder.mutation({
      query: (values) => ({
        url: endpoints.beneficiaryManagement.addBeneficiary,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaPaymentService['schemas']['BeneficiaryModelBaseResponse'],
      ) => response,
    }),

    bankNameEnquiry: builder.mutation({
      query: (values: { accountNumber: string; bankCode: string }) => ({
        url: endpoints.beneficiaryManagement.bankNameEnquiry,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaPaymentService['schemas']['StringBaseResponse'],
      ) => response,
    }),

    deleteBeneficiary: builder.mutation({
      query: (accountNumber: string) => ({
        url: endpoints.beneficiaryManagement.deleteBeneficiary(accountNumber),
        method: REQUEST_METHODS.DELETE,
      }),
      transformResponse: (
        response: ITrevaPaymentService['schemas']['WalletModelBaseResponse'],
      ) => response,
    }),
    
  }),
});
export const {
  useGetBeneficiaryQuery,
  useAddBeneficiaryMutation,
  useBankNameEnquiryMutation,
  useDeleteBeneficiaryMutation,
} = beneficiaryManagementService;
