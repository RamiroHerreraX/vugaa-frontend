import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Interceptor para añadir el token y tenant a cada solicitud
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // ✅ Leer el tenant guardado al momento del login
    const tenant = localStorage.getItem('tenant') || 'caaarem';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Añadir tenant a todas las peticiones (excepto login)
    if (!config.url.includes('/auth/login')) {
      config.headers['X-Tenant-ID'] = tenant;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es un error 401 en logout, no lo tratamos como error
    if (originalRequest.url?.includes('/auth/logout') && error.response?.status === 401) {
      console.log('Logout: Token ya no es válido, ignorando error');
      return Promise.resolve({
        data: { success: true, message: 'Logout local completado' }
      });
    }

    // Si es error 401 y no es un intento de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });

          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return API(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tenant'); // ✅ Limpiar también el tenant
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;