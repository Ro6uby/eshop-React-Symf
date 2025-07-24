import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-symfony-backend.com/api' 
    : 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  maxRedirects: 0, // Do not follow redirects
});

// Request interceptor to add JWT token to all requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('jwt_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      // localStorage.removeItem('jwt_token');
      // localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;