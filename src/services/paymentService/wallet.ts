import { endpoints, REQUEST_METHODS } from "@/constants";
import { paymentServiceApiSlice } from "@/store";
import { ITrevaPaymentService } from "@/types";

export const wallet = paymentServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyWallet: builder.query({
      query: (values) => ({
        url: endpoints.wallets.getMyWallets,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaPaymentService["schemas"]["WalletModelBaseResponse"]
      ) => response,
    }),
    addWithdrawFunds: builder.mutation({
      query: ({walletId, ...values}) => ({
        url: endpoints.wallets.addWithdrawFunds(walletId),
        method: REQUEST_METHODS.POST,
        body: {
          ...values,
          walletId
        },
      }),
      transformResponse: (
        response: ITrevaPaymentService["schemas"]["WalletModelBaseResponse"]
      ) => response,
    }),
    getTransactions: builder.query({
      query: (walletId: string) => ({
        url: endpoints.wallets.getTransactions(walletId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaPaymentService["schemas"]["TransactionModelPagedListBaseResponse"]
      ) => response,
    }),

    getBeneficiary: builder.query({
      query: (values) => ({
        url: endpoints.wallets.getMyWallets,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaPaymentService["schemas"]["WalletModelBaseResponse"]
      ) => response,
    }),
  }),
});
export const { useGetMyWalletQuery, useGetTransactionsQuery, useAddWithdrawFundsMutation } = wallet;
