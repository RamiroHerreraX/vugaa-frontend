// src/services/auth.js
import API from './api';

export const login = async (email, password, tenant) => {
  try {
    const response = await API.post('/auth/login', { email, password, tenant });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};