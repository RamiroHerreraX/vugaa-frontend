// src/utils/constants.js
export const ROLES = {
  SUPERADMIN: 'supera',
  ADMIN: 'admin',
  COMITE: 'comite',
  ASOCIACION: 'asociacion',
  AGENTE: 'agente',
  PROFESIONISTA: 'profesionista',
  EMPRESARIO: 'empresario'
};

export const ROUTES = {
  LOGIN: '/login',
  SUPERADMIN: '/supera',
  ADMIN: '/admin',
  COMITE: '/committee',
  ASOCIACION: '/association',
  USER: '/dashboard'
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api/v1';