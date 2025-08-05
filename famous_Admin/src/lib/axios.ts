// src/lib/axios.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ||"http://localhost:3000/api", // fallback
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if you're using cookies (auth/session)
});

// Optional: Add interceptors for auth/error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central error logging can go here
    return Promise.reject(error);
  }
);

export default apiClient;
