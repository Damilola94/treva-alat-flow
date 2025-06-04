import { REQUEST_METHODS, endpoints } from "@/constants";
import { projectServiceApiSlice } from "@/store/slices";
import { ITrevaProjectService } from "@/types";

export const invoiceService = projectServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: (values) => ({
        url: endpoints.invoices.getInvoice,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["InvoiceMiniModelPagedListBaseResponse"]
      ) => response,
    }),
    createInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: endpoints.invoices.addInvoice(invoiceId),
        method: REQUEST_METHODS.POST,
        // body: values
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["InvoiceMiniModelPagedListBaseResponse"]
      ) => response,
    }),
    getMyInvoices: builder.query({
      query: (invoiceId: string) => ({
        url: endpoints.invoices.getMyInvoice(invoiceId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaProjectService["schemas"]["InvoiceModelBaseResponse"]
      ) => response,
    }),
  }),
});

export const { useGetInvoicesQuery, useGetMyInvoicesQuery, useCreateInvoiceMutation } = invoiceService;
