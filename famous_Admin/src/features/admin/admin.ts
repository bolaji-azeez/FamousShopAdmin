// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

// export const adminApi = createApi({
//     reducerPath: "adminApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
//         prepareHeaders: (headers, { getState }) => {
//         const token = getState().adminAuth.token; // Adjust based on your auth state
//         if (token) {
//             headers.set("Authorization", `Bearer ${token}`);
//         }
//         return headers;
//         },
//     }),
//     endpoints: (builder) => ({
//     )
// });