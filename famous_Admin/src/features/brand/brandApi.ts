// features/brand/brandApi.ts
import type { Brand } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
type CreateBrandInput = Omit<Brand, "_id">;


export const brandApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().adminAuth.token; //

      console.log(token); // Adjust based on your auth state
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  reducerPath: "brandApi",
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    getBrands: builder.query<Brand[], void>({
      query: () => "/brands",
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: "Brand", id: _id }))
          : ["Brand"],
    }),
    createBrand: builder.mutation<Brand, CreateBrandInput>({
      query: (brandData) => ({
        url: "/brands",
        method: "POST",
        body: brandData,
      }),
      invalidatesTags: ["Brand"],
    }),

    deleteBrand: builder.mutation<void, string>({
      query: (brandId) => ({
        url: `/brands/${brandId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
