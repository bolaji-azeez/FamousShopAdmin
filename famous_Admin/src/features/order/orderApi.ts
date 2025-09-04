import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Order } from "@/types";
import type { RootState } from "@/store/store";

type OrdersResponse = { orders?: Order[]; data?: Order[] };
type OrderResponse = { order?: Order; data?: Order };

type CreateOrderArg = Omit<Order, "_id" | "__v" | "createdAt" | "updatedAt">;

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL as string,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.adminAuth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      console.log(token);
      return headers;
    },
  }),
  tagTypes: ["Order"] as const,

  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      transformResponse: (response: OrdersResponse): Order[] =>
        response.orders ?? response.data ?? [],
      providesTags: (result) =>
        result && result.length
          ? [
              { type: "Order" as const, id: "LIST" },
              ...result.map((o) => ({ type: "Order" as const, id: o._id })),
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),

    getOrderById: builder.query<Order, string>({
      query: (orderId) => `/orders/${orderId}`,
      transformResponse: (response: OrderResponse | Order): Order => {
        if (typeof response === "object" && response) {
          const r = response as OrderResponse;
          return r.order ?? (r.data as Order) ?? (response as Order);
        }

        throw new Error("Unexpected order response shape");
      },
      providesTags: (_res, _err, id) => [
        { type: "Order" as const, id },
        { type: "Order" as const, id: "LIST" },
      ],
    }),

    getOrderDetails: builder.query<Order, string>({
      query: (orderId) => `/orders/${orderId}`,
      transformResponse: (response: OrderResponse | Order): Order => {
        if (typeof response === "object" && response) {
          const r = response as OrderResponse;
          return r.order ?? (r.data as Order) ?? (response as Order);
        }
        throw new Error("Unexpected order response shape");
      },
      providesTags: (_res, _err, id) => [{ type: "Order" as const, id }],
    }),

    createOrder: builder.mutation<Order, CreateOrderArg>({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    updateOrderStatus: builder.mutation<
      Order,
      { orderId: string; status: string }
    >({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_res, _err, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),

    deleteOrder: builder.mutation<void, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, orderId) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;
