import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request interceptor: add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ama_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ama_token');
      localStorage.removeItem('ama_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
