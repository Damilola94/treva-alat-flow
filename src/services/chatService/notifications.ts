import { REQUEST_METHODS, endpoints } from '@/constants';
import { chatServiceApiSlice } from '@/store/slices';
import { ITrevaChatService } from '@/types';

export const notificationsService = chatServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (values) => ({
        url: endpoints.notifications.getNotifications,
        method: REQUEST_METHODS.GET,
        params: values,
      }),
      providesTags: ['Notifications'],
      transformResponse: (
        response: ITrevaChatService['schemas']['NotificationModelPagedListBaseResponse'],
      ) => response,
    }),

    getUnreadNotificationCount: builder.query({
      query: () => ({
        url: endpoints.notifications.getNotificationCount,
        method: REQUEST_METHODS.GET,
      }),
      providesTags: ['NotificationCount'],
      transformResponse: (
        response: ITrevaChatService['schemas']['Int32BaseResponse'],
      ) => response,
    }),

    readNotification: builder.mutation({
      query: ({ notificationId }) => ({
        url: endpoints.notifications.readNotification(notificationId),
        method: REQUEST_METHODS.PUT,
      }),
      invalidatesTags: ['Notifications', 'NotificationCount'],
      transformResponse: (
        response: ITrevaChatService['schemas']['UnitBaseResponse'],
      ) => response,
    }),
  }),
});
export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useReadNotificationMutation,
} = notificationsService;
