import { REQUEST_METHODS, endpoints } from '@/constants';
import { chatServiceApiSlice } from '@/store/slices';
import { ITrevaChatService } from '@/types';

export const chatService = chatServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: (values) => ({
        url: endpoints.chats.getAllChats,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      transformResponse: (
        response: ITrevaChatService['schemas']['ChatModelPagedListBaseResponse'],
      ) => response,
    }),
  }),
});

export const { useGetAllChatsQuery } = chatService;
