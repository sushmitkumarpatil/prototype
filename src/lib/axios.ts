
import axios, { AxiosError, AxiosResponse } from 'axios';
import { getAuthToken, removeAuthData } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add tenant ID if available
    const tenantId = localStorage.getItem('tenant');
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh token first before clearing auth data
      try {
        const { refreshToken } = await import('./api/auth');
        const refreshResponse = await refreshToken();
        if (refreshResponse.accessToken) {
          // Update the token and retry the original request
          localStorage.setItem('authToken', refreshResponse.accessToken);
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth data and redirect
        console.warn('Token refresh failed:', refreshError);
      }
      
      // Clear auth data and redirect to login
      removeAuthData();
      
      // Only redirect if we're not already on the login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Access denied. You do not have permission to perform this action.'));
    }

    // Handle 404 errors
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Resource not found.'));
    }

    // Handle 500 errors
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timeout. Please check your connection and try again.'));
      }
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }

    // Handle other errors
    if (error.response?.data) {
      const errorData = error.response.data as any;
      const message = errorData.message || errorData.error || 'An unexpected error occurred';
      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error('An unexpected error occurred'));
  }
);

export default api;
