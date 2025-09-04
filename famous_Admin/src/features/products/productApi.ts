// features/products/productApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "@/types";

/** Minimal RootState so prepareHeaders' getState is typed */
type RootState = {
  adminAuth: {
    token?: string | null;
  };
};

/** Response shapes from your backend */
type ProductsResponse = {
  data?: Product[];
  products?: Product[];
};

type ProductResponse = {
  data?: Product;
  product?: Product;
};

/** If you POST FormData, keep this as FormData.
 *  If you POST JSON, define a CreateProductInput type instead. */
type CreateProductArg = FormData; // or: Omit<Product, "_id" | "__v" | "createdAt" | "updatedAt">

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL as string,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.adminAuth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Product", "Brand"] as const,
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      // response is 'unknown' by default: give it a type
      transformResponse: (response: ProductsResponse): Product[] =>
        response.data ?? response.products ?? [],
      providesTags: (result) =>
        result && result.length
          ? [
              { type: "Product" as const, id: "LIST" },
              ...result.map((p) => ({ type: "Product" as const, id: p._id })),
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ProductResponse): Product =>
        response.data ?? response.product as Product,
      providesTags: (_res, _err, id) => [
        { type: "Product" as const, id },
        { type: "Product" as const, id: "LIST" },
      ],
    }),

    createProduct: builder.mutation<Product, CreateProductArg>({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Brand", id: "LIST" },
      ],
    }),

    updateProduct: builder.mutation<
      Product,
      { _id: string; changes: FormData } // keep FormData if you're sending files
    >({
      query: ({ _id, changes }) => ({
        url: `/products/${_id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Product", id: arg._id },
        { type: "Product", id: "LIST" },
        { type: "Brand", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
        { type: "Brand", id: "LIST" },
      ],
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
