import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API = axios.create({
  baseURL: API_BASE_URL
});
// Interceptor para añadir el token de autenticación a cada solicitud
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