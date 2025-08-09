// features/products/productApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "@/types"; // Define your Product type

export const productApi = createApi({
  reducerPath: "productApi",
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
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response) => response.data ?? response.products ?? [],
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: "Product", id: _id }))
          : ["Product"],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<Product, Omit<Product, "id">>({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<Product, Product>({
      query: (productData) => ({
        url: `/products/${productData._id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
