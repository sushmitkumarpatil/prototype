
import axios from 'axios';
import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response);
      try {
        // Try to parse the response as JSON
        const json = JSON.parse(JSON.stringify(error.response.data));
        const message = json.message || 'An error occurred';
        return Promise.reject(new Error(message));
      } catch (e) {
        // If it's not JSON, return the raw response text
        return Promise.reject(new Error(error.response.statusText));
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      return Promise.reject(new Error('No response from server. Please check if the API server is running.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
      return Promise.reject(new Error(error.message));
    }
  }
);

export default api;
