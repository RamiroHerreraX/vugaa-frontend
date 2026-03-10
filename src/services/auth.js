// src/services/auth.js
import API from './api';

export const login = async (email, password, tenant) => {
  try {
    const response = await API.post('/auth/login', { email, password }, {
      headers: {
        'X-Tenant-ID': tenant
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión' };
  }
};

export const logout = async () => {
  const tenant = localStorage.getItem('tenant');

  await API.post('/auth/logout', {}, {
    headers: {
      'X-Tenant-ID': tenant
    }
  });

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('tenant');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const recuperarPassword = async (email) => {
  try {
    const response = await API.post('/auth/recuperar-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión' };
  }
};

export const restablecerPassword = async (token, nuevaPassword, confirmarPassword) => {
  try {
    const response = await API.post('/auth/restablecer-password', {
      token,
      nuevaPassword,
      confirmarPassword
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión' };
  }
};

export const verificarToken = async () => {
  try {
    const response = await API.get('/auth/verificar-token');
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Token no válido' };
  }
};