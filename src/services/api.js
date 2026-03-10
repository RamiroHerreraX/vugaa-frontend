import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
});

// Interceptor para añadir el token y tenant a cada solicitud
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tenant = localStorage.getItem('selectedTenant') || 'caaarem';
    
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

    // 🔴 NUEVO: Si es un error 401 en logout, NO lo tratamos como error
    if (originalRequest.url?.includes('/auth/logout') && error.response?.status === 401) {
      console.log('Logout: Token ya no es válido, ignorando error');
      // Devolvemos una respuesta exitosa simulada para no interrumpir el flujo
      return Promise.resolve({ 
        data: { success: true, message: 'Logout local completado' } 
      });
    }

    // Si es error 401 (No autorizado) y no es un intento de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
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
        // Si no se puede refrescar, cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;