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
                    response: ITrevaPaymentService['schemas']['WalletModelBaseResponse'],
                  ) => response,
        }),

          getWalletById: builder.query({
              query: (walletId: string) => ({
                url: endpoints.wallets.getWalletById(walletId),
                method: REQUEST_METHODS.GET,
              }),
              transformResponse: (
                response: ITrevaPaymentService['schemas']['WalletModelBaseResponse'],
              ) => response,
            }),

             getBeneficiary: builder.query({
            query: (values) => ({
            url: endpoints.wallets.getMyWallets,
            method: REQUEST_METHODS.GET,
            params: values,
            }),
             transformResponse: (
                    response: ITrevaPaymentService['schemas']['WalletModelBaseResponse'],
                  ) => response,
        }),
    })

    });
    export const { useGetMyWalletQuery, useGetWalletByIdQuery } = wallet
