import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "@/types";


type UsersResponse = {
  data?: User[];
  users?: User[];
};

type RootState = {
  adminAuth: {
    token?: string | null;
  };
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL as string,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.adminAuth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["User"] as const,
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      // response is unknown by default: give it a type
      transformResponse: (response: UsersResponse): User[] =>
        response.data ?? response.users ?? [],
      providesTags: (result) =>
        result && result.length
          ? [
              { type: "User" as const, id: "LIST" },
              ...result.map((u) => ({ type: "User" as const, id: u._id })),
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_res, _err, id) => [
        { type: "User" as const, id },
        { type: "User" as const, id: "LIST" },
      ],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = userApi;
