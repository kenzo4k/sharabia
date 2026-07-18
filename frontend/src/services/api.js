import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    const errors = error.response?.data?.errors || null;
    
    const apiError = new Error(message);
    apiError.status = error.response?.status || 500;
    apiError.errors = errors;
    
    return Promise.reject(apiError);
  }
);

export default api;
