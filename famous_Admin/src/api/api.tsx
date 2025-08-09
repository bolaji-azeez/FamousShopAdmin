// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/api',
 
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, 
});


api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
  
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (e.g., redirect to login)
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;