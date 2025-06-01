import { endpoints, REQUEST_METHODS } from "@/constants";
import { paymentServiceApiSlice } from "@/store";
import { ITrevaPaymentService } from "@/types";

export const common = paymentServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommon: builder.query({
      query: (values) => ({
        url: endpoints.common.getBanks,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaPaymentService["schemas"]["BankModelListBaseResponse"]
      ) => response,
    }),
  }),
});

export const { useGetCommonQuery } = common
