import { api } from "../api";

const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "/notification",
        method: "GET",
      }),
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: "/notification/mark-all-read",
        method: "POST",
      }),
    }),
    sendCustomMail: builder.mutation({
      query: (data) => ({
        url: "/inform/send-custom-mail",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useSendCustomMailMutation,
} = notificationApi;
