// src/lib/axios.ts
import axios from "axios";
import type { RootState } from "@/store/store";


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:3000/api", // fallback
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export const setupApiClient = (store: { getState: () => RootState }) => {
  apiClient.interceptors.request.use((config) => {
    const token = store.getState().adminAuth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );
};

// Optional: Add interceptors for auth/error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central error logging can go here
    return Promise.reject(error);
  }
);

export default apiClient;
