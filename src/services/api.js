import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081/api/v1'
});

// Interceptor para añadir el token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;