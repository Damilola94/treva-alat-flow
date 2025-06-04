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

    startChat: builder.mutation({
      query: (values) => ({
        url: endpoints.chats.startChat,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaChatService['schemas']['ChatModelBaseResponse'],
      ) => response,
    }),
  }),
});

export const { useGetAllChatsQuery, useStartChatMutation } = chatService;
