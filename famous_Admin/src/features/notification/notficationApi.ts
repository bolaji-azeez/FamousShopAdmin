import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { Notification } from "@/types";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().adminAuth.token; // Adjust based on your auth state
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => "/notifications",
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Notification", id }))
          : ["Notification"],
    }),
    createNotification: builder.mutation<
      Notification,
      Omit<Notification, "id">
    >({
      query: (notificationData) => ({
        url: "/notifications",
        method: "POST",
        body: notificationData,
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;
