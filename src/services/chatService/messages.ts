import { REQUEST_METHODS, endpoints } from '@/constants';
import { chatServiceApiSlice } from '@/store/slices';
import { ITrevaChatService } from '@/types';

export const messagesService = chatServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesByChatId: builder.query({
      query: ({ chatId }) => ({
        url: endpoints.messages.getMessageByChatId(chatId),
        method: REQUEST_METHODS.GET,
      }),
      transformResponse: (
        response: ITrevaChatService['schemas']['MessageModelPagedListBaseResponse'],
      ) => response,
    }),

    postMessagesByChatId: builder.mutation({
      query: ({ chatId, content, attachments }) => {
        const formData = new FormData();
        formData.append('ChatId', chatId);
        formData.append('Content', content);

        if (attachments?.length) {
          attachments.forEach((file: File) => {
            formData.append('Attachments', file); // `file` should be type File
          });
        }

        return {
          url: endpoints.messages.getMessageByChatId(chatId),
          method: REQUEST_METHODS.POST,
          body: formData,
        };
      },
      transformResponse: (
        response: ITrevaChatService['schemas']['MessageModelBaseResponse'],
      ) => response,
    }),
  }),
});

export const { useGetMessagesByChatIdQuery, usePostMessagesByChatIdMutation } =
  messagesService;
